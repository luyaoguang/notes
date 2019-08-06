function test(count,rest) {
    console.log(rest);
}
var restTest = restArguments(test);
restTest(1,2,3,4,5,6);

//期望通过这层封装 获得的函数执行 count为 1 rest为[2,3,4,5,6];
function restArguments(func) {
    var startIndex = func.length - 1;//获取函数形参的长度 用形参长度-1 拿到最后一个形参的index 
    return function() {
        var length = arguments.length - startIndex,//获取前面所有实参的长度length
            rest = Array(length),
            index = 0;
        for(; index < length; index++) {//从最后一个形参的index开始向后遍历 多出来的参数都放入rest数组
            rest[index] = arguments[index + startIndex];
        }
        var args = Array(startIndex + 1);//生成包含所有形参长度的数组
        for (index = 0; index < startIndex; index++) {
            args[index] = arguments[index];
        }
        args[startIndex] = rest;//args此时为[1,[2,3,4,5,6]]
        return func.apply(this,args);//apply调用
    }
}
