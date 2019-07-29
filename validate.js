(function ($) {
    $.fn.checkForm = function (options) {
        var root = this; //将当前应用对象存入root
        var isok = false; //控制表单提交的开关
        var pwd1; //密码存储
        var defaults = {
            tips:{
                //提示信息
                tips_required: '不能为空',
                tips_email: '邮箱地址格式有误',
                tips_mobile: '手机号码格式有误',
                tips_idcard: '身份证号码格式有误',
                tips_range_min:'当前值小于有效最小值',
                tips_range_max:'当前值大于有效最大值'
            },
            regs:{
                  //正则
                reg_email: /^\w+\@[a-zA-Z0-9]+\.[a-zA-Z]{2,4}$/i,  //验证邮箱
                reg_mobile: /^1[3458]{1}[0-9]{9}$/,                //验证手机
                reg_idcard: /^\d{14}\d{3}?\w$/                     //验证身份证
            }
        };
        defaults = $.extend(true,{},defaults,options);
        $(root).on('blur',function(e) {
            var target = e.target;
            var _validList = getCheckList(target);
            _validList.forEach(function(item) {
                //逐个进行验证，不通过跳出返回false,通过则继续
                if(!check(target,item,target.value)) {
                    return false;
                } else {
                    continue;
                }
            })
        })
        function getCheckList(elm) {//获取check属性的值
            var _validList = $(elm).attr("check");
            _validList = _validList ? _validList.split(/\s+/) : [];//拆分
            return _validList;
        }
        //表单提交时执行验证,与上面的方法基本相同，只不过是在表单提交时触发
        function _onSubmit() {
            isok = true;
            $(":text,:password,textarea", root).each(function () {
                var _validate = getCheckList(this);
                _validList.forEach(function(item) {
                    if (!check($(this), item, this.value)) {
                        isok = false; //验证不通过阻止表单提交，开关false
                        return; //跳出
                    }
                })
            });
        }
        //判断当前对象是否为表单，如果是表单，则提交时要进行验证
        if (root.is("form")) {
            root.submit(function () {
                _onSubmit();
                return isok;
            })
        }
        //验证方法
        var check = function (elm, _match, _val) {
            var tips = defaults.tips;
　　　　　　　//根据验证情况，显示相应提示信息，返回相应的值
            switch (_match) {
                case 'required':
                    return showMsg(elm,tips.tips_required,!!_val);
                break;
                case 'email':
                    return showMsg(elm,tips.tips_required,chk(_val, tips.reg_email));
                break;
                case 'mobile':
                    return showMsg(elm,tips.tips_success,chk(_val, tips.reg_mobile));
                break;
                case 'idcard':
                    return showMsg(elm,tips.tips_success,chk(_val, tips.reg_idcard));
                break;
                case 'min':
                    return showMsg(elm,tips.tips_range_min,checkRange(elm,_val,'min'));
                break;
                case 'max':
                    return showMsg(elm,tips.tips_range_min,checkRange(elm,_val,'min'));
                break;
                case 'max':
                break;
                default:
                    return true;
            }
        }
        var checkRange = function (elm,val,type) {
            var range = $(elm).attr(type);
            if(!/\d+/.test(val) || /\d+/.test(range)) return false;
            return type == 'min' ? range < val : range > val;
        }
        //正则验证
        var chk = function (str, reg) {
            return reg.test(str);
        }
        //显示信息
        var showMsg = function (elm, msg, result) {
            $(elm).next(".tip_box").remove();//先清除
            var _html = "<span class='tip_box "+ (result ? 'tip_success' : 'tip_error') +"'>" + msg + "</span>";
            $(elm).after(_html);//再添加
            return result;
        }
    }
})(jQuery);

