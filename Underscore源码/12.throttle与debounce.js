// var throttle = _.throttle(function() {
//     console.log("hello throttlw")
// },1500);
// window.onscroll = function() {
//     console.log("hello throttlw")
// }
var _ = {};
_.now = Date.now;
//默认触发一次事件func会执行两侧(立即执行，延时执行)
//leading 设置为false 则只会延时执行
//trailing 设置为false 则只会立即执行 wait毫秒内 只执行一次
_.throttle = function(func, wait, options) {
    //初始值
    var lastTime = 0,
        timeOut = null,//定时器
        args,
        result,
        later = function() {
            lastTime = options.leading === false ? 0 : _.now();
            timeOut = null;
            func.apply(null, args);
        };
    if(!options) {
        options = {};
    }
    return function() {//节流函数
        //首次执行节流函数的时间
        var now = _.now();
        args = arguments;
        if(!lastTime && options.leading === false) {//如果是首次执行 并且配置了leading为false 需要延时执行
            //配置了leading为false 则首次执行时 remaining === wait
            lastTime = now;
        }
        var remaining = wait - (now - lastTime);
        if(remaining <= 0) {
            if(timeOut) {
                clearTimeout(timeOut);
                timeOut = null;
            }
            lastTime = now;
            result = func.apply(null, args);
        } else if(!timeOut && options.trailing !== false) {//如果trailing不为false  也就是不为立即执行
            timeOut = setTimeout(later, remaining);
        } 
        return result;

    }
}
/**
 * 1. lastTime = now;
 * 2. lastTime === newNow;
 */

//  var debounce = _.debounce(function() {
//  }, 1500,false);
//  window.onscroll = debounce;


 _.debounce = function(func, wait, immediate) {
    var lastTime,timeOut,args,result,
        later = function() {
          var last = _.now() - lastTime;//与上一次
          if(last < wait) {
            timeOut = setTimeout(later, wait - last);
          } else {
            clearTimeout(timeOut);
            timeOut = null;
            if(!immediate) {
                func.apply(null, args);
            }
          }
        }
    return function() {//防抖函数
        lastTime = _.now();//记录执行时间 每次调用都会更新
        args = arguments;
        //立即调用需要满足 1.immediate为true 2.timeOut为null
        var callNow = immediate && !timeOut;
        if(!timeOut) {//无论是否设置了immediadate都会执行 只要timeout没有值
            timeOut = setTimeout(later, wait);
        }
        if(callNow) {
            result =  func.apply(null, args);
        } 
        return result;
    }
 }