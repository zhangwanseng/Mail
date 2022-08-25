// pages/search/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        historyList: [],
        inputValue: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.setNavigationBarTitle({
            title: '搜索',
        })
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        this.setData({
            historyList: wx.getStorageSync('history')
        })
    },

    // 回车后添加值
    addSearch(e) {
        // 如果直接把搜索项传到结果页 刷新可能丢失 数据不持久 优化为本地存储
        wx.setStorageSync('mySearch', e.detail.value)
        this.searchHistory(e.detail.value.trim()) //传值 去重
        wx.navigateTo({
            url: `/pages/searchResult/index?value=${e.detail.value}`,
        })
        // 清空输入框的值
        this.setData({
            inputValue: ''
        })
    },
    // 存储搜索记录
    searchHistory(value) {
        // 获取历史记录
        const history = wx.getStorageSync('history') ? wx.getStorageSync('history') : []
        history.includes(value) ? history : history && history.unshift(value)
        wx.setStorageSync('history', history);
        // const index = history.findIndex(item => item === value)
        // if (history && index < 0) {
        // history.push(value)
        // wx.setStorageSync('history', history);
        // }
    },
    // 清空搜索历史
    clearSearch() {
        let that = this
        wx.showModal({
            title: '确定要删除搜索历史记录吗？',
            success(res) {
                if (res.confirm) {
                    wx.removeStorageSync('history')
                    that.setData({
                        historyList: []
                    })
                    wx.showToast({
                        title: '删除成功',
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },
    // 点击取消
    handleCancle(){
        this.setData({
            inputValue:''
        })
    }
})