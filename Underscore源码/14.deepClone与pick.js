//克隆边界的划分
//100%克隆DOM对象 正则对象等 是十分困难的 所以要进行边界划分
//要么是Object对象 要么是一个Array对象
_.clone = function(obj) {
    if(typeof obj !== "object") {//如果不是数组/对象
        return obj
    }
    return _.isArray(obj) ? obj.slice(0) : _.extend({}, obj);
}

var deepClone = function(obj) {
    if(_.isArray(obj)) {//array对象 
        //map方法会返回新数组
        return _.map(obj, function(item) {//迭代器其实是对回调函数的一层封装
            return _.isArray(item) || _.isObject(item) ? deepClone(item) : item;
        });
    } else if(_.isObject(obj)) {//object对象
        return _.reduce(obj, function(memo, value, key) {//memo代表新对象
            memo[key] =  _.isArray(value) || _.isObject(value) ? deepClone(value) : value;
            return memo;
        },{})
    } else {
        return obj;
    }
}

_.pick({
    name:'a',
    age:30
}, function(value, key, object) {
    return _.isNumber(value);
})
//返回一个object副本,只过滤出keys参数指定的属性值。或者接受一个判断函数,指定挑选哪个key。 
_.pick = function(object, iteratee, context) {
    var result = {},keys;
    if(object == null) {
        return result;
    }
    if(_.isFunction(iteratee)) {
        iteratee = optimizeCb(iteratee, context);
    } else {
        keys = [].slice.call(arguments, 1);
        iteratee = function(value, key, object) {
            return key in object;
        }
    }
    return result;
}