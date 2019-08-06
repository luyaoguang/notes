
//reduce函数
function createReduce (dir) {
    var reduce = function(obj,iteratee,memo,init) {
        var keys = !isArray(obj) && Object.keys(obj),
            length = (keys || obj).length,
            index = dir > 0 ? 0 : length - 1;
        if(!init) {
            memo = obj[keys ? keys[index] :index];
            index += dir;
        }
        for(; index >= 0 && index < length; index += dir) {
            var currentKey = keys ? keys[index] : index;
            memo = iteratee(memo, obj[currentKey], currentKey, obj);
        }
        return memo; 
    }
    return function(obj,iteratee,memo,context) {
        var init = arguments.length >= 3;
        return reduce(obj,optimizeCb(iteratee,context,4),memo,init);
    }
}

var _reduce = createReduce(1);

_reduce([1,2,3,4,5,6],function(memo,value,index,obj) {
    return memo + value;
},0);

function optimizeCb(func,context,count) {
    if(context == void 0) {
        return func
    }
    switch(count == null ? 3: count) {
        case 1 :
            return function(value) {
                return func.call(context,value);
            }
        case 3 :
            return function(value,index,obj) {
                return func.call(context,value,index,obj);
            }
        case 4 :
            return function(memo, value, index, obj) {
                return func.call(context, memo, value, index, obj);
            }
    }
}

//真值检测函数
_.filter = function(obj, predicate, context) {//被遍历对象 迭代器 上下文对象
    var results = [];
    predicate = cb(predicate, context);//生成迭代器
    _.each(obj, function(value, index, list) {
        if(predicate(value, index, list)) results.push(value);
    })
    return results;
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
_.identity = function(value) {
    return value;
}