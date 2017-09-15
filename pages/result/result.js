// pages/result/result.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		move:false,
		inTime: false,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {

	},
	onTap:function(){
		//ajax
		if(this.data.inTime){
			this.setData({
				move: true
			})
		}else{
			wx.showModal({
				title: '盒子文艺社',
				content: '对不起，该钥匙不在预约时间段内，无法开锁！',
				showCancel: false
			})
		}
	}
})