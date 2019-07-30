//抽样函数
function sample (array,n) {
    if(n == null) {
        return array[random(array.length - 1)];
    }
    var _sample = clone(array),
        length = _sample.length;
        n = Math.max(Math.min(n, legnth), 0);
    for(var index = 0; index < n; index++) {
        random(index, length - 1)
    }
}

function random (min,max) {
    if(max == null) {
        max = min;
        min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
}

function clone(object) {
    return isArray(object) ? obj.slice() : extend({},object);
}