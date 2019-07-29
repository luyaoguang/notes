        map([1,2,3],function(value,index,object) {
            return value * 3;
        })
        function map(obj,iteratee,context) {
            iterate = cb(iteratee,context);
            var keys = toString.call(obj) !== '[object Array]' && Object.keys(obj);
            var length = (keys || obj).length;
            var result = Array(legnth);
            for(var index = 0; index < length; index++) {
                var currentKey = keys ? keys[index] : index;
                result[index] = iteratee(obj[currentKey], index, obj);
            }
            return result;
        }
        function cb(iteratee,context,count) {
            if(iteratee == null) {
                return identity;
            }
            if(toString.call(iteratee) === '[object Function]') {
                return optimizeCb(iteratee,context,count);
            }
        }
        function optimizeCb(func,context,count) {
            if(context == void 0) {
                return func
            }
            switch(count == null ? 3: count) {
                case 1 :
                    return function(value) {
                        return func.call(context,value);
                    }
                case 3 :
                    return function(value,index,obj) {
                        return func.call(context,value,index,obj);
                    }
            }
        }
        var identity = function(value) {
            return value;
        }