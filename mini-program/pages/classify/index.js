// pages/classify/index.js
const {
    Http
} = require('../../utils/http')
const {
    classify
} = require('../../utils/api')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        activeKey: 0,
        classifyList: [],
        dataList: [],
        loading:true,
        hidden:true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.showLoading({
          title: '数据加载中',
        })
        // 左侧分类接口和右侧大图
        classify.getClassifyData({}).then(res => {
            this.setData({
                classifyList: res,
                loading:false,
                hidden:false
            })
            wx.hideLoading()
        })
        // 右侧商品数据
        classify.getClassifyRData({
            categoryId: 85
        }).then(res => {
            this.setData({
                dataList: res.records
            })
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

    },
    handleClick(e) {
        this.setData({
            activeKey: e.currentTarget.dataset.myindex
        })
        // 右侧数据
        classify.getClassifyRData({
            categoryId: e.currentTarget.dataset.myid
        }).then(res => {
            this.setData({
                dataList: res.records
            })
        })
    },
    // 跳详情
    toDetail(e) {
        // console.log(e.currentTarget.dataset.id);
        const {
            id
        } = e.currentTarget.dataset
        console.log(id);
        wx.navigateTo({
            url: `/pages/detail/index?id=${id}`,
        })
    },
})