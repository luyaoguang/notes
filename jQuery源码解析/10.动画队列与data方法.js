/*
 * @Author: Administrator
 * @Date:   2018-10-30 20:40:51
 * @Last Modified by:   Administrator
 * @Last Modified time: 2018-11-01 22:10:22
 */
(function(root) {
	var testExp = /^\s*(<[\w\W]+>)[^>]*$/;
	var rejectExp = /^<(\w+)\s*\/?>(?:<\/\1>|)$/;
	var core_version = "1.0.1";
	var optionsCache = {};
	var rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi;
	//关闭这些标签以支持XHTML
	var wrapMap = {
		option: [1, "<select multiple='multiple'>", "</select>"],
		thead: [1, "<table>", "</table>"],
		col: [2, "<table><colgroup>", "</colgroup></table>"],
		tr: [2, "<table><tbody>", "</tbody></table>"],
		td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
		_default: [0, "", ""]
	};

	function returnTrue() {
		return true;
	}

	function returnFalse() {
		return false;
	}

	//activeElement 属性返回文档中当前获得焦点的元素。
	function safeActiveElement() {
		try {
			return document.activeElement;
		} catch (err) {}
	}
	//类数组结构的对象
	function isArraylike(obj) {
		var length = obj.length;
		if (obj.nodeType === 1 && length) {
			return true;
		}

		return toString.call(obj) === "[object Array]" || typeof obj !== "function" &&
			(length === 0 ||
				typeof length === "number" && length > 0 && (length - 1) in obj);
	}
	//getAll(fragment.appendChild(elem), "script");
	function getAll(context, tag) {

		var ret = context.getElementsByTagName ? context.getElementsByTagName(tag || "*") :
			context.querySelectorAll ? context.querySelectorAll(tag || "*") : [];
		// console.log(ret);   //查找script元素
		return tag === undefined || tag && jQuery.nodeName(context, tag) ?
			jQuery.merge([context], ret) :
			ret;
	}

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
					jQuery.merge(this, jQuery.parseHTML(selector, context, true));
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
		now: Date.now, //返回当前时间距离时间零点(1970年1月1日 00:00:00 UTC)的毫秒数
		//类型检测     
		isPlainObject: function(obj) {
			return toString.call(obj) === "[object Object]";
		},

		isArray: function(obj) {
			return toString.call(obj) === "[object Array]";
		},

		isFunction: function(fn) {
			return toString.call(fn) === "[object Function]";
		},
		//类数组转化成正真的数组  
		makeArray: function(arr, results) {
			var ret = results || [];
			//arr 是否为类数组结构
			if (isArraylike(arr)) {
				if (arr != null) {
					jQuery.merge(ret, typeof arr === "string" ? [arr] : arr);
				}
			} else {
				[].push.call(ret, arr);
			}

			return ret;
		},

		//合并数组
		merge: function(first, second) {
			var l = second.length, //function(){}  undefind
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

		//init 传值 true
		parseHTML: function(data, context, keepScripts) {
			if (!data || typeof data !== "string") {
				return null;
			}
			//参数兼容处理
			if (typeof context === "boolean") {
				keepScripts = context;
				context = false;
			}
			context = context || document;
			//过滤掉<a>   <a>   => a   问题：
			var parse = rejectExp.exec(data);
			var scripts = !keepScripts && []; //默认空数组
			if (parse) {
				return [context.createElement(parse[1])];
			}

			parsed = jQuery.buildFragment([data], context, scripts);

			return jQuery.merge([], parsed.childNodes);
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
				if (length === undefined) {
					for (name in object) {
						callback.call(object, name, object[name]);
					}
				} else {
					for (; i < length;) {
						callback.call(object[i], i, object[i++]);
					}
				}
			}
		},


		//boss
		//对象  回调函数   属性   value值    text 返回值是什么？  access =>  fn.call(elmes[0])  回调函数
		access: function(elems, fn, key, value) {
			var length = elems.length;
			var testing = key === null; //text   key "color"  false
			var cache, chainable, name; //是否要来链接式的调用
			//key  
			// if (jQuery.isPlainObject(key) && key !== null) { //
			// 	for (name in key) {
			// 		console.log(name)
			// 		jQuery.access(elems, fn, name, key[name]); //color "red"
			// 	}
			// }

			if (value !== undefined) { //value === undefined    get 
				chainable = true;
				if (testing) { //false
					cache = fn; //回调缓存
					fn = function(key, value) { //重置回调函数  增强代码的可塑性  Vue.$mount
						cache.call(this, value);
					}
				}
				for (var i = 0; i < length; i++) {
					fn.call(elems[i], key, value); //fn  回调函数   key  value
				}
			}
			//  (testing ? fn.call(elems[0]) : fn.call(elems[0],key , value))
			return chainable ? elems : (testing ? fn.call(elems[0]) : fn.call(elems[0], key, value)); // 最终决定返回值是什么？   jQuery的实例对象
		},

		empty: function(elem, value) {
			var nodeType = elem.nodeType; // 1
			//1 元素      9 文档   11 文档碎片
			if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
				elem.textContent = value; //"max"
			}
		},

		text: function(elem) {
			var nodeType = elem.nodeType;
			if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
				return elem.textContent;
			}
		},
		//规范化float css属性
		cssProps: {
			"float": "cssFloat"
		},
		style: function(elem, name, value) {
			//检测是是否驼峰写法,如果不是就得转化  常见的检测方式常见应用常见Vue检测组件名称(案例：重)
			var origName = jQuery.camelCase(name);
			var curcss = jQuery.cssProps[name];
			if (value !== undefined) {
				elem.style[curcss || origName] = value;
			}
		},
		css: function(elem, name, styles) {
			styles = styles || getStyles(elem);
			return styles.getPropertyValue(name);
		},
		camelCase: function(string) {
			return string.replace(/^-ms-/, "ms-").replace(/-([\da-z])/gi, function(context, first) {
				return first.toUpperCase();
			});
		}

	});

	function curCSS(elem, name, styles) {

	}

	function Data() {
		//jQuery.expando是jQuery的静态属性,对于jQuery的每次加载运行期间时唯一的随机数
		this.expando = jQuery.expando + Math.random();
		this.cache = {}; //创建了缓存对象
	}

	Data.uid = 1;

	Data.prototype = {
		key: function(elem) {
			var descriptor = {},
				unlock = elem[this.expando]; // UUID  unlock === undefined

			if (!unlock) {
				unlock = Data.uid++; //unlock === 1
				descriptor[this.expando] = { //随机数 === UUID
					value: unlock
				};
				//方法直接在一个对象上定义一个或多个新的属性或修改现有属性,并返回该对象。
				//DOM   =>  jQuery101089554822917892030.7449198463843298 = 1;
				Object.defineProperties(elem, descriptor); //elem[this.expando] = unlock
			}
			//确保缓存对象记录信息
			if (!this.cache[unlock]) { //this.cache = {}.[1]
				this.cache[unlock] = {}; //  数据
			}

			return unlock; //1
		},

		get: function(elem, key) {
			//找到或者创建缓存  cache  box 映射的对象   name
			var cache = this.cache[this.key(elem)]; //{}  this.key(elem) === ID  1  cache  box
			console.log(this.cache)
			//key 有值直接在缓存中取读
			return key === undefined ? cache : cache[key]; //你想要获取的数据  "name"  cache["name"] = ?
		},
		//key = value
		set: function(owner, key, value) {
			var prop;
			var unlock = this.key(owner); //1
			var cache = this.cache[unlock]; // box 映射的对象 
			if (typeof key === "string") {
				cache[key] = value;
			}
			if (jQuery.isPlainObject(key)) {
				for (prop in key) {
					cache[prop] = key[prop];
				}
			}
		},
		access: function(owner, key, value) {
			/*
			处理  elem =cache 中映射的缓存数据对象 > {"1":{firstqueue?}}
			未指定key的值           返回整个缓存对象
			指定了key 未设置value   返回存储在cache中对应的key的数据
			*/
			//key  firstqueue    value === function(){}   [fn, fn]
			this.set(owner, key, value);
			return value !== undefined ? value : key;
		}
	}
	//缓存用户的数据  {"1":{}}
	var data_user = new Data();
	//缓存对象  内部私有 {"1":{}}
	var data_priv = new Data();

	jQuery.fn.extend({
		//缓存数据
		data: function(key, value) {
			var _this = this;
			return jQuery.access(this, function(value) {
				//get
				if (value === undefined) {
					var data = data_user.get(this, key);
					if (data !== undefined) {
						return data;
					}
				}

				//set
				_this.each(function() {
					data_user.set(this, key, value);
				})

			}, null, value);
		}
	});

	jQuery.extend({
		queue: function(elem, type, data) {
			var queue;

			if (elem) {
				type = (type || "fx") + "queue";
				queue = data_priv.get(elem, type);//{"1":{数据不同  firstqueue:[],name:"max"}}

				// Speed up dequeue by getting out quickly if this is just a lookup
				if (data) {
					if (!queue || jQuery.isArray(data)) {
						queue = data_priv.access(elem, type, jQuery.makeArray(data));
					} else {
						queue.push(data);
					}
				}
				return queue || [];
			}
		},
		dequeue: function(elem, type) {
			type = type || "fx";
			var queue = jQuery.queue(elem, type), // firstqueue  []
				startLength = queue.length,
				next = function() {
					jQuery.dequeue(elem, type);
				},
				hooks = jQuery._queueHooks(elem, type),
				fn = queue.shift();
			// 进程锁
			if (fn === "inprogress") {
				fn = queue.shift();
				startLength--;
			}

			if (fn) {

				//添加一个inprogress进程锁  防止默认的fx 队列  自动出列。
				if (type === "fx") {
					queue.unshift("inprogress");
				}
				fn.call(elem, next, hooks); //清理工作
			}
			if (!startLength && hooks) {
				//hooks.empty.fire();   清理的工作 +  数据的收集
			}
		},

		//收集器 动画的数据执行
		_queueHooks: function() {
			return "xxxx"
		}
	});
	root.$ = root.jQuery = jQuery;
})(this);
