var obj = {name:"max"};
var data = _.map([1,2,3], function(value, index, object) {
    return value * 3;
}, obj);
console.log(data);//[3,6,9]
(function(root) {
    var _ = function() {
        if(obj instanceof _) {
            return obj;
        }
        if(!(this instanceof _)) {
            return new _(obj);
        }
        this._wrapped = obj;
    };
    _.chain = function(obj) {
        var instance = _(obj);
        instance._chain = true;
        return instance;
    }
    _.prototype.value = function() {
        return this._wrapped;
    }
    var result = function(instance, obj) {
        return instance._chain ? _(obj).chain() : obj;       
    }
    _.mixin = function(obj) {
        _.each(_.functions(obj), function(name) {
            var func = obj[name];
            _.prototype[name] = function() {
                var args = [this._wrapped];
                push.apply(args, arguments);
                //instance 去重之后的结果
                return result(this, func.apply(this,args));
            }
        })
    }
    _.functions = function(obj) {
        var result = [],key;
        for(key in obj) {
            result.push(key);
        }
        return result;
    }
    _.each = function(target, callback) {
        var key, i = 0;
        if(_.isArray(target)) {//如果是数组
            var length = target.length;
            for(; i < length; i++) {
                callback.call(target, target[i], i);
            }
        } else {//如果是类数组对象
            for(key in target) {
                callback.call(target, key, target[key]);
            }
        }
    },
    _.map = function(obj, iteratee, context) {
        var iteratee = cb(iteratee, context),//生成不同功能的迭代器
            keys = !_.isArray(obj) && Object.keys(obj),//分辨obj是数组还是object对象
            length = (keys || obj).length,
            result = Array(length),
            index = 0;
        for(; index < length; index++) {//循环执行迭代器
            var currentKey = keys ? keys[index] : index;
            result[index] = iteratee(obj[currentKey], index, obj);//当前选项 下标 对象本身
        }
        return result;
    }
    var cb = function(iteratee, context, count) {//接收 迭代器 上下文对象 参数成员数量
        //如果没有传入迭代器 那么就返回默认迭代器
        if(iteratee == null) {
            return _.identity;
        }
        //如果传入的迭代器是函数 就调用optimizeCb优化迭代器
        if(_.isFunction(iteratee)) {
            return optimizeCb(iteratee, context, count);
        }
    }
    //优化迭代器
    var optimizeCb = function(func, context, count) {
        if(context == void(0)) {//如果没有传入上下文对象 就直接返回传入的迭代器
            return func;
        }
        switch(count == null ? 3 : count) {//默认为3
            case 1:
                return function(value) {
                    return func.call(context, valvue);
                }
            case 3:
                return function(value, index, obj) {
                    return func.call(context, value, index, obj);//当前选项 下标 对象本身
                }
        }
    }
    //默认的迭代器
    _.identity = function(value) {
        return value;
    }
    _.mixin(_);
    root._ = _;
})(this);
