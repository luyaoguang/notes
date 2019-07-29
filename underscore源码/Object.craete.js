var Ctor = function() {};
var baseCreate = function(prototype) {
    if(toString.call(prototype) !== '[object Object]') return {};
    if(Object.create) return Object.create(prototype);
    Ctor.prototype = prototype;
    var result = new Ctor();
    Ctor.prototype = null;
    return result;
}