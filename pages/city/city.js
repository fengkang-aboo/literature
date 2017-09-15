// city.js
import { Config } from "../../utils/config.js";

Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            cityName: options.cityName
        })
    },

    chooseCityTap: function (event) {
        Config.cityName = event.currentTarget.dataset.name;
        Config.cityCode = event.currentTarget.dataset.code;
        wx.switchTab({
            url: '../home/home'
        })
    },



    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})