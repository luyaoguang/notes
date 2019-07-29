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