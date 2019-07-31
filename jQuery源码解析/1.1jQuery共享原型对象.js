(function(root) {
    var jQuery = function() {
        return new jQuery.prototype.init();
        /**
            当使用者调用$()方法时 此处我们希望返回一个jQuery的实例
            如果我们希望通过return new jQuery() 
            如果使用new的方式去创建jQuery对象实际是做了两步操作:
            1.生成实例空对象{}
            2.执行jQuery内部代码
            这就会又执行return new jQuery()操作 进入死循环
        **/
    }
    jQuery.fn = jQuery.prototype = {
        init:function() {

        },
        css:function() {

        }
    }
    jQuery.prototype.init.prototype = jQuery.prototype;
    /**
        1. jQuery.prototype是一个对象 
        2. 该对象的init属性指向一个函数
        3. 将init函数当作一个构造函数
        4. 将init函数的prototype属性指向jQuery对象的prototype属性
        5. jQuery方法return new jQuery.prototype.init();
        6. 是返回一个init实例 但是由于init实例的__proto__指向jQuery的原型
        7. 所以 定义在jQuery原型对象上的属性和方法 都可以被init实例进行调用
    **/
    root.$  = root.jQuery = jQuery;
})(this)
console.log($());