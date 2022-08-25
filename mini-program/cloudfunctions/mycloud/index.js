// 云函数入口文件
const cloud = require('wx-server-sdk');
const { Http } = require('../../utils/http');

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    console.log("屈楚萧");
    
    return {
        event,
        openid: wxContext.OPENID,
        appid: wxContext.APPID,
        unionid: wxContext.UNIONID,
    }
}