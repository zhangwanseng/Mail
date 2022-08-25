const {
    domain
} = require('./env')
// 地址 参数 方法 回调函数
function Http(url, method, data) {
    // 获取token
     const token = wx.getStorageSync('token');
    // 根据路径判断当前是否调用登录接口
    // const isLogin = url === '/login?grant_type=mini_app'
    // 没有token并且不是登录页面 跳转到登录
    // if (!token && !isLogin) {
    //     wx.navigateTo({
    //         url: '/pages/login/index.js',
    //     })
    //     return
    // }
    return new Promise((resolve, reject) => {
        wx.request({
            url: domain + url,
            data: data,
            method: method === 'undefined' ? 'POST' : method,
            dataType: 'json',
            // 请求头
            header: {
                Authorization: token ? 'bearer ' + token : ''
            },
            success(res) {
                if(res.statusCode===200){
                    resolve(res.data)
                }else if(res.statusCode===400){
                    wx.showToast({
                      title: res.data,
                      icon: 'none'
                    })
                }
            },
            fail(error) {
                reject(error)
                wx.showToast({
                    title: '请求失败',
                    icon: 'error'
                })
            }
        })
    })

}

function Login() {
    wx.login({
        success(res) {
            // console.log(res);
            if (res.code) {
                //发起网络请求
                Http('/login?grant_type=mini_app', 'POST', {
                    principal: res.code
                }).then(res => {
                    wx.reLaunch({
                      url: '/pages/home/index',
                    })
                    // console.log(res,'====');
                    wx.setStorageSync('token', res.access_token)
                })
                // if(res.statuCode===200){
                //     console.log('成功');
                // }
            } else {
                // if(res.statuCode===400){
                //     wx.showToast({
                //       title: '库存不足',
                //     })
                // }
                console.log('登录失败！' + res.errMsg)
            }
        }
    })
}
module.exports = {
    Http,
    Login
}
// exports.Http=Http

// function Http(url, method, data) {
//     return new Promise((reslove, reject) => {
//         wx.request({
//             url: domain + url,
//             data,
//             method: method === 'undefined' ? 'POST' : method,
//             success(res) {
//                 reslove(res.data)
//             },
//             fail(error) {
//                 reject(error)
//                 wx.showToast({
//                     title: '请求失败',
//                     icon: 'error'
//                 })
//             }
//         })
//     })
// }


// function Http(url, method, data, callback) {
//     wx.request({
//         url: domain + url,
//         data: data,
//         method: method === 'undefined' ? 'POST' : method,
//         success(res) {
//             callback(res.data)
//         },
//         fail(error) {
//             wx.showToast({
//                 title: '请求失败',
//                 icon: 'error'
//             })
//         }
//     })
// }

// Http('/indexImgs', {}, 'GET', (res) => {
// this.setData({
//     swiperList: res
// })
// })