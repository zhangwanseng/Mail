// Components/MySearch/index.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        PlaceholderValue: {
            type: String,
            value: '搜索'
        }
    },

    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {
        // 去搜索页
        toSearch() {
            wx.navigateTo({
                url: '/pages/search/index',
            })
        }
    }
})