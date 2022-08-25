// pages/home/index.js
const {
    Http
} = require('../../utils/http')
const {
    home
} = require('../../utils/api')
Page({
    /**
     * 页面的初始数据
     */
    data: {
        swiperList: [], //轮播图列表
        dataList: [], //商品列表
        noticeList: [], //通知列表
        obj: {},
    },
    // 云函数测试
    test() {
        wx.cloud.callFunction({
            // 云函数名称
            name: 'getSwiper',
            // 传给云函数的参数
            success: function (res) {
                //   console.log(res.result) // 3
            },
            fail: console.error
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        setTimeout(() => {
            // console.log(1);
        }, 1000);
        wx.showLoading({
            title: '数据加载中',
        })
        // 获取轮播图
        home.getSwiper({}).then(res => {
            this.setData({
                swiperList: res
            })
            wx.hideLoading()
        })
        // 获取通知轮播数据
        home.getNotice({}).then(res => {
            this.setData({
                noticeList: res.records
            })
        })
        // 获取首页所有数据
        home.getAllData({}).then(res => {
            const data = res.map(item => {
                const newItem = item.productDtoList.map(newItem => {
                    const newPrice = newItem.price.toString().split('.')
                    return {
                        ...newItem,
                        price: newPrice[0],
                        priceDot: newPrice[1] ? newPrice[1] : "00"
                    }
                })
                return {
                    ...item,
                    productDtoList: newItem
                }
            })
            this.setData({
                dataList: data
            })
        })
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        console.log(2);
        // 监听页面是否登录 是否存在token
        const isLogin = wx.getStorageSync('token')
        if (!isLogin) {
            wx.navigateTo({
                url: '/pages/login/index',
            })
        }
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {
        return {
            title: '这是我的首页',
            desc: '我的首页',
            // path: '/page/user?id=123' // 路径，传递参数到指定页面。
        }
    },
    // 跳详情
    toDetail(e) {
        console.log(e.currentTarget.dataset.id);
        const {
            id
        } = e.currentTarget.dataset
        console.log(id);
        wx.navigateTo({
            url: `/pages/detail/index?id=${id}`,
        })
    },
    //跳新品推荐
    toRecommend() {
        wx.navigateTo({
            url: '/pages/recommend/index',
        })
    },
    //跳每日疯抢 
    dailyCrazy() {
        wx.navigateTo({
            url: '/pages/dailyCrazy/index',
        })
    },
    // 去搜索页
    toSearch() {
        wx.navigateTo({
            url: '/pages/search/index',
        })
    },
    // 转发朋友圈
    onShareTimeline() {

    }
})