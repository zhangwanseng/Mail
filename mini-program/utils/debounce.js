function debounce(fn,timer){
    var timer;
    return function () {
      clearTimeout(timer);
      var context = this;
      let args = arguments[0];//保存此处的arguments，因为setTimeout是全局的，arguments不是防抖函数需要的。
      timer = setTimeout(function () {
        fn.call(context, args);
      }, timer);
    }; 
}
module.exports={
    debounce
}