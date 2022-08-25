const {
    area
} = require("../../utils/api")

// pages/address/index.js
Page({
    /**
     * 页面的初始数据
     */
    data: {
        addressList: [],
        isChecked: false, //设置默认地址
        myAddrIds:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.setNavigationBarTitle({
            title: '收货地址',
        })
        this.getDefaultAddress()
    },
    // 去新增收货地址页面
    toAddAddress() {
        wx.navigateTo({
            url: '/Addr/pages/addAddress/index',
        })
    },
    // 获取默认的收货地址
    getDefaultAddress() {
        // wx.getStorageSync('myAddress')?wx.getStorageSync('myAddress'):'暂无数据'
        // this.setData({
        //     addressList:
        // })
        area.getAreaList().then(res => {
            this.setData({
                addressList: res
            })
        })
    },
    // 设置默认地址
    setDefault(e) {
        const addrId = e.currentTarget.dataset.myid
        area.getDefaultAddress(addrId).then(res => {
            this.getDefaultAddress()
        })
    },
    // 跳到编辑页面
    editAddress(e) {
       const id=e.currentTarget.dataset.id
        wx.navigateTo({
            url: `/pages/editorAddress/index?id=${id}`,
        })
    },
})