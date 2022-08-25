// pages/shopcar/index.js
const {
    debounce
} = require('../../utils/debounce')
const {
    myShop
} = require('../../utils/api')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        shopCarList: [], //购物车数据
        allSelect: false, //默认全选
        totalMoney: 0, //总价
        finalMoney: 0, //最后的价格
        subtractMoney: 0,
        count: 0, //商品件数
        basketIds: 0, //商品id
        num: 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.setNavigationBarTitle({
            title: '购物车',
        })
        this.getShopCarList()
    },
    // 获取当前购物车数据
    getShopCarList() {
        myShop.getShopCarInfo({}).then(res => {
            wx.showLoading({
                title: '数据加载中',
            })
            try {
                let myList = this.data.shopCarList;
                const shopList = res[0].shopCartItemDiscounts[0].shopCartItems.map((item, index) => {
                    return {
                        ...item,
                        // checked: myList[index] ? myList[index].checked : false
                        checked: false
                    }
                })
                // 新旧列表比较 判断是否选择(之前存在的问题是用下标判断删除后下一个商品会继承选中状态)
                myList.length > 0 && myList.forEach(item => {
                    shopList.forEach(value => {
                        if (item.prodId === value.prodId) {
                            value.checked = item.checked
                        }
                    })
                })
                const bool = shopList.length ? shopList.every(item => item.checked === true) : false;
                this.setData({
                    shopCarList: shopList.length ? shopList : [],
                    allSelect: bool,
                })
                wx.hideLoading()
                wx.setStorageSync('shopLength', this.data.shopCarList.length)
                this.setBagde()
            } catch (error) {
                this.setData({
                    shopCarList: [],
                })
                wx.hideLoading()
            }
        })
    },
    // 获取购物车数据量
    setBagde() {
        if (this.data.shopCarList.length) {
            wx.setTabBarBadge({
                index: 2,
                text: '' + wx.getStorageSync('shopLength') + '',
            })
        } else {
            wx.removeTabBarBadge({
                index: 2,
            })
        }
    },
    // 购物车--
    reduceShopCount: debounce(function (e) {
        // 获取当前选中项的index
        const index = e.currentTarget.dataset.index;
        // 获取购物车数据
        const shopCarList = this.data.shopCarList;
        // 获取选中项
        const selectedItem = shopCarList[index]
        // 调用分装的加减方法
        this.isAddOrReduce(selectedItem, -1)
        // 调用总价计算
        this.allPrice()
    }, 300),
    // 购物车++
    addShopCount: debounce(function (e) {
        // 获取当前选中项的index
        const index = e.currentTarget.dataset.index;
        // 获取购物车数据
        const shopCarList = this.data.shopCarList;
        // 获取选中项
        const selectedItem = shopCarList[index]
        // 调用分装的加减方法
        this.isAddOrReduce(selectedItem, 1)
        // 调用总价计算
        this.allPrice()
    }, 300),
    // addShopCount(e) {
    //     // 获取当前选中项的index
    //     const index = e.currentTarget.dataset.index;
    //     // 获取购物车数据
    //     const shopCarList = this.data.shopCarList;
    //     // 获取选中项
    //     const selectedItem = shopCarList[index]
    //     // 调用分装的加减方法
    //     this.isAddOrReduce(selectedItem, 1)
    //     // 调用总价计算
    //     this.allPrice()
    // },
    // 封装的加减方法
    isAddOrReduce(selectedItem, isAOrR) {
        const data = {
            basketId: 0,
            count: isAOrR,
            distributionCardNo: '',
            prodId: selectedItem.prodId,
            shopId: selectedItem.shopId,
            skuId: selectedItem.skuId,
        }
        myShop.getCount(data).then(res => {
            this.getShopCarList()
        })
    },
    // 价格的计算
    allPrice() {
        // 获取购物车数据
        const shopCarList = this.data.shopCarList;
        // 获取选中项
        const allChecked = shopCarList.filter(item => item.checked)
        // 获取商品id
        const basketIds = allChecked.map(item => item.basketId)
        // 调接口
        myShop.getTotal(basketIds).then(res => {
            const {
                totalMoney,
                finalMoney,
                subtractMoney,
                count
            } = res
            this.setData({
                totalMoney,
                finalMoney,
                subtractMoney,
                count,
            })
        })
    },
    // 删除
    handleDelete() {
        // 获取购物车数据
        const shopCarList = this.data.shopCarList;
        // 获取选中项
        const allChecked = shopCarList.filter(item => item.checked)
        // 获取商品id
        const basketIds = allChecked.map(item => item.basketId)
        myShop.getDelete(basketIds).then(res => {
            wx.showToast({
                title: '删除成功',
            })
            this.onLoad();
            this.allPrice();
            this.isAllSelected();
            if(this.data.shopCarList.length<=0){
                this.setData({
                    allSelect:false
                })
            }
        })
    },
    // 结算
    handleCount: debounce(function (e) {
        // 获取购物车数据
        const shopCarList = this.data.shopCarList;
        // 获取选中项
        const allChecked = shopCarList.filter(item => item.checked)
        // 获取商品id
        const basketIds = allChecked.map(item => item.basketId)
        wx.setStorageSync('basketIds', basketIds)
        if (basketIds.length > 0) {
            wx.navigateTo({
                // url: `/pages/submitOrder/index`,
                url: `/pages/submitOrder/index?orderEntry=0`,
            })
        } else {
            wx.showToast({
                title: '要先选中商品哦~',
                icon: 'error'
            })
        }
    }, 1000),

    // 单选
    selectItem(e) {
        // 获取当前选中项的index
        const index = e.currentTarget.dataset.index;
        // 获取购物车数据
        const shopCarList = this.data.shopCarList;
        // 获取点击项
        const checked = shopCarList[index].checked;
        // 改变点击项
        shopCarList[index].checked = !checked
        this.setData({
            shopCarList
        })
        this.isAllSelected()
        // 调用总价计算
        this.allPrice()
    },
    // 是否全选
    isAllSelected() {
        // 获取购物车数据
        let shopCarList = this.data.shopCarList;
        //   循环购物车数据 每个都选中 为true
        let allSelect = shopCarList.length ? shopCarList.every(item => item.checked === true) : false;
        this.setData({
            allSelect
        });
    },
    // 全选
    allSelect() {
        // 获取购物车数据
        let shopCarList = this.data.shopCarList;
        // 全选取反
        let allSelect = !this.data.allSelect;
        // 给购物车数据重新赋值 循环购物车数据 单选跟全选走
        // shopCarList = shopCarList.map(item => {
        //     return {
        //         ...item,
        //         checked: allSelect,
        //     }
        // })
        shopCarList.map(item => {
            item.checked = allSelect;
        })
        this.setData({
            shopCarList,
            allSelect
        });
        // 调用总价计算
        this.allPrice()
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        this.getShopCarList()
        this.setData({
            allSelect:false
        })
    },
})