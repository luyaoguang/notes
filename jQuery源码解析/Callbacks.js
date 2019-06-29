/**
         * $.Callbacks用于管理函数队列
         * 通过add方法添加处理函数到队列中，并通过fire去执行处理函数队列中的函数
         * tip:$.Callbacks是在jQuey内部使用的，如为$.ajax,$.Deferred等组件提供基础功能的函数，它也可以用在类似功能的一些组件中，如自己开发插件
         * 
         * API:
         * 1.$.Callbacks()获取一个Callbacks的实例 
         * Callbacks接受4中特定类型参数:
         *  (1)once:函数队列只执行一次
         *  (2)unique:往内部队列添加的函数保持唯一，不能重复添加，即函数队列里只能有一个函数
         *  (3)stopOnFalse:函数队列中的函数返回false就停止向下执行
         *  (4)memory:调用fire()后，内部会记录当前fire的参数。再使用add方法添加函数，会把记录的参数传递给新添加的函数并立即执行这个新添加的函数。
         * 参数使用字符串表示 可以同时传入多个参数去实例化Callbacks
         * var cb = $.Callbakcs();
         * 2.通过add方法添加函数
         * cb.add(function() {console.log(111)});
         * 3.通过fire方法依次执行队列里的函数
         * cb.fire();
         * 
         * 了解事件函数
         * 事件通常与函数配合使用，这样就可以通过发生的事件来驱动函数的执行。
         * 原则上一个事件只对应一个事件函数
         * 在一个事件对应多个事件函数的情况下，后者会覆盖前者。
         * 
         * 事件一对多的方式实现:
         * 
         * 
         * */        

        (function(root) {
            var optionscache = {};//配置缓存
            var jQuery = {
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
                        options.memory && (memoryData = data);
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
                            options.unique && (args.length = 1);//定义了unique 且一次传入多个函数 只保留一个
                            if(!options.unique || !_list.length) {//只有没定义unique 或者 毁掉队列是空的 才会去push
                                args.forEach(function(fn) {//遍历传入的参数
                                    if(toString.call(fn) === "[object Function]") {//判断参数是否为函数
                                        _list.push(fn);//向函数队列里保存回调函数
                                    }
                                })
                            }
                            //如果memoryData有值 说明定义了memory参数 并且 _fire 函数已经执行过最少一次
                            memoryData && (_fire(memoryData))  
                            
                        },
                        fire:function() {
                            //如果没有设置once 或者 fire方法没有被执行过 才会去执行fire方法
                            if(!options.once || !isFired) {
                                _fire([this,arguments]);//传入上下文环境和调用fire传入的参数
                            }
                            
                        }
                    }
                    return self;
                }
            }
            var createOptions = function(options) {
                var object = optionscache[options] = {};
                options.split(/\s+/).forEach(function(option) {//多参数进行切割
                    object[option] = true;
                })
                return object;
            }
            root.$  = root.jQuery = jQuery;
        })(this)