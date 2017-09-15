// theme.js

import { Category } from 'category-model.js';
var category = new Category;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        currentTabsIndex: 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var id = options.id;
        var name = options.name;
        var type = options.type;
        this.setData({
            id: id,
            name: name,
            type: type
        })
        this._loadData();
    },

    onReady: function () {
        wx.setNavigationBarTitle({
            title: this.data.name,
        })
    },

    _loadData: function () {
        //获取分类信息
        category.getProductorData(this.data.id, (res) => {
            this.setData({
                'themeInfo': res
            });
        });

        //获取分类下传统商品列表
        category.getProductsByCategory(this.data.id, (res) => {
            this.setData({
                'categoryProducts': res
            });
        });
        //获取分类下预约商品列表
        category.getTimesByCategory(this.data.id, (res) => {
            this.setData({
                'categoryTimes': res
            });
        });

        //获取分类下视频列表
        category.getVideosByCategory(this.data.id, (res) => {
            this.setData({
                'categoryVideos': res
            });
        });
    },

    //tab切换详情面板 
    onTabsItemTap: function (event) {
        var index = category.getDataSet(event, 'index');
        this.setData({
            currentTabsIndex: index
        });
    },

    //点击查看商品详情
    //同时将商品的分类信息传入商品详情，以便商品推荐使用
    onProductsItemTap: function (event) {
        var id = category.getDataSet(event, 'id');
        var type = category.getDataSet(event, 'type');
        wx.navigateTo({
            url: '../product/product?id=' + id + '&type=' + type,
        })
    },

    //点击查看视频详情
    //同时将视频的分类信息传入视频详情，以便视频推荐使用
    onProductsVideoTap: function (event) {
        var id = category.getDataSet(event, 'id');
        var type = category.getDataSet(event, 'type');
        wx.navigateTo({
            url: '../video/video?id=' + id + '&type=' + type,
        })
    },
    //头图滑动变大
    // onTouchMove: function (event) {
    //     let currentY = event.touches[0].pageY
    //     let ty = currentY - this.data.lastY
    //     let text = ""
    //     if (ty < 0) {
    //         console.log("向上滑动");
    //         if (ty <= -100) {
    //             ty = -100;
    //             this.data.distanceY = ty;
    //             this.change(currentY);
    //         }
    //     } else if (ty > 1) {

    //         console.log("向下滑动")
    //         if(ty>=100){
    //             ty=100;
    //             this.data.distanceY = ty;
    //             this.change(currentY);
    //         }
    //     }
    // },
    // change: function (currentY){
    //     var newScale =  0.005 * this.data.distanceY;
    //     var animation = wx.createAnimation({
    //         transformOrigin: "50% 50%",
    //         duration: 0,
    //         timingFunction: 'linear',
    //     })
    //     this.animation = animation
    //     animation.width((750+750 * newScale) + 'rpx').height((560+560 * newScale) + 'rpx').left(-(750 * newScale / 2) + 'rpx').step()
    //     this.setData({
    //         animationData: animation.export()
    //     })
    //     // 将当前坐标进行保存以进行下一次计算
    //     this.data.lastY = currentY
    // },

    // onTouchStart: function (event) {
    //     this.data.lastY = event.touches[0].pageY
    // },
    // onTouchEnd: function () {
    //     var animation = wx.createAnimation({
    //         transformOrigin: "50% 50%",
    //         duration: 500,
    //         timingFunction: 'ease-in',
    //     })
    //     this.animation = animation
    //     animation.width(750 + 'rpx').height(560 + 'rpx').left(0).step()
    //     this.setData({
    //         animationData: animation.export(),
    //         lastX: 0,
    //         lastY: 0,
    //         width: 750,
    //         height: 560,
    //         left: 0,
    //         distanceY: 0,
    //     })
    // }
	onShareAppMessage: function () {
		return {
			title: this.data.name,
			path:'/pages/category/category?id='+this.data.id+'&name='+this.data.name
		}
	}

})