define(function(require, exports, module) {
    var b = require("b");
    console.log(b);//{name:'b.js'}
    exports.Hello = function() {//对外暴露的熟属性/方法都挂载在exports对象上。其他模块require拿到的就是exports对象
        console.log("Hello world");
    };
})