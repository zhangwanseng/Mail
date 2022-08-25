// pages/detail/index.js
const {
    debounce
} = require('../../utils/debounce')
const {
    detail,
    myShop
} = require('../../utils/api')
const {
    formatHtml
} = require('../../utils/format')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        dataList: [],
        detailList: {},
        imgList: [], //轮播图数据
        flag: false, //改变收藏状态
        price: 0, //小数点前价格
        priceDot: 0, //小数点后价格
        content: '', //富文本内容
        show: false, //控制弹窗显示隐藏
        skuList: [], //详情的skuList列表   [{},{},{},{},{}]
        selectProp: {}, //点击选项选中的对象
        selectPropArr: [], //选择的数组
        // defaultSelectedObj: [], //默认选择的对象
        allPropRender: {}, //最终渲染的sku列表
        allProperties: [], //所有选项集合
        propKeys: [], //所有集合名称,
        // indexs: 0, //默认规格下标
        myPrice: 0, //弹窗选中项的价格
        myId: 0, //弹窗选中项的id
        myImg: '', //弹窗选中项的图
        myName: '', //弹窗选中项的名称
        detailId: '', //详情页id
        myCount: 1, //商品数量
        shopId: 0, //店铺id
        length: 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // wx.showLoading()
        wx.setNavigationBarTitle({
            title: '商品详情',
        })
        wx.setStorageSync('detailId', options.id)
        this.setData({
            detailId: options.id,
            length: wx.getStorageSync('shopLength')
        })
        detail.getDetail({
            prodId: wx.getStorageSync('detailId') ? wx.getStorageSync('detailId') : options.id
        }).then(res => {
            const newPrice = res.price.toString().split('.')
            this.setData({
                dataList: res,
                imgList: res.imgs && res.imgs.split(','),
                price: newPrice[0],
                priceDot: newPrice[1] ? newPrice[1] : "00",
                content: formatHtml(res.content),
                skuList: res.skuList,
                shopId: res.shopId,
            })
            // console.log(this.data.content);
            this.groupSku()
        })
        this.isCollection()
    },
    // 获取评论
    // getComment() {
    //     myShop.getComment({
    //         content: '内容',
    //         score: 1
    //     }).then(res => {
    //         console.log(res);
    //     })
    // },

    // 立即购买
    purchase() {
        const orderItem = {
            prodCount: this.data.myCount,
            prodId: Number(this.data.detailId),
            shopId: this.data.shopId,
            skuId: this.data.myId
        }
        wx.setStorageSync('orderItem', orderItem)
        wx.reLaunch({
            url: `/pages/submitOrder/index?orderEntry=1`,
        })
    },
    // 组合sku列表
    groupSku() {
        const skuList = this.data.skuList; //[{oriPrice:'',pic:'',price:'',properties:'',skuId:'',skuName:'',stocks:''},{},{},{},{},{}]
        let allProperties = this.data.allProperties;
        const propKeys = this.data.propKeys;
        skuList.forEach((item, index) => {
            // 找出默认选择的规格
            allProperties.push(skuList[index].properties) //把所有数据都填进去
            const selectProp = this.data.selectProp;
            const selectPropArr = this.data.selectPropArr;
            const properties = skuList[index].properties; //版本:换修无忧版;颜色:深空灰色;内存:64GB
            const propArr = properties.split(';'); // ["版本:换修无忧版", "颜色:深空灰色", "内存:64GB"]
            const allPropRender = this.data.allPropRender; //接下来循环的目的是 换成 {版本:['值']，颜色:['值'],内存:['值']}
            propArr.forEach((value, key) => {
                const propArrs = propArr[key].split(':') //["版本", "换修无忧版"] ["颜色", "深空灰色"] ["内存", "64GB"]
                let prop = allPropRender[propArrs[0]] //undefined
                // 默认选中规格
                if (index == 0) {
                    propKeys.push(propArrs[0])
                    selectPropArr.push(propArrs[1])
                    selectProp[propArrs[0]] = propArrs[1]
                    // 后期渲染项
                    this.setData({
                        myPrice: skuList[0].price,
                        myId: skuList[0].skuId,
                        myImg: skuList[0].pic,
                        myName: skuList[0].skuName,
                    })
                }
                if (prop === undefined) { //第一次循环进的条件
                    prop = []
                    prop.push(propArrs[1]) //["换修无忧版"] ["深空灰色"] ["64GB"]
                } else {
                    if (!prop.includes(propArrs[1])) { //为了不点击到重复项
                        prop.push(propArrs[1])
                    }
                }
                allPropRender[propArrs[0]] = prop; //allPropRender 是 {string:[],string:[],string:[]}
                this.setData({
                    selectPropArr
                })
            })
            this.setData({
                allPropRender,
                allProperties,
                selectProp
            })
        })
    },
    // 接受点击项商品规格的数据
    chooseItem(e) {
        const key = e.currentTarget.dataset.key;
        const value = e.currentTarget.dataset.value;
        const selectProp = this.data.selectProp; // {版本: "换修无忧版", 颜色: "银色", 内存: "512GB"} 
        const skuList = this.data.skuList;
        selectProp[key] = value; //把选中项整成一个包含键名键值的对象 
        let a = '' //原厂延保版深空灰色64GB
        for (let key in selectProp) {
            a += selectProp[key]
        }
        skuList.forEach((item, index) => {
            // 把skuName中的 换修无忧版 深空灰色 64GB  里面的空格替换掉和a作比较
            if (skuList[index].skuName.replace(/\s/g, '') == a) {
                this.setData({
                    myPrice: skuList[index].price,
                    myId: skuList[index].skuId,
                    myImg: skuList[index].pic,
                    myName: skuList[index].skuName,
                })
            }
        })
        this.setData({
            selectProp,
            // indexs: e.currentTarget.dataset.index
        })
        this.activedProps()
    },
    // 处理选中项 
    activedProps() {
        const selectPropArr = [];
        const selectProp = this.data.selectProp; //{版本: "原厂延保版", 颜色: "深空灰色", 内存: "512GB"}
        for (var key in selectProp) { //key 版本 颜色  内存
            selectPropArr.push(selectProp[key]) //["换修无忧版", "银色", "512GB"]
        }
        this.setData({
            selectPropArr
        })
        // console.log(selectPropArr,'=======');
    },
    // 去评论页面
    toCommend() {

    },
    // 关闭
    onClose() {
        this.setData({
            show: false
        });
    },
    // 加加减减
    onChange: debounce(function (e) {
        this.setData({
            myCount: event.detail ? event.detail : 1
        })
    }, 1000),
    //  显示
    handleShow() {
        this.setData({
            show: true
        })
    },
    // 改变收藏状态
    changeCollect: debounce(function (e) {
        detail.getCollection(this.data.detailId).then(res => {
            this.setData({
                flag: !this.data.flag
            })
        })
    }, 1000),
    // 查看默认收藏状态
    isCollection() {
        detail.getIsCollection({
            prodId: this.data.detailId
        }).then(res => {
            this.setData({
                flag: res
            })
        })
    },
    // 加入购物车
    addShopCar: debounce(function (e) {
        let data = {
            basketId: 0, //购物车ID
            count: this.data.myCount, //商品个数
            prodId: Number(this.data.detailId), //商品ID
            shopId: this.data.shopId, //店铺ID
            skuId: this.data.myId, //skuId
        }
        myShop.getAddShop(data).then(res => {
            wx.showToast({
                title: '添加成功',
                icon: 'success'
            })
            this.onClose()
        })
    }, 1000),
    // 去首页
    toHome: debounce(function (e) {
        // navigateTo并不跳转tabbar页面
        wx.switchTab({
            url: '/pages/home/index',
        })
    }, 1000),
    // 去购物车页面
    toShopCar() {
        wx.redirectTo({
            url: '/pages/shopcar/index',
        })
    },

})