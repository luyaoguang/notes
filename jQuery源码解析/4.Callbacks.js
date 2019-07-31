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
            var optionCache = {};//配置缓存
            var jQuery = {
                Callbacks : function(options) {//options接收传入参数(支持多参数)
                    /**
                     * 先检测传入参数是否为字符串
                     * 如果是字符串 就去optionscache查找是否存在对应参数 不存在就调用createOptions在optionscache中创建对应参数配置
                     * 如果不是字符串 那么将options设置为一个对象
                    */
                    options = typeof options === "string" ? (optionscache[options] || createOptions(options)) : {};
                    var _list = [],//用于保存函数队列
                        index,//fire时使用，保存执行到第几个回调函数
                        start,//调用add方法时，保存回调队列在add前的已有长度
                        isFired,//once参数时使用，判断是否已经执行过fire方法
                        memoryData,//保存上次执行fire方法使用的data
                        length;//保存函数队列长度
                    var _fire = function (data) {
                        index = start || 0,//从第一个回调函数开始执行回调队列
                        start = 0,//start重置为0 用于下一次fire操作
                        length = _list.length,//获取回调队列长度
                        isFired = true;//执行过一次_fire方法 就将isFire置为true 表示至少已经执行过一次_fire方法
                        //如果设置了memory参数 那么就将本次执行fire方法的data保存在momoryData中
                        options.memory && (memoryData = data);
                        for(; index < length; index++) {
                            //如果有函数的返回值为false 且 定义了stopOnfalse参数 则退出for循环 不再执行后续回调队列
                            if(_list[index].apply(data[0], data[1]) === false && options.stopOnfalse) {
                                //data[0]是执行上下文对象
                                //data[1]是执行回调时传入的参数
                                break;
                            }
                        }
                    }
                    var self = {
                        add:function() {
                            var args = Array.prototype.slice.call(arguments);
                            if(memoryData) {//已经至少fire过一次
                                start  = _list.length;//获取当前回调队列长度 保存在start中
                            }
                            args.forEach(function(fn) {
                                if(toString.call(fn) === "[object Function]") {//类型判断
                                    _list.push(fn);//向回调队列中插入回调函数
                                }
                            })
                            //如果memoryData有值 说明两点
                            //1.设置了memory参数 因为只有设置的memory参数 才会对memoryData赋值
                            //2.至少执行过一次fire方法 只有在fire方法内 才会对memoryData进行赋值操作
                            memoryData && (_fire(memoryData));
                        },
                        fireWith:function(context, arguments) {
                            var args = [context, arguments];//传入执行上下文对象和执行回调函数所需参数
                            if(!options.once || !isFired) {//如果没有设置once 或者没有执行过fire方法 才进行后续操作
                                _fire(args);
                            }
                        },
                        fire:function() {
                            self.fireWith(this, arguments);
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

      