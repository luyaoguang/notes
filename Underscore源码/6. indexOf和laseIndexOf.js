
/** 
 * @param dir :查询方向;
 * @param pridicateFind:真值检测函数,该函数只有在查询元素不是数字(NaN)时才会使用。;
 * @param sortedIndex:有序数组的索引获得函数。如果设置了该参数，将假定数组已经有序，从而更新高效的通过针对有序数字的查询函数(比如二分查找)来优化查询性能;
*/

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

function sortedIndex(array, obj, iteratee, context) {
    iteratee = cb(iteratee, context, 1);//生成迭代器
    var value = iteratee(obj);
    //二分查找
    var low = 0,
        high = array.length;
    while(low < high) {
        var mid = Math.floor((low + high) / 2);
        if(iteratee(array(mid) < value)) {
            low = mid + 1;
        } else {
            high = mid;
        }
    }
    return low;
}

function createPredicateIndexFindet(dir) {
    return function(array, predicate, context) {
        predicate = cb(predicate, context);
        var length = array.length;
        var index = dir > 0 ? 0 : length - 1;//确定遍历起始位置
        for(; index >= 0 && index < length; index += dir) {
            if(predicate(array[index], index, array)) return index;
            return -1;
        }
    }
}

function isNaN(obj) {
    return typeof obj === 'number' && obj !== obj;
}
function isBoolean(obj) {
    return toString.call(obj) === '[object Boolean]';
}
function createIndexFinder(dir, pridicateFind, sortedIndex) {
    return function(array, item, idx) {
        var i = 0,
            length = array.length;
        //第三个参数为true，用二分查找优化，否则遍历查找
        if(sortedIndex && isBoolean(idx) && length) {
            idx = sortedIndex(array, item);
            return array[idx] === item ? idx : -1;
        }
        //特殊情况 如果查找元素是 NaN类型 NaN !== NaN
        if(item !== item) {
            idx = pridicateFind(slice.call(array, i, length), isNaN);
            return idx >= 0 ? idex + i : -1;
        }
        //非上述情况 正常遍历
        for(idx = dir > 0 ? i : length -1; idx >= 0 && idx < length; idx += dir) {
            if(array[idx] === item) return idx;
        }
        return -1;
    }
}

var identity = function(value) {
    return value;
}

var findIndex= createPredicateIndexFindet(1);
var findLastIndex= createPredicateIndexFindet(-1);

//查询item在array中第一次出现的位置
var _indexOf = createIndexFinder(1, findIndex, sortedIndex);

//倒序 查询最后一次出现的位置
var _lastIndexOf = createIndexFinder(-1, findLastIndex);

console.log(_indexOf([1,2,3,4,5,6],4));