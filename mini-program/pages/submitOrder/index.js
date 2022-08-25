// pages/submitOrder/index.js
const {
    order
} = require('../../utils/api')
Page({
    /**
     * 页面的初始数据
     */
    data: {
        submitList: [],
        actualTotal: 0,
        total: 0,
        totalCount: 0,
        orderReduce: 0,
        transfee: 0,
        defaultAddress: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.setNavigationBarTitle({
            title: '提交订单',
        })
        this.getList(options.orderEntry)
    },
    // 获取订单列表
    getList(orderEntry) {
        // 加入购物车方式获取订单
        // const orderEntry = 0
        // wx.getStorageSync('basketIds') ? wx.getStorageSync('basketIds') : ''
        const data = {
            addrId: 0,
            basketIds: orderEntry == 0 ? wx.getStorageSync('basketIds') : undefined, //商品id
            orderItem: orderEntry == 1 ? wx.getStorageSync('orderItem') : undefined,
        }
        order.getOrderList(data).then(res => {
            this.setData({
                defaultAddress: res.userAddr
            })
            let list = res.shopCartOrders[0].shopCartItemDiscounts[0].shopCartItems
            this.setData({
                submitList: list,
                total: res.total,
                totalCount: res.totalCount,
                orderReduce: res.orderReduce,
                actualTotal: res.actualTotal,
                transfee: list.transfee
            })
        })
    },
    // 提交订单
    sumbitOrder() {
        const data = {
            orderShopParam: [{
                remarks: '',
                shopId: 1
            }]
        }

        order.getSubmit(data).then(res => {
            const orderNumbers = res.orderNumbers
            const data = {
                orderNumbers,
                payType: 1
            }
            order.getToPay(data).then(res => {
                if (res) {
                    wx.requestPayment({
                        timeStamp: '',
                        nonceStr: '',
                        package: '',
                        signType: 'MD5',
                        paySign: '',
                        success(res) {},
                        fail(res) {}
                    })
                }
            })
        })
    },
    // 
    // 去我的订单列表
    toEditAddress(e){
        const id=e.currentTarget.dataset.id;
        wx.navigateTo({
          url: `/pages/editorAddress/index?id=${id}`,
        })
      console.log(e.currentTarget.dataset.id);
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