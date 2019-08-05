//UnderScore是通过一个对象挂在的静态方法进行调用的
(function(root) {
    var _ = function() {
        if(obj instanceof _) {
            return obj;
        }
        if(!(this instanceof _)) {
            return new _(obj);
        }
        this._wrapped = obj;
    };
    _.chain = function(obj) {
        var instance = _(obj);
        instance._chain = true;
        return instance;
    }
    _.prototype.value = function() {
        return this._wrapped;
    }
    var result = function(instance, obj) {
        return instance._chain ? _(obj).chain() : obj;       
    }
    _.mixin = function(obj) {
        _.each(_.functions(obj), function(name) {
            var func = obj[name];
            _.prototype[name] = function() {
                var args = [this._wrapped];
                push.apply(args, arguments);
                //instance 去重之后的结果
                return result(this, func.apply(this,args));
            }
        })
    }
    _.functions = function(obj) {
        var result = [],key;
        for(key in obj) {
            result.push(key);
        }
        return result;
    }
    _.each = function(target, callback) {
        var key, i = 0;
        if(_.isArray(target)) {//如果是数组
            var length = target.length;
            for(; i < length; i++) {
                callback.call(target, target[i], i);
            }
        } else {//如果是类数组对象
            for(key in target) {
                callback.call(target, key, target[key]);
            }
        }
    }
   _.mixin(_);
    root._ = _;
})(this);
