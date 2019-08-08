//抽样函数
function sample (array, n) {//数组 要几个样本
    if(n == null) {//如果没有传入n 就随机返回数组中的一个成员
        return array[random(array.length - 1)];
    }
    var sample = clone(array),//创建一个数组的副本
        length = sample.length,
        last = length - 1,
        index = 0;
        n = Math.max(Math.min(n, length), 0);//防止 n > length || n < 0
    for(; index < n; index++) {//循环n次
        var rand = random(index, last),
            temp = sample[index];
            sample[index] = sample[rand];//交换
            sample[rand] = temp;//交换
    }
    return sample.slice(0, n);//返回一个副本
}
//随机返回一个[min, max]范围内的任意数值
function random (min, max) {
    if(max == null) {//支持一个参数
        max = min;
        min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
} 
//返回乱序之后的数组副本
shuffle = function(array) {
    return sample(array, Infinity);
}

function clone(object) {
    return isArray(object) ? object.slice() : extend({},object);
}
function isArray(obj) {
    return toString.call(obj) == "[object Array]";
}

console.log(sample([1,2,3,4,6,7,8,9,10],5));