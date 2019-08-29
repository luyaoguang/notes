//requireJs
require.config({
    paths:{
        'a':'./1.amd_a.js',//配置模块的短名称
        'b':'./1.amd_b.js'
    }
})
require(['a','b'], function(a,b) {
    console.log(a);//{name:"a.js"}
    console.log(b);//{Hello:fn}
})

//seaJs

seajs.config({
    alias:{
        'a':'./1.cmd_a.js',//配置模块的短名称
        'b':'./1.cmd_b.js'
    }
})
seajs.use(['a','b'], function(a,b) {
    console.log(a);//{name:"a.js"}
    console.log(b);//{Hello:fn}
})