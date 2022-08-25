// pages/collection/index.js
const {collection}=require('../../utils/api')
Page({

    /**
     * 页面的初始数据
     */
    data: {
       collectionList:[]
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.setNavigationBarTitle({
            title: '收藏列表',
        })
        this.getList()
    },
    // 获取收藏列表
    getList(){
        collection.getCollectionList().then(res=>{
            this.setData({
                collectionList:res.records
            })
        })
    },
    // 跳详情
    toDetail(e){
        const {
            id
        } = e.currentTarget.dataset
        wx.navigateTo({
            url: `/pages/detail/index?id=${id}`,
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
      this.getList()
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