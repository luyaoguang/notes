/**
            extend方法简介：
            1. $.extend({},{a:123}) 如果传入1个以上的参数 就会将两个对象进行合并 然后返回合并后的对象;
            2. $.extend({say:function() {}}) 如果传入1个参数 就是对jQuery对象进行扩展 $.say();
            3. $.fn.extend({say:function() {}}) 使用$.fn对jQuery实例进行扩展 $().say();
            $.fn.extend 与 $.exntend区别：
            $.fn.extend 指向jQuery的prototype上的extend方法 因此$.fn.extend方法是会被实例继承的
            $.extend指向jQuery对象的方法 这种方法是被定义在jQuery构造函数上的 就是class的static静态属性
        **/
    
       (function(root) {
        var jQuery = function() {
            return new jQuery.prototype.init();
        }
        jQuery.fn = jQuery.prototype = {
            init:function() {

            },
        }
        jQuery.fn.extend = jQuery.extend = function() {
            var target = arguments[0];//将传入的第一个参数定义为target 也就是被扩展的对象
            var length = arguments.length;
            var i = 1;  //遍历传入参数时使用 我们应该从第二个参数开始遍历 第一个参数对象是用来被扩展的 因此i被定义为1
            var option;//遍历传入参数时 用来保存当前遍历到的参数
            var name;//遍历option对象使用 保存当前option的键名
            if(typeof target !== "object") {
                target = {}; //如果传入的第一个参数不是一个对象 将target置为一个空对象
            }
            if(length == i) {//如果传入的参数为1个 这种情况下 是为jQuery对象或者jQuery实例进行扩展
                target = this;//此时this指向的是jQuery对象 或者 jQuery.prototype($.fn)
                i--;//此时只有一个参数 所以i应该为0
            }
            for(; i < length; i++) {//遍历所有传入extend方法的参数
               if((option = arguments[i]) != null) {  //如果option的对象不为null
                   for(name in option) {//遍历参数的所有属性
                        target[name] = option[name];//对target对象进行扩展
                   }
               }
            }
            return target;//返回扩展后的target对象
        }
        //共享原型对象
        jQuery.prototype.init.prototype = jQuery.prototype;
        root.$ = root.jQuery = jQuery;
    })(this);
