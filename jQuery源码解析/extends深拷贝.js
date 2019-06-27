/**
            extend方法简介：
            1. $.extend({},{a:123}) 如果传入1个以上的参数 就会将两个对象进行合并 然后返回合并后的对象;
            2. $.extend({say:function() {}}) 如果传入1个参数 就是对jQuery对象进行扩展 $.say();
            3. $.fn.extend({say:function() {}}) 使用$.fn对jQuery实例进行扩展 $().say();
            $.fn.extend 与 $.exntend区别：
            $.fn.extend 指向jQuery的prototype上的extend方法 因此$.fn.extend方法是会被实例继承的
            $.extend指向jQuery对象的方法 这种方法是被定义在jQuery构造函数上的 就是class的static静态属性

            $.extend(true,{name:'lu',options:{sex:'man'}},{options:{age:27}})
            extend方法还接受一个Boolean类型的参数 用来判断是否为深拷贝
            深拷贝的情况下 会对引用类型的属性接着进行合并
            {name:'lu',options:{sex:'man',age:27}
        **/
    
       (function(root) {
        var jQuery = function() {
            return new jQuery.prototype.init();
        }
        jQuery.fn = jQuery.prototype = {
            init:function() {

            },
        }
        jQuery.isPlainObject = function(obj) {
                return toString.call(obj) === "[object Object]"
            };
        jQuery.isArray = function(obj) {
                return toString.call(obj) === "[object Array]"
        }
        jQuery.fn.extend = jQuery.extend = function() {
            var target = arguments[0];//将传入的第一个参数定义为target 也就是被扩展的对象
            var length = arguments.length;//保存参数长度
            var deep = false;//是否为深拷贝 默认为false
            var i = 1;  //遍历传入参数时使用 我们应该从第二个参数开始遍历 第一个参数对象是用来被扩展的 因此i被定义为1
            var option;//遍历传入参数时 用来保存当前遍历到的参数
            var name;//遍历option对象使用 保存当前option的键名
            var copy;//用于保存当前被遍历参数对象的属性值
            var src;//用于保存被扩展对象的同键名属性值
            var copyIsArray ;//保存是否为数组
            var clone;//用于储存被扩展对象的同键名属性临时储存
            if(typeof target === "boolean") {
                deep = target;
                target = arguments[1];//此时 被扩展对象应该是下标为1的参数
                i = 2;//传入第一个参数为布尔类型，此时从下标为2的参数开始进行遍历
            }
            if(typeof target !== "object") {
                target = {}; //如果传入的第一个参数不是一个对象 将target置为一个空对象
            }
            if(length == i) {//如果传入的参数为1个 这种情况下 是为jQuery对象或者jQuery实例进行扩展
                target = this;//此时this指向的是jQuery对象 或者 jQuery.prototype($.fn)
                i--; //此时只有一个参数 所以i应该为0
            }
            for(; i < length; i++) {//遍历所有传入extend方法的参数
                option = arguments[i];
                if(option != null) {  //如果option的对象不为null
                    for(name in option) {//遍历参数的所有属性 不是引用类型不会进入for循环
                        copy = option[name];
                        src = target[name];
                        if(deep && ($.isPlainObject(copy) || (copyIsArray = $.isArray(copy)))) {//如果当前是深拷贝 此时copy必须是Array或者是Object
                            if(copyIsArray) {//如果当前值是数组
                                copyIsArray = false;//重置copyIsArray 用于下次循环
                                clone = src && $.isArray(src) ? src : [];//如果被扩展对象存在同键名属性值且为数组 将src存入clone 否则存入clone一个空数组
                            } else {//如果当前值是一个对象
                                clone = src && $.isPlainObject(src) ? src : {};//如果被扩展对象存在同键名属性值且为对象 将src存入clone 否则存入clone一个空对象
                            }
                            target[name] = $.extend(deep,clone,copy);//灵魂代码
                            //递归调用$.extend 只要clone中还有对象或者数组 就一直递归下去
                            //将deep传入 用于下次调用$.extend判断是否为深拷贝
                            //将clone传入 用于下次调用的被扩展对象
                            //将copy传入 用于下次遍历
                        } else if (copy != undefined) {//浅拷贝
                            target[name] = copy;
                        }
                   }
               }
            }
            return target;//返回扩展后的target对象
        }
        //共享原型对象
        jQuery.prototype.init.prototype = jQuery.prototype;
        // jQuery.extend({
        //     //类型检测
        //     isPlainObject: function(obj) {
        //         return toString.call(obj) === "[object Object]"
        //     },
        //     isArray:function(obj) {
        //         return toString.call(obj) === "[object Array]"
        //     }
        // })
        root.$ = root.jQuery = jQuery;
    })(this);