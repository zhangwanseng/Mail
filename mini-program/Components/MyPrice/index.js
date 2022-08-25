// Components/MyPrice/index.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
       price:{
           type:String|Number,
           value:"0.00"
       },
       signal:{
           type:String,
           value:"￥"
       }
    },
    observers:{
      'price'(newPrice){
          this.groupPrice()
      }
    },
    /**
     * 组件的初始数据
     */
    data: {
 int:0,
 float:"00"
    },

    /**
     * 组件的方法列表
     */
    methods: {
        groupPrice(){
            const priceArr=this.data.price.toString().split('.')
            this.setData({
                int:priceArr[0],
                float:priceArr[1]||'00'
            })
        }
    }
})
