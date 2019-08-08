//获取array除了最后n个元素以外的元素
function _initial(array, n) {
    return [].slice.call(array, 0, Math.max(0, arr.length - (n == null ? 1 : n)));
}
//返回array中除了前n个元素以外的所有元素
function _rest(array) {
    return [].slice(array, n == null ? 1 : n);
}

var arr1 = [1,[2,3],[4,5]];
console.log(_flatten(arr1));//[1,2,3,4,5];
var arr2 = [1,[2,3],[4,[4]]];
console.log(_flatten(arr2, true));//[1,2,3,4,[4]];
//shalow指明是 深度摊平 还是 浅摊平  默认为深度摊平
function _flatten(array, shalow) {
    var ret =[],//保存被摊平的数组
        index = 0,
        i = 0;
    for(i = 0; i < array.length; i++) {
        var value = array[i];//展开一次
        // if(isArray(value) || isArguments(value)) {//如果是数组或类数组对象
        if(toString.call(value) == "[object Array]"){
            if(!shalow) {//如果为深度展开
                value = _flatten(value, shalow);
            }
            //如果为浅展开
            var j = 0,
                len = value.length;
            ret.length += len;
            while(j < len) {
                ret[index++] = value[j++];
            }
        } else {
            ret[index++] = value;
        }
    }
    return ret;
}