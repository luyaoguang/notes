function filter(obj,iteratee, context) {
    var results = [];
    iteratee = cb(iteratee,context);
    each(obj, function(value, index, list) {
        if(iteratee(value, index, list)) results.push(value);
    })
    return results;
}
function cb(iteratee,context,count) {
    if(iteratee == null) {
        return identity;
    }
    if(toString.call(iteratee) === '[object Function]') {
        return optimizeCb(iteratee,context,count);
    }
}
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
    }
}