
var add = function(a, b) {
    return a + b;
}
var partialAdd = partial(add, 5);
partialAdd(10);//15

// 偏函数(partial):反映了新函数是原函数的一部分。
// 应用一个函数 填充在任意个数的参数，不改变其动态this值，和bind方法类相近
var partial = function(func) {
    //提取参数
    var args = [].slice.call(arguments, 1);//此时的arguments指的是调用partial方法传入的参数
    var bound = function() {
        var index = 0,
            length = args.length,
            ret = Array(length),
            i = 0;
        for(; i < length; i++) {
            ret[i] = args[i];
        }
        while(index < arguments.length) {//此时的arguments指的是调用bound方法传入的参数
            ret.push(arguments[index++]);
        }
        return func.apply(this, ret);//apply调用 打散数组
    }
    return bound;
}
// 缓存函数(memoize):可以缓存某函数的计算结果，用于大量密集计算提升性能。
var memoize = function(func, hasher) {
    var _memoize = function(key) {
        var cache = _memoize.cache;
        var address = '' + (hasher ? hasher.apply(this, arguments) : key);
        if(!_.has(cache, address)) {
            cache[address] = func.apply(this, arguments);
        }
        return cache[address];
    }
}