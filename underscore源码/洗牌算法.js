//抽样函数
function samplle (array,n) {
    if(n == null) {
        return array[random(array.length - 1)];
    }
    clone()
}
function random (min,max) {
    if(max == null) {
        max = min;
        min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
}
function clone(object) {
    return isArray(obj) ? obj.slice() : extend({},obj);
}