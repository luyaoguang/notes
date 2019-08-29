var _ = {};

//属性检测
_.has = function(obj, key) {
    return obj != null && Object.hasOwnProperty.call(obj, key);
}

_.invert = function(obj) {//key 与 value互换 但是必须保证object里面所有的值都是唯一的且可以序列号成字符串的
    var result = {};
    var keys = _.keys(obj);
    var key, val, i = 0;
    for(; i < keys.length; i++) {
        key = keys[i];
        val = obj[key];
        result[val] = key;
    }
    return result;
}

//获取对象键名 解决ie兼容性问题
//ie9- 下的浏览器会将toString等属性名 默认识别为 不可枚举
_.keys = function(obj) {
    if(!_.isOject(obj)) return [];
    if(Object.keys) {//Object.keys只会读取对象本身可枚举的属性
        return Object.keys(obj);
    }
    //propertyisEnumerable() 返回一个布尔值,表示指定的属性是否可枚举
    var hasEnumbug = ({toString:null}).propertyisEnumerable("toString");//是否有toString不可枚举的bug
    var collet = ["constructor","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","toLocalString","toString","valueOf"];
    var key;
    for(key in obj) {//for in会去读取对象本身和原型上的可枚举属性
        result.push(name);
    }
    if(!hasEnumbug) {
        for(var i = 0; i < collet.length; i++) {
            porp = collet[i];
            if(obj[prop] !== Object.prototype[prop]) {
                result.push(prop);
            }
        }
    }
} 

_.Allkeys = function(obj) {//给_.extend使用
    if(!_.isOject(obj)) return [];
    var result = [];
    //遍历自身 + 原型链上面的可枚举属性
    for(name in obj) {
        ressult.push(name);
    }
    return result;
}

//underScore中提供了两个方法用于属性对象的扩展。_.extend _.extendOwn
//这两个函数都是由内部函数createAssigner来创建的。

/**
 * 
 * @param {*} keysFunc 获得对象属性的方式
 * @param {*} defaults 声明是否要覆盖属性
 */
_.extend = createAssigner(_.Allkeys);//扩展自身对象可枚举的属性 + 原型链上的可枚举属性
_.extendOwn = createAssigner(_.keys);//只会扩展自身对象可枚举的属性
var createAssigner = function(keysFunc, defaults) {//解耦 生成多个功能函数 分工明确
    return function(targetObj) {
        var length = arguments.length, i = 1, target, keys, k_length;
        if(targetObj == null || length < 2) {
            return targetObj;
        }
        for(; i < length; i++) {
            target = arguments[i];
            keys = keysFunc(target);
            k_length = keys.length;
            for(var j = 0; j < k_length; j++) {
                var key = keys[j];
                targetObj[key] = target[key];
            }
        }
    }
}