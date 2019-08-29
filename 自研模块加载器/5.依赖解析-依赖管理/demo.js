(function(global) {
    var startUp = global.startUp = {
        version:"1.0.1"
    }
    var data = {};
    data.preload = [];
    //获取当前项目文档的URL
    data.cwd = document.URL.match(/[^?]*\//)[0]

    var cache = {};
    //模块的生命周期
    var status = {
        FETCHED:1,
        SAVED:2,
        LOADING:3,
        LOADED:4,
        EXECUTING:5,
        EXECTED:6
    }
    var _cid = 0;
    function cid() {
        return _cid++;
    }

    function isArray (obj) {
        return toString.call(obj) === "[object Array]";
    }
    function isString(str) {
        return toString.call(str) === "[object String]";
    }

    function parseAlias (id) {//检测是否有别名
        var alias = data.alias;//配置
        return alias && isString(alias[id]) ? alias[id] : id;
    }

    var PATHS_RE = /^([^\/:]+)(\/.+)$/;
    function parsePaths(id) {//检测是否有路径别名
        var paths = data.paths;//配置
        if(paths && (m = id.match(PATHS_RE)) && isString(paths[m[1]])) {
            id = paths[m[1]] + m[2];
        }
        return id;
    }

    function normalize(path) {
        var last = path.length - 1;//拿到左后一个字符串的下标
        var lastC = path.charAt(last);//取到最后一个字符
        //如果最后一个字符是/ => a/b
        //或者最后三个字符是.js  => a.js
        //就返回path 否在返回path + '.js'
        return (lastC === '/' || path.substring(last - 2) === '.js') ? path : path + '.js';
    }

    var DOT_RE = /\/.\//g;//  a/b/./c/./d ==> a/b/c/d
    var DOUBLE_DOT_RE = /\/[^/]+\/\.\.\//;  //  a/b/c/../../d   ==>  a/b/../d  ==>  a/d
    function realpath(path) {
        path = path.replace(DOT_RE, "/");
        while(path.match(DOUBLE_DOT_RE)) {
            path = path.replace(DOUBLE_DOT_RE, "/");  //  /c/../ ==> /
        }
        return path;
    }

    function addBase(id, uri) {
        var result;
        if(id.charAt(0) === ".") {//相对路径  ./a.js 同目录下的a.js文件 ../a.js 上一级目录下的a.js文件
            result = realpath((uri ? uri.match(/[^?]*\//)[0] : data.cwd) + id);
        } else {//绝对路径  a.js 根目录下的a.js文件
            result = data.cwd + id;
        }
        return result;
    }

    startUp.resolve = function(child, parent) {
        if(!child) return "";
        child = parseAlias(child);//检测是否有别名
        child = parsePaths(child);//检测是否有路径别名 依赖模块中引包的模块路径地址 require("app/c");
        child = normalize(child);//检测是否添加后缀
        return addBase(child, parent);//添加根目录
    }

    startUp.request = function(url, callback) {
        var node = document.createElement("script");
        node.src = url;
        document.body.appendChild(node);
        node.onload = function() {
            node.onload = null;
            document.body.removeChild(node);
            callback();//事件函数
        }
    }

    //构造函数 模块初始化数据
    function Module(uri, deps) {
        this.uri = uri;
        this.deps = deps || [];//依赖项 ["a.js","b.js"]
        this.exports = null;
        this.status = 0;
        this._waitings = {};//多少个模块依赖于我
        this._remain = 0;//当前模块是否有依赖项
    }

    Module.prototype.load = function() {
        var m = this;//指向Module实例对象
        m.status = status.LOADING;//LOADING == 正在加载模块的依赖项
        var uris = m.resolve();//获取主干上的依赖项 提取deps选项
        var len = m._remain = uris.length;
        console.log(m);
        //加载主干上的依赖项(模块)
        var seed;
        for(var i = 0; i < len; i++) {
            seed = Module.get(uris[i]);//创建缓存信息
            if(seed.status < status.LOADED) {//LOADED == 4 准备加载执行
                seed._waitings[m.uri] = seed._waitings[m.uri] || 1;
            } else {
                seed._remain--;
            }
        }

        //如果依赖列表的模块全部加载完毕
        if(m._remain == 0) {
            //获取模块的接口对象
            m.onload();
        }

        //准备执行根目录下的依赖列表中的模块
        var requestCache = {};
        for(var i = 0; i < len; i++) {
            seed = Module.get(uris[i]);//拿到缓存信息
            if(seed.status < status.FETCHED) {//FETCHED 正在获取当前模块uri
                seed.fetch(requestCache);
            }
        }

        for(uri in requestCache) {
            requestCache[uri]();
        }
    }

    Module.prototype.define = function() {

    }
    Module.prototype.resolve = function() {
        var mod = this;
        var ids = mod.deps;
        var uris= [];
        for(var i = 0; i < ids.length; i ++) {
            uris[i] = startUp.resolve(ids[i], mod.uri);//依赖项 (主干 | 子树)
        }
        return uris;
    }

    //加载依赖列表中的模块
    Module.prototype.fetch = function(requestCache) {
        var m = this;//Module实例对象
        m.status = status.FETCHED;
        var uri = m.uri;
        requestCache[uri] = sendRequest;//Document.createElement("script");
        function sendRequest() {
            startUp.request(uri, onRequest);//动态加载script
        }
        function onRequest() {
            // if(anoymouseMeta) {//模块的数据更新
            //     m.save(uri, anoymouseMeta);
            // }
            m.load();//递归 模块加载策略
        }
    }

    Module.prototype.save = function(uri, meta) {
        
    }

    Module.prototype.onload = function() {//所有依赖模块加载完毕
        var mod = this;
        // console.log(mod);
        mod.status = status.LOADED;
        if(mod.callback) {//获取模块的接口对象
            mod.callback();
        }
    }

    Module.get = function(uri, deps) {
        return cache[uri] || (cache[uri] = new Module(uri, deps));
    }

    Module.use = function(deps, callback, uri) {
        var m = Module.get(uri, isArray(deps) ? deps : [deps]);//拿到Module实例对象
        //所有模块都加载完毕
        m.callback = function() {
            var exports = [];//所有依赖项模块的接口对象
            var uris =  m.resolve();
            for(var i = 0; i < uris.length; i++) {
                exports[i] = cache[uris[i].exec()];//获取模块对外定义的接口对象
            }
            if(callback) {
                callback.apply(global, exports);
            }
        }
        m.load();
    }
    
    //定义一个模块
    Module.define = function() {

    }
    
    Module.preload = function(callback) {
        var length = data.preload.length;
        if(!length) callback();
    }

    startUp.use = function(list, callback) {
        //检测有没有预先加载的模块
        Module.preload(function() {
            Module.use(list, callback, data.cwd + '_use_' + cid());//虚拟的根目录
        })
    }
    global.define = Module.define
})(this)