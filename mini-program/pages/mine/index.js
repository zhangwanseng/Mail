// pages/mine/index.js
const app = getApp()
const {
    collection,
} = require('../../utils/api')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        avatarImg: {},
        nickName: '',
        collectionNum:0,
    },
    // 跳转到个人设置
    toBack(){
       wx.navigateTo({
         url: '/pages/setting/index',
       })
    },
    // 点击跳到收藏
    addCollect() {
        wx.navigateTo({
            url: '/pages/collection/index',
        })
        
    },

    // 获取收藏列表
    getList() {
        collection.getCollectionList().then(res => {
            this.setData({
                collectionNum:res.total
            })
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        console.log(app);
        wx.setNavigationBarTitle({
            title: '个人中心',
        })
        this.setData({
            avatarImg: app.globalData.userInfo.avatarUrl,
            nickName: app.globalData.userInfo.nickName,
        })
        this.getList()
    },
    // 去收货地址页面
    toAddress() {
        wx.navigateTo({
            url: '/pages/address/index',
        })
    },
    // 查看全部
    lookAll(){
      wx.navigateTo({
        url: '/pages/allOrder/index',
      })
    },
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {
        if (wx.getUserProfile) {
            this.setData({
                canIUseGetUserProfile: true
            })
        }
    },
    getUserProfile(e) {
        // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
        wx.getUserProfile({
            desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
            success: (res) => {
                console.log(res)
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        })
    },
})