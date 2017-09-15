import { Order } from '../order/order-model.js';
import { Cart } from '../cart/cart-model.js';
import { Address } from '../../utils/address.js';

var order = new Order();
var cart = new Cart();
var address = new Address();

Page({
	data: {
		summary: null,  //summary为1表示预约商品，为0表示传统商品
		countsArray: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
		featureArray: [],
		timeArray: [],
		shipArray: ['门店自提', '第三方快递'],
		orderAttrInfoObj: [{
			'product_id': 0,
			'count': 0,
			'feature': 0,
			'express': 0,
			'time': 0
		}],
		productPrice: 0,    //商品单价
		shipPrice: 0,        //商品运费
		sumMoney: 0,     //用户选择数量后总价
		orderId: null,
		fromProductFlag: true,
		addressInfo: null,
		orderStatus: 0,   //订单状态，0还未生成订单，刚从商品详情过来，可以修改地址，1未支付，2已支付
		isCanPay: true
	},

    /*
    * 订单数据来源包括两个：
    * 1.直接下单
    * 2.旧的订单
    * */
	onLoad: function (options) {
		var from = options.from;
		if (from == 'product') {
			this._fromProduct(options.productId);
			this.setData({
				orderStatus: 0
			})
		} else {
			this._fromOrder(options.OrderId);
		}
	},
	//从商品详情过来
	_fromProduct: function (pid) {
		//获取商品详情
		var that = this;
		order.getProductInfo(pid, (res) => {
			console.log(res);
			this.data.orderAttrInfoObj[0]['productId'] = res.id;
			var shipArray = [];
			if (res.summary == 1) {
				shipArray = []
			} else {
				shipArray = ['门店自提', '第三方快递']
			}
			//设置size数组
			this.setData({
				summary: res.summary,
				featureArray: this._getProductFeature(res),
				timeArray: this._getProductTime(res),
				shipArray: shipArray,
				productDetailInfo: res,
				productPrice: res.price,
				sumMoney: res.price,
				orderAttrInfoObj: this.data.orderAttrInfoObj
			})
		})
		/*显示收获地址*/
		address.getAddress((res) => {
			this._bindAddressInfo(res);
		});
	},
	//从订单列表过来
	_fromOrder: function () {

	},
	//获取商品样式
	_getProductFeature: function (res) {
		var arr = [];
		for (let i = 0; i < res.feature.length; i++) {
			var detail = res.feature[i].feature;
			arr.push(detail);
		}
		return arr;
	},
	// //获取商品尺寸
	// _getProductSize: function (res) {
	// 	var arr = [];
	// 	for (let i = 0; i < res.size.length; i++) {
	// 		var detail = res.size[i].size;
	// 		arr.push(detail);
	// 	}
	// 	return arr;
	// },
	// //获取不同种类商品不同价格
	// _getProductPriceBySize: function (res) {
	// 	var arr = [];
	// 	for (let i = 0; i < res.size.length; i++) {
	// 		var detail = res.size[i].price;
	// 		arr.push(detail);
	// 	}
	// 	return arr;
	// },
	//获取不同种类商品时间
	_getProductTime: function (res) {
		var arr = [];
		for (let i = 0; i < res.time.length; i++) {
			var detail = res.time[i].start_time;
			arr.push(detail);
		}
		return arr;
	},

	//选择商品属性
	bindPickerChange: function (e) {
		var key = e.currentTarget.dataset.type;
		var val = e.detail.value;
		this.data.orderAttrInfoObj[0][key] = val;
		console.log(this.data.orderAttrInfoObj)
		//计算价格
		let multiple = 100;
		let sumMoney = Number(this.data.countsArray[this.data.orderAttrInfoObj[0].count]) * multiple * Number(this.data.productPrice) * multiple;
		//选择完之后更新价格
		this.setData({
			orderAttrInfoObj: this.data.orderAttrInfoObj,
			sumMoney: sumMoney / (multiple * multiple) + this.data.shipPrice
		})
	},

	/*下单和付款*/
	pay: function () {
		if (!this.data.addressInfo) {
			this.showTips('下单提示', '请填写您的收货地址');
			return;
		}
		if (this.data.orderStatus == 0) {
			this._firstTimePay();
		} else {
			this._oneMoresTimePay();
		}
	},

	/*第一次支付*/
	_firstTimePay: function () {
		//将要发送的订单数据数组下标转化为具体值
		var orderInfoNum = this.data.orderAttrInfoObj;
		var orderInfo = [{}];
		orderInfo[0]['product_id'] = this.data.orderAttrInfoObj[0]['productId'];
		orderInfo[0]['count'] = this.data.countsArray[this.data.orderAttrInfoObj[0]['count']];

		if (this.data.featureArray[this.data.orderAttrInfoObj[0]['feature']] == undefined) {
			orderInfo[0]['feature'] = '';
		} else {
			orderInfo[0]['feature'] = this.data.featureArray[this.data.orderAttrInfoObj[0]['feature']];
		}

		if (this.data.timeArray[this.data.orderAttrInfoObj[0]['time']] == undefined) {
			orderInfo[0]['time'] = '';
		} else {
			orderInfo[0]['time'] = this.data.timeArray[this.data.orderAttrInfoObj[0]['time']];
		}

		if (this.data.shipArray[this.data.orderAttrInfoObj[0]['express']] == undefined) {
			orderInfo[0]['express'] = '';
		} else {
			orderInfo[0]['express'] = this.data.shipArray[this.data.orderAttrInfoObj[0]['express']];
		}

		console.log(orderInfo)
		var that = this;
		// 支付分两步，第一步是生成订单号，然后根据订单号支付
		order.doOrder(orderInfo, (data) => {
			console.log(data);
			this.data.orderId = data.order_id;
			//订单生成成功
			if (data.pass) {
				//更新订单状态
				var id = data.order_id;
				that.data.orderId = id;
				that.data.fromProductFlag = false;
				//开始支付
				that._execPay(id);
			} else {
				that._orderFail(data);  // 下单失败
			}
		});
	},
    /*
    *下单失败
    * params:
    * data - {obj} 订单结果信息
    * */
	_orderFail: function (data) {
		this.setData({
			isCanPay: false
		})
		var str = this.data.productDetailInfo.name + this.data.productDetailInfo.describe;
		str += ' 缺货';
		wx.showModal({
			title: '下单失败',
			content: str,
			showCancel: false,
			success: function (res) {

			}
		});
	},

	/* 再次次支付*/
	_oneMoresTimePay: function () {
		this._execPay(this.data.orderId);
	},

    /*
    *开始支付
    * params:
    * id - {int}订单id
    */
	_execPay: function (id) {
		if (!order.onPay) {
			this.showTips('支付提示', '本产品仅用于演示，支付系统已屏蔽', true);//屏蔽支付，提示
			return;
		}
		var that = this;
		order.execPay(id, (statusCode) => {
			//1未支付，2已支付,0未生成订单
			if (statusCode != 0) {
				var flag = statusCode == 2;
				wx.redirectTo({
					url: '../pay-result/pay-result?id=' + id + '&flag=' + flag + '&from=order'
				});
			}
		});
	},

	onShow: function () {
		//处理付款结果页面点击左上角返回订单详情，实时更新
		// if (this.data.orderId) {
		//     var that = this;
		//     //下单后，支付成功或者失败后，点左上角返回时能够更新订单状态 所以放在onshow中
		//     var id = this.data.orderId;
		//     order.getOrderInfoById(id, (data) => {
		//         console.log(data)
		//         that.setData({
		//             orderStatus: data.status,
		//             productsArr: data.snap_items,
		//             account: data.total_price,
		//             basicInfo: {
		//                 orderTime: data.create_time,
		//                 orderNo: data.order_no
		//             },
		//         });

		//         // 快照地址
		//         var addressInfo = data.snap_address;
		//         addressInfo.totalDetail = address.setAddressInfo(addressInfo);
		//         that._bindAddressInfo(addressInfo);
		//     });
		// }
	},

	/*修改或者添加地址信息*/
	editAddress: function () {
		console.log('editAddress')
		var that = this;
		wx.chooseAddress({
			success: function (res) {
				var addressInfo = {
					name: res.userName,
					mobile: res.telNumber,
					totalDetail: address.setAddressInfo(res)
				};
				that._bindAddressInfo(addressInfo);

				//保存地址
				address.submitAddress(res, (flag) => {
					if (!flag) {
						that.showTips('操作提示', '地址信息更新失败！');
					}
				});
			}
		})
	},

	/*绑定地址信息*/
	_bindAddressInfo: function (addressInfo) {
		this.setData({
			addressInfo: addressInfo
		});
	},


    /*
    * 提示窗口
    * params:
    * title - {string}标题
    * content - {string}内容
    * flag - {bool}是否跳转到 "我的页面"
    */
	showTips: function (title, content, flag) {
		wx.showModal({
			title: title,
			content: content,
			showCancel: false,
			success: function (res) {
				if (flag) {
					wx.switchTab({
						url: '/pages/my/my'
					});
				}
			}
		});
	}



})
