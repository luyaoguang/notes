
(function(root) {
	var testExp = /^\s*(<[\w\W]+>)[^>]*$/;
	var rejectExp = /^<(\w+)\s*\/?>(?:<\/\1>|)$/;
	var core_version = "1.0.1";
	var optionsCache = {};
	var jQuery = function(selector, context) {
		return new jQuery.prototype.init(selector, context);
	}

	jQuery.fn = jQuery.prototype = { //原型对象
		length: 0,
		jquery: core_version,
		selector: "",
		init: function(selector, context) {
			context = context || document;
			var match, elem, index = 0;
			//$()  $(undefined)  $(null) $(false)  
			if (!selector) {
				return this;
			}

			if (typeof selector === "string") {
				if (selector.charAt(0) === "<" && selector.charAt(selector.length - 1) === ">" && selector.length >= 3) {
					match = [selector]
				}
				//创建DOM
				if (match) {
					//this  
					jQuery.merge(this, jQuery.parseHTML(selector, context));
					//查询DOM节点
				} else {
					elem = document.querySelectorAll(selector);
					var elems = Array.prototype.slice.call(elem);
					this.length = elems.length;
					for (; index < elems.length; index++) {
						this[index] = elems[index];
					}
					this.context = context;
					this.selector = selector;
				}
			} else if (selector.nodeType) {
				this.context = this[0] = selector;
				this.length = 1;
				return this;
			}

		},
		css: function() {
			console.log("di~~didi~~")
		},
		//....
	}

	jQuery.fn.init.prototype = jQuery.fn;


	jQuery.extend = jQuery.prototype.extend = function() {
		var target = arguments[0] || {};
		var length = arguments.length;
		var i = 1;
		var deep = false; //默认为浅拷贝 
		var option;
		var name;
		var copy;
		var src;
		var copyIsArray;
		var clone;

		if (typeof target === "boolean") {
			deep = target;
			target = arguments[1];
			i = 2;
		}

		if (typeof target !== "object") {
			target = {};
		}

		if (length == i) {
			target = this;
			i--; //0   
		}

		for (; i < length; i++) {
			if ((option = arguments[i]) !== null) {
				for (name in option) {
					src = target[name];
					copy = option[name];
					if (deep && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)))) {
						if (copyIsArray) {
							copyIsArray = false;
							clone = src && jQuery.isArray(src) ? src : [];
						} else {
							clone = src && jQuery.isPlainObject(src) ? src : {};
						}
						target[name] = jQuery.extend(deep, clone, copy);
					} else if (copy !== undefined) {
						target[name] = copy;
					}
				}
			}
		}
		return target;
	}


	jQuery.extend({
		expando: "jQuery" + (core_version + Math.random()).replace(/\D/g, ""),
		guid: 1, //计数器
		//类型检测     
		isPlainObject: function(obj) {
			return typeof obj === "object";
		},

		isArray: function(obj) {
			return toString.call(obj) === "[object Array]";
		},

		isFunction: function(fn) {
			return toString.call(fn) === "[object Function]";
		},
		//类数组转化成正真的数组  
		markArray: function(arr, results) {
			var ret = results || [];
			if (arr != null) {
				jQuery.merge(ret, typeof arr === "string" ? [arr] : arr);
			}
			return ret;
		},

		//合并数组
		merge: function(first, second) {
			var l = second.length,
				i = first.length,
				j = 0;

			if (typeof l === "number") {
				for (; j < l; j++) {
					first[i++] = second[j];
				}
			} else {
				while (second[j] !== undefined) {
					first[i++] = second[j++];
				}
			}

			first.length = i;

			return first;
		},

		parseHTML: function(data, context) {
			if (!data || typeof data !== "string") {
				return null;
			}
			//过滤掉<a>   <a>   => a 
			var parse = rejectExp.exec(data);
			console.log(parse)
			return [context.createElement(parse[1])];
		},

		/*
		 object   目标源
		 callback  回调函数
		 args     自定义回调函数参数
		 */
		each: function(object, callback, args) {
			//object  数组对象 || object对象 
			var length = object.length;
			var name, i = 0;

			// 自定义callback 参数
			if (args) {
				if (length === undefined) {
					for (name in object) {
						callback.apply(object, args);
					}
				} else {
					for (; i < length;) {
						callback.apply(object[i++], args);
					}
				}
			} else {
				if (length === undefined) {//兼容非类数组对象
					for (name in object) {//如果是非类数组对象 就使用for in 循环 拿到对象的所有属性 执行并执行回调
						callback.call(object, name, object[name]);
					}
				} else {
					for (; i < length;) {//这里是取出所有的DOM对象 并执行回调函数
						console.log(callback);
						callback.call(object[i], i, object[i++]);
					}
				}
			}
		},

	});

	function Data() {
		//jQuery.expando是jQuery的静态属性,对于jQuery的每次加载运行期间时唯一的随机数
		this.expando = jQuery.expando + Math.random();
		this.cache = {};
	}

	Data.uid = 1;//为每个DOM对象对象设置唯一的key 每在缓存中创建一个对象 uid++

	Data.prototype = {
		key: function(elem) {//这里接收DOM对象
			var descriptor = {},
				unlock = elem[this.expando];//查看DOM对象有没有被赋值this.expando

			if (!unlock) {//如果没有赋值，说明该DOM对象还没有被绑定事件处理程序
				unlock = Data.uid++;//将程序个数的标识++
				descriptor[this.expando] = {   //钥匙
					value: unlock
				};
				// {
				// 	jQuery101089554822917892030: {
				// 		value:1
				// 	}	
				// }
				//方法直接在一个对象上定义一个或多个新的属性或修改现有属性,并返回该对象。
				//DOM   =>  jQuery101089554822917892030.7449198463843298 = 1;
				Object.defineProperties(elem, descriptor);
			}
			//确保缓存对象记录信息
			if (!this.cache[unlock]) {
				this.cache[unlock] = {};   //  数据
			}

			return unlock;
		},

		get: function(elem, key) {
			//找到或者创建缓存
			var cache = this.cache[this.key(elem)];
			//key 有值直接在缓存中取读
			return key === undefined ? cache : cache[key];
		},
	}

	var data_priv = new Data();




	//jQuery 事件模块
	jQuery.event = {
		//1:利用 data_priv 数据缓存,分离事件与数据 2:元素与缓存中建立 guid 的映射关系用于查找 
		add: function(elem, type, handler) {//接收DOM元素，事件类型，回调函数。
			//事件缓存 数据对象
			var elemData = data_priv.get(elem);//保存缓存中拿到的对象

			var eventHandle;//保存回调处理程序
			var events;//保存事件对象
			var handlers;//用于保存多个回调函数

			//同一个元素,不同事件,不重复绑定    {events:{}}
			if (!(events = elemData.events)) {
				events = elemData.events = {};
			}

			if (!(eventHandle = elemData.handle)) {
				//Event 对象代表事件的状态 通过apply传递
				eventHandle = elemData.handle = function(e) {
					// return jQuery.event.dispatch.apply(eventHandle.elem, arguments);
					//arguments === e;
					return jQuery.event.dispatch.apply(this, arguments);
				}
			}

			//通过events存储同一个元素上的多个事件   {events:{click:[]}}   
			if (!(handlers = events[type])) {
				handlers = events[type] = [];
				// handlers.delegateCount = 0;  //有多少事件代理默认0
			} 

			//检测handler是否存在ID(guid)如果没有那么传给他一个ID
			//添加ID的目的是 用来寻找或者删除相应的事件
			if (!handler.guid) {
				handler.guid = jQuery.guid++;   //guid == 1
			}

			handlers.push({
				type: type,
				handler: handler,
				guid: handler.guid,
			});
			/** 
			 * elemData = {
			 * 	events:[
			 * 		[type]:[
			 * 			{type:type,hadler:handler,guide:hadler.guid},
			 * 			delegateCount:handlers.length
			 * 		]
			 * 	],
			 * 	handle:function() {
			 * 		return jQuery.event.dispatch.apply(eventHandle.elem, arguments);
			 * 	}
			 * }
			 * 
			*/
			handlers.delegateCount = handlers.length;  //有多少事件代理默认0

			eventHandle.elem = elem;//为回调函数邦洞DOM对象，这样执行回调时候就能找到指定的DOM对象，拿到缓存中的对应对象。
			//添加事件
			if (elem.addEventListener) {
				elem.addEventListener(type, eventHandle, false);
			}
		},
		
		//修复事件对象event 从缓存体中的events对象取得对应队列。

		dispatch: function(event) {
			//IE兼容性处理如：event.target or event.srcElement
			// event = jQuery.event.fix(event);

			//提取当前元素在cache中的events属性值。 click
			var handlers = (data_priv.get(this, "events") || {})[event.type] || [];
			event.delegateTarget = this;
			//执行事件处理函数
		   jQuery.event.handlers.call( this, event, handlers );
		},
		
		//执行事件处理函数

		handlers: function( event, handlers ) {
			// handlers[0].handler.call(this, event);
			handlers.forEach(item => {
				item.handler.call(this,event);
			})
		},

		fix: function(event) {
			if (event[jQuery.expando]) {
				return event;
			}
			// Create a writable copy of the event object and normalize some properties
			var i, prop, copy,
				type = event.type,
				originalEvent = event,
				fixHook = this.fixHooks[type];

			if (!fixHook) {
				this.fixHooks[type] = fixHook =
					rmouseEvent.test(type) ? this.mouseHooks :
					rkeyEvent.test(type) ? this.keyHooks : {};
			}
			copy = fixHook.props ? this.props.concat(fixHook.props) : this.props;

			event = new jQuery.Event(originalEvent);

			i = copy.length;
			while (i--) {
				prop = copy[i];
				event[prop] = originalEvent[prop];
			}

			// Support: Cordova 2.5 (WebKit) (#13255)
			// All events should have a target; Cordova deviceready doesn't
			if (!event.target) {
				event.target = document;
			}

			// Support: Safari 6.0+, Chrome < 28
			// Target should not be a text node (#504, #13143)
			if (event.target.nodeType === 3) {
				event.target = event.target.parentNode;
			}

			return fixHook.filter ? fixHook.filter(event, originalEvent) : event;
		},
	}

	jQuery.fn.extend({
		each: function(callback, args) {
			return jQuery.each(this, callback, args);//this指向jQuery实例对象
		},

		on: function(types, fn) {//接收事件类型和回调函数
			var type;
			if (typeof types === "object") {//如果使用对象类型调用就遍历对象属性，再递归调用自身绑定事件
				for (type in types) {
					this.on(type, types[type]);
				}
				return;
			}
			return this.each(function() {//调用each方法
				//this  element对象
				jQuery.event.add(this, types, fn);//为DOM元素注册事件处理程序
			});
		}
	})

	function createOptions(options) {
		var object = optionsCache[options] = {};
		options.split(/\s+/).forEach(function(value) {
			object[value] = true;
		});
		return object;
	}

	root.$ = root.jQuery = jQuery;
})(this);





