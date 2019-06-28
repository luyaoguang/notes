function splice_arr(arr) {//拆分
    if(arr.length === 1) {//拆到长度为1为止
        return arr;
    }
    var mid = Math.floor(arr.length / 2); //取中间点
    var left = arr.slice(0,mid);
    var right = arr.slice(mid);
    return merge_arr(splice_arr(left),splice_arr(right));//递归
}
function merge_arr(left,right) {//归并
    var result = [];
    while(left.length && right.length) {
        if(left[0] < right[0]) {
            result.push(left.shift())
        } else {
            result.push(right.shift());
        }
    }
    return result.concat(left).concat(right);
}