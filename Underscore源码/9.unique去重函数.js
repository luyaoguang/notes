unique = function(array, isSorted, iteratee, context) {
    //如果没有传入isSorted参数
    if(!isBoolean(isSorted)) {//如果isSorted不是布尔值
        context = iteratee;
        iteratee = isSorted;
        isSorted = false;
    }
    //如果有迭代器函数 
    if(iteratee != null) {
        iteratee = cb(iteratee, context);//生成迭代器
    }
    var result = [],
        seen,//用来过滤重复值
        i = 0;
    for(; i< array.length; i++) {
        var computed = iteratee ? iteratee(value, i ,array) : array[i];
        //如果是有序数组，则当前元素只需要跟上一个元素比对即可
        //用seen变量保存上一个元素
        if(isSorted) {
            if(!i || seen !== computed) result.push(computed);
            //seen保存当前元素，用于下一次比较
            seen = computed;
        } else if (result.indexOf(computed) === -1) {
            result.push(computed);
        }
    }
    return result;
}