/**
 * DOM对象和jQuery对象的区别
 * DOM对象是由宿主环境提供的对象，在文档对象模型中，每个部分都是节点。
 * jQuery对象是由jQuery构造函数创建出来的 通过jQuery选择器可以将HTML元素获取并以一种类数组的形式储存在jQuery对象中
 * 
 * 1. $("<a>")创建一个A的DOM对象 并转化为jQuery对象
 * 2. $(".class")查找一个DOM对象 并转换为jQuery对象
 * 3. $(function(){})这个表示该函数 在页面DOM文档加载完成后再执行
 * 4. $(this) $(document)把传入的对象包装成jQuery对象
 * 5. $()创建jQuery对象。
 */
(function(root) {
    var jQuery = function(selector, context) {
        return new jQuery.prototype.init(selector, context)
    }
    jQuery.fn = jQuery.prototype = {
        length:0,//用于保存
        selector:"",//用于保存选择器
        init:function(selector, context) {
            context = context || document;//默认上下文环境为document;
            var match;//用于保存创建的DOM元素
            var elem;//用去保存查询到的DOM元素
            var index = 0;//用于遍历
            if(!selector) {
                return this;//$() $(null) $(undefined) $(false)调用 直接返回jQuery对象
            }
            if(typeof selector === "string") {//如果传入的是字符串 此时有两种可能 创建一个元素 或者查找一个元素
                if(selector.charAt(0) === "<" && selector.charAt(selector.length - 1) === ">" && selector.length >= 3) {//如果是创建一个元素
                    match = [selector]; 
                }
                if(match) {//创建DOM节点
                    $.merge(this, $.parseHTML(selector, context))
                } else {//查找DOM节点
                    elem = document.querySelectorAll(selector);//查询符合选择器的所有DOM元素
                    var elems = Array.prototype.slice.call(elem);//因为querySelectorAll拿到的是一个类数组对象 调用slice方法转为数组
                    this.length = elems.length;//将实例的length属性设置为查询到的DOM元素长度
                    for(; index < elems.length; index++) {
                        this[index] = elems[index];
                    }
                    this.context = context;
                    this.selector = selector;
                }
            } else if (selector.nodeType) {//这里指的是传入DOM对象转为jQuery对象
                this.context = this[0] = selector;
                this.length = 1;
                return this
            } else if ($.isFunction(selector)) {//如果是函数的话
                return new jQuery(document)[jQuery.fn.ready ? "ready" : "load"](selector);
                //返回一个由document对象创建的jQuery实例对象
                //如果jQuery实例对象的原型汇中有ready就调用ready方法否在就调用load方法并传入函数。
            }
        },
        ready:function(fn) {//定义实例的ready方法
            bindReady();//如果DOM对象已经加载完毕
            if($.isReady) {
                fn.call(document,$);
            } else {
                $.readyList.push(function() {
                    return fn.call(this,$);
                })
                return this;
            }
        }
    }
    jQuery.parseHTML = function(data, context) {//用于创建DOM元素
        var rejectExp = /^<(\w+)\s*\/?>(?:<\/\1>|)$/;  
        if(!data || typeof data !== "string") {
            return null
        }
        var parse = rejectExp.exec(data);//过滤掉< >
        // var parse = data.match(rejectExp)
        return context.createElement(parse[1]);
    }
    jQuery.merge = function(first, second) {//合并数组
        var l = second.length,//保存被合并的数组长度
            i = first.length,//保存合并原数组的长度
            j = 0;
        if(typeof l === "number") {//如果被合并的数组的length属性是数字
            for(; j < l; j++) {//遍历被合并数组
               first[i++] = second[j]; //将合并原数组扩展;
            }
        } else {//如果被合并的数组的length属性不是数字(注意：此时的second一定是个对象，因为[].length一定是数字)
            while(second[j] !== undefined) {//如果改对象存在{j:xxxx}的情况
                first[i++] = second[j++];
            }
        }
        first.length = i;//重置合并原数组的长度(因为该数组已经被扩展了)
        return first;
    }
    jQuery.prototype.init.prototype = jQuery.prototype;
    root.$ = root.jQuery = jQuery;
})(this);