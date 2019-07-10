        (function(root) {
            var optionscache = {};//配置缓存
            var createOptions = function(options) {
                var object = optionscache[options] = {};
                options.split(/\s+/).forEach(function(option) {//多参数进行切割
                    object[option] = true;
                })
                return object;
            }
            var jQuery = {
                extends:function() {

                },
                Callbacks:function(options) {//options接受传入参数
                    /**
                     * 先检测传入参数是否为字符串
                     * 如果是字符串 就去optionscache查找是否存在对应参数 不存在就调用createOptions在optionscache中创建对应参数配置
                     * 如果不是字符串 那么将options设置为一个对象
                    */
                    options = typeof options === "string" ? (optionscache[options] || createOptions(options)) : {};
                    var _list = [];//用于保存函数队列
                    var index;//fire时使用，保存执行到第几个回调函数
                    var length;//保存函数队列长度
                    var isFired;//是否调用过fire
                    var memoryData;//保存设置过memory参数 当前执行fire的参数
                    var start;//保存调用add时，队列已有函数的长度
                    var _fire = function(data) {
                        //如果start有值 说明定义了momory 并且已经add过回调函数 当前遍历应该从第start个函数开始
                        index = start || 0;
                        start = 0;//将start重置为0 下次fire需要重0开始
                        length = _list.length;
                        isFired = true;
                        options.memory && (memoryData = data);//只有定义了memory参数 才会把这次调用的data对象赋值给memoryData
                        for(; index < length; index++) {
                            //如果有函数的返回值是false 且定义了stopOnfalse参数就退出for循环 不继续执行下去
                            if(_list[index].apply(data[0], data[1]) ===false && options.stopOnfalse) {
                                break;
                            }
                        }
                    }
                    var self = {
                        add:function() {
                            var args = Array.prototype.slice.call(arguments);
                            if(memoryData) {//这里表示已经最少执行过一次_fire
                                start = _list.length;//获取当前回调队列里的长度并保存到start中
                            }
                                args.forEach(function(fn) {//遍历传入的参数
                                    if(toString.call(fn) === "[object Function]") {//判断参数是否为函数
                                        if(!options.unique || !this.has(fn)) {
                                            _list.push(fn);//向函数队列里保存回调函数
                                        }//只有没定义unique 或者 毁掉队列是空的 才会去push

                                    }
                                })
                            //如果memoryData有值 说明定义了memory参数 并且 _fire 函数已经执行过最少一次
                            memoryData && (_fire(memoryData))  
                            return this;//返回调用者本身  支持链式调用
                        },
                        fire:function() {
                            //如果没有设置once 或者 fire方法没有被执行过 才会去执行fire方法
                            if(!options.once || !isFired) {
                                _fire([this,arguments]);//传入上下文环境和调用fire传入的参数
                            }
                            
                        },
                        has:function(fn) {
                            return _list.indexOf(fn) > -1 ;
                        }
                    }
                    return self;
                },
                Deferred:function(fn) {
                    var tuples = [
                        //状态 往队列添加处理函数的方式 创建回调队列 最终状态信息描述
                        ["resolve", "done", jQuery.Callbacks("once memory"), "resolved"],
                        ["reject", "fail", jQuery.Callbacks("once memory"), "rejected"],
                        ["notify", "progress", jQuery.Callbacks("memory")]
                    ],
                    state = "pending",//默认为进行中 只有调用了resolve或者reject才会改变延时器的状态
                    promise = {//promise对象无法修改延时对象的状态 只能像回调队列里添加回调函数
                        state:function() {//获取当前延时对象的状态
                            return state;
                        },
                        promise:function(obj) {
                            //如果传参了 则将promise对象的属性和方法扩展到目标对象上 否则返回promise对象
                            return obj != null ? jQuery.extend(obj,promise) : promise;
                        },
                        then:function() {
                            var funcs = [].slice.call(arguments);//拿到所有回调函数 [0]成功回调 [1]失败回调 [2]进行中回调
                            return jQuery.Deferred(function(newDeferred) {
                                tuples.forEach(function(tuple, i) {
                                    var fn = jQuery.isFunction(funcs[i]) && funcs[i];
                                    deferred[tuple[1]](function() {
                                        var returnDeferred = fn && fn.apply(this, arguments);
                                        if(returnDeferred && jQuery.isFunction(returnDeferred.promise)) {
                                            returnDeferred.promise()
                                            .done(newDeferred.reosolve)
                                            .fail(newDeferred.reject)
                                            .progress(newDeferred.notify);
                                        }
                                    })
                                })
                            })
                          
                        }
                    },
                    deferred = {};//需要return出去的延时对象
                    tuples.forEach(function(tuple,i) {
                        var list =tuple[2],//取到回调对了
                        stateString = tuple[3];//拿到最终状态信息
                        if(stateString) {//只有成功或者失败
                            list.add(function() {
                                state = stateString;//改变当前延时对象状态为 成功/失败
                            })
                        }
                        // promise[done | fail | progerss]
                        promise[tuple[1]] = list.add;
                        // deferred[ resolve | reject | notify ]
                        deferred[tuple[0]] = function() {
                            deferred[tuple[0] + "With"](this, arguments);
                            return this;
                        }
                        deferred[tuple[0] + "With"] = list.fire;
                    })
                    if(fn) {
                        fn.call(deferred,deferred);
                    }
                    promise.promise(deferred);
                    return deferred;
                }
            }
            jQuery.isPlainObject = function(obj) {
                return toString.call(obj) === "[object Object]"
            };
            jQuery.isArray = function(obj) {
                return toString.call(obj) === "[object Array]"
            }
            jQuery.isFunction = function(fn) {
                return toString.call(fn) == "[object Function]"
            }
            jQuery.extend = function() {
                var target = arguments[0];//将传入的第一个参数定义为target 也就是被扩展的对象
                var length = arguments.length;//保存参数长度
                var deep = false;//是否为深拷贝 默认为false
                var i = 1;  //遍历传入参数时使用 我们应该从第二个参数开始遍历 第一个参数对象是用来被扩展的 因此i被定义为1
                var option;//遍历传入参数时 用来保存当前遍历到的参数
                var name;//遍历option对象使用 保存当前option的键名
                var copy;//用于保存当前被遍历参数对象的属性值
                var src;//用于保存被扩展对象的同键名属性值
                var copyIsArray ;//保存是否为数组
                var clone;//用于储存被扩展对象的同键名属性临时储存
                if(typeof target === "boolean") {
                    deep = target;
                    target = arguments[1];//此时 被扩展对象应该是下标为1的参数
                    i = 2;//传入第一个参数为布尔类型，此时从下标为2的参数开始进行遍历
                }
                if(typeof target !== "object") {
                    target = {}; //如果传入的第一个参数不是一个对象 将target置为一个空对象
                }
                if(length == i) {//如果传入的参数为1个 这种情况下 是为jQuery对象或者jQuery实例进行扩展
                    target = this;//此时this指向的是jQuery对象 或者 jQuery.prototype($.fn)
                    i--; //此时只有一个参数 所以i应该为0
                }
                for(; i < length; i++) {//遍历所有传入extend方法的参数
                    option = arguments[i];
                    if(option != null) {  //如果option的对象不为null
                        for(name in option) {//遍历参数的所有属性 不是引用类型不会进入for循环
                            copy = option[name];
                            src = target[name];
                            if(deep && ($.isPlainObject(copy) || (copyIsArray = $.isArray(copy)))) {//如果当前是深拷贝 此时copy必须是Array或者是Object
                                if(copyIsArray) {//如果当前值是数组
                                    copyIsArray = false;//重置copyIsArray 用于下次循环
                                    clone = src && $.isArray(src) ? src : [];//如果被扩展对象存在同键名属性值且为数组 将src存入clone 否则存入clone一个空数组
                                } else {//如果当前值是一个对象
                                    clone = src && $.isPlainObject(src) ? src : {};//如果被扩展对象存在同键名属性值且为对象 将src存入clone 否则存入clone一个空对象
                                }
                                target[name] = $.extend(deep,clone,copy);//灵魂代码
                                //递归调用$.extend 只要clone中还有对象或者数组 就一直递归下去
                                //将deep传入 用于下次调用$.extend判断是否为深拷贝
                                //将clone传入 用于下次调用的被扩展对象
                                //将copy传入 用于下次遍历
                            } else if (copy != undefined) {//浅拷贝
                                target[name] = copy;
                            }
                        }
                    }
                }
                return target;//返回扩展后的target对象
            }
            root.$  = root.jQuery = jQuery;
        })(this)