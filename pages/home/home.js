// home.js

import { Home } from 'home-model.js';
var home = new Home();
//引入全局变量
import { Config } from "../../utils/config.js";

console.log(Config.cityCode)

Page({

    /**
     * 页面的初始数据
     */
    data: {
        cityName:null,
        adcode:0
    },

    onShow: function () { 
        console.log(Config.cityCode)
        //地理定位
        if (Config.cityCode == 0 || Config.cityCode == undefined || Config.cityCode==null){
            var that = this;
            wx.getLocation({
                type: 'gcj02', //返回可以用于wx.openLocation的经纬度
                success: function (res) {
                    var latitude = res.latitude
                    var longitude = res.longitude
                    wx.request({
                        url: 'https://apis.map.qq.com/ws/geocoder/v1/',
                        data: {
                            location: latitude + ',' + longitude,
                            key: 'UE6BZ-4OMK3-LZ23V-3EW4Z-5J6E3-PCFMJ'
                        },
                        success: function (res) {
                            var cityName = res.data.result.ad_info.city;
                            var adcode = res.data.result.ad_info.adcode;
                            Config.cityName = cityName;
                            Config.cityCode = adcode;
                            that.setData({
                                cityName: cityName,
                                adcode: adcode
                            })
                        }
                    })
                }
            })
        }else{
            this.setData({
                cityName: Config.cityName,
                adcode: Config.cityCode
            }) 
        }
        //获取数据
        this._loadData();
    },

    _loadData: function () {
        var id = 1;
        home.getBannerData(id, (res) => {
            this.setData({
                'bannerArr': res
            });
        });

        home.getProductsData((res) => {
            this.setData({
                'productsArr': res
            });
        });
    },

    //推荐商品进入商品详情
    onProductsItemTap: function (event) {
        var id = home.getDataSet(event, 'id');
        var type = home.getDataSet(event, 'type');
        wx.navigateTo({
            url: '../product/product?id=' + id + '&type=' + type,
        })
    },

    //商品分类进入商品列表
    onCategoryItemTap: function (event) {
        var id = home.getDataSet(event, 'id');
        var name = home.getDataSet(event, 'name');
        wx.navigateTo({
            url: '../category/category?id=' + id + '&name=' + name,
        })
    },

    //bannner点击跳转
    onBannerTap: function (event) {
        var name = home.getDataSet(event, 'key');
        var id = home.getDataSet(event, 'type');
        if (id != 0) {
            wx.navigateTo({
                url: '../category/category?id=' + id + '&name=' + name,
            })
        }
    },

    //点击选择城市
    onCityTap:function(event){
        wx.navigateTo({
            url: '../city/city?cityName=' + this.data.cityName
        })
    },

    //分享效果
    onShareAppMessage: function () {
        // return {
        //     title: "文艺社",
        //     path: "/pages/home/home"
        // }
    }
})