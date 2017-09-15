// my.js

import { Address } from '../../utils/address.js';
import { Order } from '../order/order-model.js';
import { My } from 'my-model.js';

var address = new Address();
var order = new Order();
var my = new My();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        loadingHidden:false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this._loadData();
        this._getUserAddressInfo();
    },
    _loadData: function () {
        my.getUserInfo((data) => {
            this.setData({
                userInfo: data,
                loadingHidden:true
            })
        })
    },
    //获取用户地址信息
    _getUserAddressInfo: function () {
        address.getAddress((res) => {
            this._bindAddressInfo(res);
        })
    },
    //绑定用户地址信息
    _bindAddressInfo: function (res) {
        this.setData({
            addressInfo: res
        })
    },
    /*修改或者添加地址信息*/
    editAddress: function (event) {
        var that = this;
        wx.chooseAddress({
            success: function (res) {
                var addressInfo = {
                    name: res.userName,
                    mobile: res.telNumber,
                    totalDetail: address.setAddressInfo(res)
                };
                if (res.telNumber) {
                    that._bindAddressInfo(addressInfo);
                    //保存地址
                    address.submitAddress(res, (flag) => {
                        if (!flag) {
                            that.showTips('操作提示', '地址信息更新失败！');
                        }
                    });
                }
                //模拟器上使用
                else {
                    that.showTips('操作提示', '地址信息更新失败,手机号码信息为空！');
                }
            }
        })
    },
    //进入我的订单
    onMyOrderTap: function () {
        wx.navigateTo({
            url: '../my-order/my-order',
        })
    },
    //客服电话
    onMakePhoneCall: function () {
        wx.makePhoneCall({
			phoneNumber: '010-53511056',
        })
    },
    //关于我们
    onShowModal: function () {
        wx.showModal({
            title: '盒子文艺社',
			content: '黑弧文艺社艺术生活传媒通过社区的文化艺术内容运营及服务，与中国最大量的社区家庭建立“连接”，打造群分时代下泛社区O2O平台，开发商的社区会所资源利用的渠道化，文化艺术生活化内容需求植入的渠道化，泛社区家庭用户社群化、数据化、媒体化、终端化。',
            showCancel: false
        })
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})