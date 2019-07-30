//当我们加载了jQuery的代码以后，浏览器的window对象中就存在了一个jQuery($)的方法。
//jQuery使用匿名函数自动执行的方式，在你加载了它的代码后就将window对象绑定上jQuery。
(function(root) {
    var jQuery = function() {

    }
    root.$ = root.jQuery = jQuery;
})(this);

//jQuery实例对象: jQuery是一个构造函数，当使用$()其实就是调用了这个构造函数，这个构造函数我实例化一个对象返回，这也就是jQuery实例对象。
//jQuery对象:jQuery对象其实就是构造函数本身，
//jQuery除了在原型上定义的属性和方法可以被实例继承以外。自身也拥有很多静态属性和方法。只能通过jQuery.xxx来进行访问。

//jQuery如何实现实例化
//上面说到，当我们使用$()就会返回一个jQuery实例对象的方法。而我们并不是使用这用方式写
(function(root) {
    var jQuery = function() {
    }
    function jQGenerator() {
        return new jQuery();
    }
    root.$ = root.jQuery = jQuery;
})(this)

//通过一个生成器函数，调用$()其实就是去调用生成函数实例化并返回一个jQuery对象。
//jQuery 的源代码并没有这么写，它直接将window.jQuery与jQuery构造函数直接挂钩。
//试想一下，如果我们在jQuery构造函数中调用new jQuery()会是什么情况。

(function(root) {
    var jQuery = function() {
        return new jQuery();
    }
    root.$ = root.jQuery = jQuery;
})(this)

//构造函数使用new操作符实例化一个对象，实际上会做两步操作
//1. 去生成一个Object对象{}
//2. 调用本身的构造函数去给对Object对象进行操作。
//如果我们用了上述写法，当我们执行jQuery的方法时，又会去调用自身，又会去执行new jQuery,形成一个死循环。

// 那么jQuery是怎么实现实例化jQuery对象的呢？
// jQuery的实现方法叫做共享原型对象,
// Query对象的原型对象上会有一个init的方法,init方法的原型对象会指向jQuery对象的原型对象。
// 当我们执行jQuery对象的时候 它回去return new jQuery.init()。它会把jQuery原型对象上的init方法当作一个构造方法。
// init方法的原型又是指向jQuery的原型对象，实例对象回也就可以继承jQuery原型对象的属性和方法。

(function(root) {
    var jQuery = function() {
        return new jQuery.prototype.init();
    }
    jQuery.prototype = {
        init:function() {}
    }
    jQuery.prototype.init.prototype = jQuery.prototype;
    root.$ = root.jQuery = jQuery;
})(this)

//骚不骚，不需要一个中间函数，可以返回自身的实例。
var foo = $();
console.log(foo);
console.log(foo instanceof jQuery);

// 1.jQuery是一个构造函数，它的prototype指向jQuery的原型对象上。
// 2.jQuery的原型对象上有一个init的变量，指向init构造函数。
// 3.init构造函数的prototype指向jQuery的原型对象。
// 4.当我们new jQuery.propotype.init()时，由于init的prototype指向jQuery原型对象，所以生成的实例会继承jQuery原型对象上的所有属性和方法。

// 我们在使用$.fn.xxx = xxx 的时候 其实是在jQuery.prototype上进行操作，使用$.xxx = xxx 其实是对jQuery构造函数进行静态属性操作。$(arr).each()和$.each(arr)就是完美的解释。
// $(arr).each是返回一个jQuery实例，然后调用实例的each方法
// $.each(arr)调用的是jQuery构造函数的静态方法each,然后传入arr作为参数。

// $.fn也就是jQuery.prototype。
// 源代码是这么写的

jQuery.fn = jQuery.prototype = {
    init:function() {}
}

jQuery.prototype.init.prototype = jQuery.prototype;
jQuery.fn.init.prototype = jQuery.fn;