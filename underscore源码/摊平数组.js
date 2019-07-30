//获取array除了最后n个元素以外的元素
function _intial() {

}
//返回array中除了前nge元素以外的所有数组
function _rest() {

}

//shalow指明是 深度摊平 还是 浅摊平  默认为深度摊平
function _flatten(array, shalow) {
    var ret =[];
    var index = 0;
    for(var i = 0; i < array.length; i++) {
        var value = array[i];//展开一次
        // if(isArray(value) || isArguments(value)) {//如果是数组或类数组对象
        if(toString.call(value) === '[object Array]'){
            if(!shalow) {//如果为深度展开
                value = _flatten(value,shalow);
            }
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
console.log(_flatten([1,2,[3,[4,[5,[6]]]]]));