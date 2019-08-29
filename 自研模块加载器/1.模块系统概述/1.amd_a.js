//["b"] 提前声明a依赖于b
//callback b代表b模块对外暴露的接口对象
define(["b"], function(b) {
    console.log(b);//{name:"a.js"}
    var Hello = function() {
        console.log("hello world");
    }
    return {//返回a对外暴露的接口对象
        Hello:Hello
    }
})