const {Http}=require('./http')
const home={//首页
    getSwiper:(data)=>Http('/indexImgs','GET',data),
    getNotice:(data)=>Http('/shop/notice/noticeList','GET',data),
    getAllData:(data)=>Http('/prod/tagProdList','GET',data),
    getCommend:(data)=>Http('/prod/lastedProdPage','GET',data),
    getDaliyCrazy:(data)=>Http('/prod/moreBuyProdList','GET',data)
}
const classify={//分类
    getClassifyData:(data)=>Http('/category/categoryInfo','GET',data),
    getClassifyRData:(data)=>Http('/prod/pageProd','GET',data)
}
const detail={//详情
    getDetail:(data)=>Http('/prod/prodInfo','GET',data),
    getCollection:(data)=>Http('/p/user/collection/addOrCancel','POST',data),
    getIsCollection:(data)=>Http('/p/user/collection/isCollection','GET',data)
}
const search={//搜索
    getSearch:(data)=>Http('/search/searchProdPage','GET',data)
}
const myShop={//购物车
    getAddShop:(data)=>Http('/p/shopCart/changeItem','POST',data),//添加购物车
    getShopCarInfo:(data)=>Http('/p/shopCart/info','POST',data),//获取购物车信息
    getCount:(data)=>Http('/p/shopCart/changeItem','POST',data),//获取数量,
    getTotal:(data)=>Http('/p/shopCart/totalPay','POST',data),//获取选中购物项总计、选中的商品数量
    getDelete:(data)=>Http('/p/shopCart/deleteItem','DELETE',data),//删除选中商品
    getComment:(data)=>Http('/prodComm','POST',data)
}
const order={//订单
    getOrderList:(data)=>Http('/p/order/confirm','POST',data),//结算，生成订单信息
    getSubmit:(data)=>Http('/p/order/submit','POST',data),//提交订单，返回支付流水号
    getToPay:(data)=>Http('/p/order/normalPay',"POST",data),//获取支付号
    getAllOrder:(data)=>Http('/p/myOrder/myOrder','GET',data)
}
const collection={//收藏
    getCollectionList:(data)=>Http('/p/user/collection/prods','GET',data)
}
const area={//地址
    getArea:(data)=>Http('/p/area/listByPid','GET',data),//获取省市区数据
    getAddArea:(data)=>Http('/p/address/addAddr','POST',data),//获取新增用户地址接口
    getAreaList:(data)=>Http(`/p/address/list`,'GET',data),//获取收货地址列表
    getDefaultAddress:(addrId)=>Http(`/p/address/defaultAddr/${addrId}`,'PUT'),//获取默认地址
    getCallBack:(addrId)=>Http(`/p/address/addrInfo/${addrId}`,'GET'),//回显获取数据列表
    getEditAddress:(data)=>Http(`/p/address/updateAddr`,'PUT',data),//编辑地址列表
    getDeleteAddress:(addrId)=>Http(`/p/address/deleteAddr/${addrId}`,'DELETE'),//删除
}
module.exports={
    home,classify,detail,search,myShop,order,collection,area
}