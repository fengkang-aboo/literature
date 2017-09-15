// var productObj = require('product-model.js');

import { Product } from 'product-model.js';
import { Cart } from '../cart/cart-model.js';
import { Category } from '../category/category-model.js';

var product = new Product();  //实例化 商品详情 对象
var cart = new Cart();
var category = new Category;

Page({
    data: {
        isFly:true,
        // loadingHidden: false,
        // hiddenSmallImg: true,
        currentTabsIndex: 0,
    },
    onLoad: function (options) {
        this.setData({
            id: options.id,
            type: options.type
        })
        this._loadData();
    },

    /*加载所有数据*/
    _loadData: function (callback) {
        var that = this;
        //获取商品详情
        product.getDetailInfo(this.data.id, (data) => {
            that.setData({
                product: data,
            });
            callback && callback();
        });
        //获取当前商品分类下所有商品作为推荐商品
        category.getProductsByCategory(this.data.type, (res) => {
            this.setData({
                moreProductsArr: res
            })
        })
    },
    
    //商品详情点击更多商品
    onProductsItemTap:function(event){
        var id = product.getDataSet(event, 'id');
        var type = product.getDataSet(event, 'type');
        wx.redirectTo({
            url: '../product/product?id=' + id + '&type=' + type
        })
    },

    //切换详情面板
    onTabsItemTap: function (event) {
        var index = product.getDataSet(event, 'index');
        this.setData({
            currentTabsIndex: index
        });
    },
    //点击查看地图
    onAddressTap:function(event){
        wx.openLocation({
            latitude: 39.899117,
            longitude: 116.47062,
            scale: 28,
            name:'黑弧数码文化传媒股份有限公司',
            address:'北京市朝阳区百子湾路32号二十二院街艺术区6号楼20号'
        })
    },

    /*提交订单*/
    submitOrder: function (events) {
        if (this.data.product.stock!=0) {
            //可以购买
            wx.navigateTo({
                url: '../order/order?productId=' + this.data.id + '&from=product'
            }); 
        }else{
            wx.showModal({
                title: '购买失败',
                content: '该商品已下架！',
                showCancel: false,
                success: function (res) {}
            });
            return;
        }
    },

    //分享效果
    onShareAppMessage: function () {
        return {
			title: this.data.product.name
            // path: '../product/product?id=' + this.data.id + '&type=' + this.data.type
        }
    }

})


