// pages/commend/index.js
const {home}=require('../../utils/api')
Page({

    /**
     * 页面的初始数据
     */
    data: {
      commendList:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.showLoading({
          title: '数据加载中',
        })
        wx.setNavigationBarTitle({
          title: '新品推荐',
        })
      home.getCommend({}).then(res=>{
        console.log(res.records);  
        this.setData({
            commendList:res.records
        })
        wx.hideLoading()
      })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})