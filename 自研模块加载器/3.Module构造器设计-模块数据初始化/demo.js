(function(global) {
    var startUp = global.startUp = {
        version:"1.0.1"
    }
    var data = {};
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
    var isArray = function(obj) {
        return toString.call(obj) === "[object Aray]";
    }

    data.preload = [];

    //获取当前项目文档的URL
    data.cwd = document.URL.match(/[^?]*\//)[0];

    //构造函数 模块初始化数据
    function Module(uri, deps) {
        this.uri = uri;
        this.deps = deps || [];//依赖项 ["a.js","b.js"]
        this.exports = null;
        this.status = 0;
        this._waitings = {};
        this._remain = 0;
    }

    Module.prototype.load = function() {
        var m = this;
        m.status = status.LOADING;
    }

    Module.prototype.define = function() {

    }

    Module.get = function(uri, deps) {
        return cache[uri] || (cache[uri] = new Module(uri, deps));
    }

    Module.use = function(deps, callback, uri) {
        var m = Module.get(uri, isArray(deps) ? deps : [deps]);//拿到Module实例对象
        console.log(m);
        //所有模块都加载完毕
        m.callback = function() {

        }
        m.load();
    }
    Module.define = function() {

    }
    var _cid = 0;
    function cid() {
        return _cid++;
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