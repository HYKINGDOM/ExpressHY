ExpressIM.CleanUpController = Class.create();
ExpressIM.CleanUpController.prototype = Class.extend({
    _initialize: function (options) {
        this._view = "CleanUp";
    },
    
    _bindEvents: function () {
    	 this._btnRun = this.find("run");
    	 this._btnRun.linkbutton({
             onClick: (function () {
            	if (this._getFieldValue(this.find("endDate")) == "") {
            		 $.messager.alert('错误', "请选择截止日期", 'error', function(){
                         
                     });
            	} else {
            		$.messager.confirm('信息', '确定要删除' + this._getFieldValue(this.find("endDate")) + '之前历史记录吗？记录删除之后将无法恢复!', (function (r) {
                        if (r) {
                            this.doClean();
                        } 
                    }).bind(this), "question");
            	}
             }).bind(this)
         });
    	 
    	 this._btnCancel = this.find("cancel");
    	 this._btnCancel.linkbutton({
             onClick: (function () {
                 this.getTask().terminate();
             }).bind(this)
         });
    	 
         this._endTime = this.find("endDate");
         this._endTime.datebox("textbox").bind("focus", (function () {
             this._setFieldValue(this.find("endDate"), "");
         }).bind(this)).bind(this);
    },
    
    doClean: function(){
    	var msg = new ExpressIM.UIComponent.LoadingMask({});
        msg.render();
		 $.ajax({
	            type: "post",
	            data: {
	            	    endDate: this._getFieldValue(this.find("endDate"))
	            	  },
	            url: "cleanUp",
	            success: (function (data, textStatus) {
	                   msg.destroy();
	                   $.messager.alert('信息', "操作完成", 'message', function(){
                           
                       });
	            }).bind(this)
	    });
    }
}, ExpressIM.Controller.prototype);




$(document).ready(function () {
    var controller = new ExpressIM.CleanUpController({});
});