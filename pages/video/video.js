// video.js
import { Video } from 'video-model.js';
import { Category } from '../category/category-model.js';

var video = new Video;
var category = new Category;


Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: null,
        type: null,
        moreVideosArr: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            id: options.id,
            type: options.type
        })
        this._onLoadData();
    },

    _onLoadData() {
        //获取当前视频
        video.getVideoInfo(this.data.id, (res) => {
            this.setData({
                categoryVideo: res
            })
        })

        //获取当前视频分类下所有视屏作为推荐视频
        category.getVideosByCategory(this.data.type, (res) => {
            this.setData({
                moreVideosArr: res
            })
        })
    },
    //视频推荐进入视频详情
    onProductsVideoTap: function (event) {
        var id = video.getDataSet(event, 'id');
        var type = video.getDataSet(event, 'type');
        wx.redirectTo({
            url: '../video/video?id=' + id + '&type=' + type
        })
    },


    // /**
    //  * 页面相关事件处理函数--监听用户下拉动作
    //  */
    // onPullDownRefresh: function () {

    // },

    // /**
    //  * 页面上拉触底事件的处理函数
    //  */
    // onReachBottom: function () {

    // },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return {
			title: this.data.categoryVideo.name
            // path: 'pages/video/video?id=' + id + '&videoCategory=' + this.data.videoCategory
        }
    }
})