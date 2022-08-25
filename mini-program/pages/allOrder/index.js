// pages/allOrder/index.js
const {
    order
} = require('../../utils/api')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: ['全部', '待支付', '待发货', '待收货', '已完成'],
        active: 0,
        allList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.orderList()
        wx.setNavigationBarTitle({
          title: '我的订单',
        })
    },
    // 改变下标高亮
    changeItem(e) {
        console.log(e,'11111');
        this.setData({
            active: e.currentTarget.dataset.index
        })
        this.orderList()
    },
    // 获取订单列表
    orderList() {
        console.log(this.data.active,'=====');
        order.getAllOrder({
            status:this.data.active
        }).then(res => {
            this.setData({
                allList: res.records
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

    }
})