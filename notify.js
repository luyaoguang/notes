var _jQuery = window.jQuery,
    _$ = window.$;
UnderScore.noConflict = function(deep){
    if(window.UnderScore === UnderScore){
        window.$ = _$;
    }
    if(deep && window.jQuery === jQuery){
    window.jQuery = _jQuery;
    }
};
(function(root) {
    var _ = function() {

    }
    var _UnderScoce = root._;//获取当前window对象的UnderScore对象 并保存
    _.notify = function(deep) {//deep用于控制是否转让
        if(deep && root._ === _){
            root._ = _UnderScoce;
        }
    }
    root._ = _;
})(this);