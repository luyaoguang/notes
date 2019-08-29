//延时执行函数
var delay = function(func, wait) {
    var args = [].slice.call(arguments, 2);
    return setTimeout(function() {
        func.apply(null, args);
    }, wait);
}


//字符串逃逸 
//将不安全的字符变成字符串的实体
//对字符串进行筛选 去除不合法输入 用于防止XSS攻击
var escapeMap = {
    '&' : '&amp;',
    '<' : '&lt;',
    '>' : '&gt;',
    '"' : '&quot;',
    "'" : '&#x27',
    '`' : '&#x60'
}
var createEsacpe = function(map) {
    var source = "(?:"+ Object.keys(map).join("|") +")",//只匹配 不捕获
        reg = new RegExp(source, "g"),
        replace = function(match) {//匹配到的字符串
            return map[match];
        }
    return function(string) {
        return string.test(reg) ? string.replace(reg, relace) : string;
    }
}
var escape = createEsacpe(escapeMap);




//函数组合
//1. 依次调用fn1,fn2,fn3
//2. 将上次调用函数的返回值 传递给下一个要执行的函数
var compose = function() {
    var args = [].slice.call(arguments),
        length = args.length;
    return function() {
        var index = 0,
            data = args[index++].apply(null, arguments);
        for(; index < length; index++) {
            data = args[index].call(null, data);
        }
        return data;
    }
}

function fn1(data) {
    return data * 2;
}
function fn2(data) {
    return data + 5;
}
function fn3(data) {
    return data - 2;
}
var foo = compose(fn1,fn2,fn3);
// console.log(foo(2));//7

//React reducer中的应用 使用compose增强store的功能
//redux对于js应用而言是一个应用数据流框架，redux最主要是用作状态的管理。
//redux用一个单独的常量状态树(对象)保存一整个应用的状态，这个对象不能直接被改变。 
//当一些数据变化了，一个新的对象就会被创建(使用actions和reducers)。

function rCompose() {
    var _len = arguments.length,
        funcs = [],
        i = 0;
    for(; i< _len; i ++) {
        funcs[i] = arguments[i];
    }
    if(funcs.length === 0) {
        return function(arg) {
            return arg;
        }
    } else if(funcs.length === 1) {
        return funcs[0]()
    }
    return funcs.reduce(function(a, b) {
        return function() {
            return a(b.apply(undefined, arguments));
        }
    });
}
function f1() {

}
function f2() {

}
console.log(rCompose(f1, f2));

// import {createStore, applyMiddleware,} from data;
// import createSagaMiddleware from 
// let storeEnhancers = rCompose(
//     applyMiddleware(...middlewares, sagaMiddleware),
//     (window && window.devToolsExtension) ? window.devToolsExtension() : (f) => f
// );