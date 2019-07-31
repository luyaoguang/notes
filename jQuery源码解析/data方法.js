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