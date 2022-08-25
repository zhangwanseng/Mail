// pages/addAddress/index.js
const {
    area
} = require('../../../utils/api')
let indexArr = [0, 0, 0]
Page({
    /**
     * 页面的初始数据
     */
    data: {
        isName: '', //收货人
        isPhone: '', //手机号
        latitude: '', //纬度
        longitude: '', //经度
        address: {
            pInput: '', //省市区
            aInput: '', //具体位置
        },
        // 级联的页面初始数据
        addrArr: [0, 0, 0], //选择地址之后的数组
        privinceArr: [], //省份数据
        cityArr: [], //市数据
        areaArr: [], //区数据
        privinceName: [], //省份名称
        cityName: [], //市名称
        areaName: [], //区名称
        privinceId: [], //省份id
        cityId: [], //市id
        areaId: [], //区id
        show: false,
        finallyData: '',
        detailAddress:'',
    },
    // 初始化三级数据
    initGradeData(priId, cityId, areaId) {
        const that = this;
        area.getArea({
            pid: 0
        }).then(res => {
            this.setData({
                privinceArr: res
            })
            if (priId) {
                const curIndex = res.findIndex(item => item.areaId === priId)
                this.setData({
                    addrArr: [curIndex, that.data.addrArr[1], that.data.addrArr[2]]
                })
            }
            // indexArr=[priId?priId:res[0].areaId,cityId,areaId]
            this.getCityData(priId ? priId : res[0].areaId, cityId, areaId)
        })
    },
    // 获取市的数据
    getCityData(priId, cityId, areaId) {
        const that = this
        area.getArea({
            pid: priId
        }).then(res => {
            this.setData({
                cityArr: res
            })
            if (cityId) {
                const curIndex = res.findIndex(item => item.areaId === cityId)
                this.setData({
                    addrArr: [that.data.addrArr[0], curIndex, that.data.addrArr[2]]
                })
            }
            this.getAreaData(cityId ? cityId : res[0].areaId, areaId)
        })
    },
    // 获取区的数据
    getAreaData(cityId, areaId) {
        area.getArea({
            pid: cityId
        }).then(res => {
            this.setData({
                areaArr: res
            })
            if (areaId) {
                this.setData({
                    privinceName: this.data.privinceName,
                    cityName: this.data.cityName,
                    areaName: this.data.areaName,
                    privinceId: this.data.privinceId,
                    cityId: this.data.cityId,
                    areaId: this.data.areaId,
                })
            } else {
                const [pIndex, cIndex, aIndex] = this.data.addrArr
                this.setData({
                    privinceName: this.data.privinceArr[pIndex].areaName, //省份名称
                    cityName: this.data.cityArr[cIndex].areaName, //市名称
                    areaName: this.data.areaArr[aIndex].areaName, //区名称
                    privinceId: this.data.privinceArr[pIndex].areaId, //省份id
                    cityId: this.data.cityArr[cIndex].areaId, //市id
                    areaId: this.data.areaArr[aIndex].areaId, //区id
                })
            }
            // indexArr=[cityId,areaId?areaId:res[0].areaId]
        })
    },
    // 关闭弹窗
    onClose() {
        this.setData({
            show: false
        })
    },
    // 滑动页面数据变化
    changeLocation(e) {
        // 获取当前选中项的数组 有几列数组就有几个值
        const value = e.detail.value;
        // 判断当前是哪列数据在滑动
        // 省份滑动
        if (indexArr[0] !== value[0]) {
            // 归0
            value[1] = 0;
            value[2] = 0;
            const privChangeIndex = value[0];
            // 获取市数据
            this.getCityData(this.data.privinceArr[privChangeIndex].areaId)
        } else if (indexArr[1] !== value[1]) {
            // 区归0
            value[2] = 0;
            const cityChangeIndex = value[1]
            // 获取 区 数据
            this.getAreaData(this.data.cityArr[cityChangeIndex].areaId)
        }
        // 保存全局变量
        indexArr = value;
        const [pIndex, cIndex, aIndex] = value
        this.setData({
            addrArr: [value[0], value[1], value[2]],
            privinceName: this.data.privinceArr[pIndex].areaName, //省份名称
            cityName: this.data.cityArr[cIndex].areaName, //市名称
            areaName: this.data.areaArr[aIndex].areaName, //区名称
            privinceId: this.data.privinceArr[pIndex].areaId, //省份id
            cityId: this.data.cityArr[cIndex].areaId, //市id
            areaId: this.data.areaArr[aIndex].areaId, //区id
            finallyData: this.data.privinceArr[pIndex].areaName + this.data.cityArr[cIndex].areaName + this.data.areaArr[aIndex].areaName
        })
    },
    // 监听收货人姓名变化
    handleIsName(e) {
        this.setData({
            isName: e.detail.value
        })
    },
    // 监听手机号变化
    handleIsPhone(e) {
        this.setData({
            isPhone: e.detail.value
        })
    },
    // 监听详细地址变化
    handleDetailAddress(e){
      this.setData({
        detailAddress:e.detail.value
      })
    },
    // 监听地址变化
    isArea() {
        // this.getLocation()  //微信地图的方式
        // 三级联动的方式
        this.setData({
            show: true
        })
    },
    // 获取地址
    getLocation() {
        const that = this
        // 获取当前地理位置信息
        wx.getLocation({
            success(res) {
                that.setData({
                    latitude: res.latitude,
                    longitude: res.longitude,
                })
                that.chooseLocation()
            },
            fail() {
                that.getSetting()
            }
        })
    },
    // 选择地址
    chooseLocation(latitude = '', longitude = '') {
        const that = this
        // 获取选择的地理位置信息
        wx.chooseLocation({
            latitude,
            longitude,
            success(res) { //res.address是地址
                // console.log(res, '选择的地址信息');
                const reg = /(区|县)/
                const index = res.address.match(reg).index;
                const pInput = res.address.substr(0, index + 1)
                const aInput = res.address.substr(index + 1, res.address.length) + res.name;
                that.setData({
                    address: {
                        pInput,
                        aInput
                    }
                })
            }
        })
    },
    // 设置是否可以本地选址
    getSetting() {
        const that = this
        wx.getSetting({
            success(res) {
                // console.log(res, '设置本地选址=====');
                const status = res.authSetting;
                if (!status['scope.userLocation']) {
                    wx.showModal({
                        title: '是否获取当前地理位置',
                        content: '拒绝则无法使用选址功能',
                        success(res) {
                            console.log(res);
                            if (!res.confirm) {
                                wx.showToast({
                                    title: '授权失败',
                                })
                            } else {
                                wx.openSetting({
                                    success(res) {
                                        const status = res.authSetting;
                                        if (!status['scope.userLocation']) {
                                            wx.showToast({
                                                title: '设置授权失败',
                                            })
                                        } else {
                                            that.getLocation()
                                        }
                                    }
                                })
                            }
                        }
                    })
                }
            }
        })
    },
    // 保存收货地址
    saveAddress() {
        // 地图选址的功能保存收货地址
        // const data = {
        //     isName: this.data.isName,
        //     isPhone: this.data.isPhone,
        //     pInput: this.data.address.pInput,
        //     aInput: this.data.address.aInput
        // }
        // let arr = wx.getStorageSync('myAddress') ? wx.getStorageSync('myAddress') : [];
        // arr ? arr.push(data) : arr
        // wx.setStorageSync('myAddress', arr)
        // wx.navigateTo({
        //     url: `/pages/address/index`,
        // })
        // 三级联动保存收货地址
        const data={
            addr: this.data.detailAddress,//地址
            addrId: 0,//地址ID
            area: this.data.areaName,//区
            areaId: this.data.areaId,//区ID
            city: this.data.cityName,//城市
            cityId:this.data.cityId,//城市ID
            mobile: this.data.isPhone,//手机
            province: this.data.privinceName,//省
            provinceId: this.data.privinceId,//省id
            receiver: this.data.isName//收货人
        }
        area.getAddArea(data).then(res=>{
          wx.showToast({
            title: '添加地址成功~',
          })
          wx.navigateBack({
            delta: 1,
          })
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.setNavigationBarTitle({
            title: '新增收货地址',
        })
        this.initGradeData()
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