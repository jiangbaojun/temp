/**
 * 全屏
 * @author		jiagnbaojun
 * @Version		1.0
 */
(function ($) {
    /**
     * jQuery扩展控件方法
     * @param options   自定义配置选项
     * @param params    暴露方法参数
     */
	var e, func, doc, opts;
	
    $.fn.mrkFullScreen = function (options, params) {
    	init(this, options, params);
    	if (typeof options == "object") {
    		opts = $.extend({}, $.fn.mrkFullScreen.defaultOptions, options);
    		initHandler();
    	}
    	 //扩展方法
        if (typeof options == "boolean") {
        	var methodName = "";
        	if(options){
        		methodName = "in";
        	}else{
        		methodName = "out";
        	}
            var method = $.fn.mrkFullScreen.methods[methodName];
            if (method) return method(this, params);
        }else if(options==undefined){
        	var method = $.fn.mrkFullScreen.methods["status"];
        	return method(this);
        }
    };
    $.fn.mrkFullScreen.defaultOptions = {
    	fullscreenChange: function(status,target){},
    	fullscreenError: function(target){}
    };
    $.fn.mrkFullScreen.methods = {
    	//进入全屏
    	"in": function(target, params){
            fc_in(true);
            opts.fullscreenchange.call(target,true,target);
		},
		//退出全屏
		"out": function(target, params){
			fc_out(false);
            opts.fullscreenchange.call(target,false,target);
		},
		//状态
		"status": function(target){
			return fc_status();
		}
	};
    function fc_in(state){
        func = (e["requestFullscreen"])
            || (e["webkitRequestFullscreen"])
            || (e["webkitRequestFullScreen"])
            || (e["msRequestFullscreen"])
            || (e["mozRequestFullScreen"]);
        if (func){
            func.call(e);
        }
        return this;
    }
    function fc_out(state){
        func = (doc["exitFullscreen"])
            || (doc["webkitExitFullscreen"])
            || (doc["webkitCancelFullScreen"])
            || (doc["msExitFullscreen"])
            || (doc["mozCancelFullScreen"]);
        if (func){
        	func.call(doc);
        }
        return this;
    }
    function fc_status(){
    	var state = null;
    	//当前浏览器不支持全屏
        if (!((doc["exitFullscreen"])
            || (doc["webkitExitFullscreen"])
            || (doc["webkitCancelFullScreen"])
            || (doc["msExitFullscreen"])
            || (doc["mozCancelFullScreen"]))){
            return null;
        }
        
        //非全屏状态
        state = !!doc["fullscreenElement"]
            || !!doc["msFullscreenElement"]
            || !!doc["webkitIsFullScreen"]
            || !!doc["mozFullScreen"];
        if (!state) return state;
        
        //全屏状态返回true或者全屏的元素
        return (doc["fullscreenElement"])
            || (doc["webkitFullscreenElement"])
            || (doc["webkitCurrentFullScreenElement"])
            || (doc["msFullscreenElement"])
            || (doc["mozFullScreenElement"])
            || state;
    }
    
    /**
     * 初始化
     * @param target    全屏jquery对象
     * @param options   初始化配置选项，用于替换控件默认配置选项
     * @param params    暴露方法参数
     */
    function init(target, options, params){
        if (!this.length) return this;
        e = target.get(0);
        if (e.ownerDocument){
        	doc = e.ownerDocument;
        }else{
            doc = e;
            e = doc.documentElement;
        }
    }
    function initHandler(){
        e = document;
        if (e["webkitCancelFullScreen"])
        {
            change = "webkitfullscreenchange";
            error = "webkitfullscreenerror";
        }
        else if (e["msExitFullscreen"])
        {
            change = "MSFullscreenChange";
            error = "MSFullscreenError";
        }
        else if (e["mozCancelFullScreen"])
        {
            change = "mozfullscreenchange";
            error = "mozfullscreenerror";
        }
        else 
        {
            change = "fullscreenchange";
            error = "fullscreenerror";
        }
        $(document).off(change, fullScreenChangeHandler);
        $(document).off(error, fullScreenErrorHandler);
        
        $(document).on(change, fullScreenChangeHandler);
        $(document).on(error, fullScreenErrorHandler);
    }
    function fullScreenChangeHandler(event){
    	var target = $(event.target);
    	if(fc_status()){
    		opts.fullscreenchange.call(target,true,target);
    	}else{
    		opts.fullscreenchange.call(target,false,target);
    	}
    }
    function fullScreenErrorHandler(event){
    	var target = $(event.target);
    	opts.fullscreenchange.call(target,target);
    }

})(jQuery);
