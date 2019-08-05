// 纯函数
// 定义：对于相同的输入，永远会得到相同的输出，而且没有任何可观察的副作用，也不依赖外部环境的状态。
var arr = [1,2,3,4,5];
//纯函数 只要输入相同 都是一样的输出
arr.slice(0,3); // => [1,2,3]
arr.slice(0,3); // => [1,2,3]
//非纯函数
arr.splice(0,3);// => [1,2,3]
arr.splice(0,3);// => [4,5]

//函数式编程为什么排斥非纯函数
// 如下例，非纯函数中，函数的行为需要由外部的系统环境去决定。
//也就是说此函数行为不仅取决于输入的参数age，还取决于一个外部的变量timeOfLife。
// 这种对于外部状态的依赖，是造成系统复杂性大大提高的主要原因。
var timeOfLife = 20;
//纯函数
function test(age) {
    return age > 20;
}
//非纯函数
function test(age) {
    return age > timeOfLife;//如果timeOfLife改变 会造成相同输入 给出不同结果
}

//函数柯里化
// 向函数传递一部分参数去调用它，让它返回一个函数去处理剩下的参数。
// 事实上柯里化是一种“预加载”函数的方法，通过传递较少的参数，得到一个已经记住了这些参数的新函数。
// 某种意义上讲，这是一种对参数的“缓存”，是一种非常高效的编写函数的方法。
var timeOfLife = 20;
function test(timeOfLife) {
    return function(age) {
        return age >= timeOfLife;
    }
}
var testing1 = test(timeOfLife); 
timeOfLife = 30;
var testing2 = test(timeOfLife);
testing1(20);//false
testing2(20);//true


//函数组合
// 为避免写出不优雅的包菜式代码h(g(f(x)))，我需要利用到函数组合。
// 我们定义的compose就像双面胶一样，可以把任何两个纯函数结合在一起，也可以扩展出组合N个函数的N面胶。
// 这种灵活的组合，让我们可以像拼积木一样优雅的组合函数式代码。

//两个函数的组合
var compose = function(f,g) {
    return function(x) {
        return f(g(x));
    }
}
var mult = function(x) {
    return x * 5;
}
var add = function() {
    return x + 1;
}
compose(mult,add)(2);// => 15

// 声名式与命令式
// 命令式代码：通过编写一条又一条指令，让计算机执行一些动作，其中一般会涉及许多繁杂的细节。
// 声名式代码：通过写表达式的方式，声明我们想干什么，而不是通过一步一步的指示。
// 声名式代码，是函数式编程的一个明显好处---编写、优化代码时能更专注。

//命令式
var rest = [];
var arr = [4,9,16,25,4,16];
for(var i = 0; i < arr.length; i++) {
    if(test.indexOf(arr[i] === -1)) {
        rest.push(arr[i]);
    }
}

//声名式
var rest = arr.map(Math.sqrt);

// 总结：
// 1.函数对于外部状态的依赖，是造成系统复杂性大大提高的主要原因。
// 2.代码书写中让函数尽可能的纯净。
// 3.函数式编程不是万能的，它与OOP一样，是一种编程范式。
// 4.为降低软件复杂度，OOP的方式是靠良好的封装、继承、多态以及接口定义。函数式编程则依靠纯函数以及它们的组合、柯里化等技术。