// pages/searchResult/index.js
const {
    search
} = require('../../utils/api')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        defaultValue: wx.getStorageSync('mySearch') ? wx.getStorageSync('mySearch') : '', //优化 本地存储
        searchList: [],
        flag: true,
        optionArr: ['综合', '销量', '价格'],
        activeIndex: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.setNavigationBarTitle({
            title: '搜索结果',
        })
        this.setData({
            defaultValue: options.value ? options.value : ''
        })
        // search.getSearch({
        //     prodName: options.value,
        //     sort: this.data.activeIndex
        // }).then(res => {
        //     this.setData({
        //         searchList: res.records
        //     })
        // })
        this.searchResult(options.value)
    },
    // 搜索结果
    searchResult(value) {
        search.getSearch({
            prodName: value,
            sort: this.data.activeIndex
        }).then(res => {
            this.setData({
                searchList: res.records
            })
        })
    },
    // 监听输入框变化
    changeInput(e) {
        this.setData({
            defaultValue: e.detail.value
        })
        this.searchResult(this.data.defaultValue)
    },
    // 改变页面版式
    changeStyle() {
        this.setData({
            flag: !this.data.flag
        })
    },
    // 改变高亮下标
    changeIndex(e) {
        // console.log(e.currentTarget.dataset.myindex);
        this.setData({
            activeIndex: e.currentTarget.dataset.myindex
        })
        search.getSearch({
            prodName: this.data.defaultValue,
            sort: this.data.activeIndex
        }).then(res => {
            this.setData({
                searchList: res.records
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