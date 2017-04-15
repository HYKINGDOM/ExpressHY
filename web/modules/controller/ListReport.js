ExpressIM.ListReportController = Class.create();
ExpressIM.ListReportController.prototype = Class.extend({
    _initialize: function (options) {
        this._view = "ListReport";
    },

    _getParams: function(){
    	var p = "?startDate=" + this._getFieldValue(this.find("startDate")) + "&endDate=" + this._getFieldValue(this.find("endDate"));
    	return p;
    },
    
    _bindEvents: function () {
	   	 this.find("theDate").datebox({
			 onSelect: (function(){
				 this.setDateRange();
			 }).bind(this)
		 });
    	
	   	this.find("grp").combobox({
            onChange: (function (newValue, oldValue) {
            	this.setDateRange();
            }).bind(this)
	   	});
            
	   	 
    	 this._btnRun = this.find("run");
    	 this._btnRun.linkbutton({
             onClick: (function () {
            	 if (this._getFieldValue(this.find("theDate")) != "") {
            		 this.openNewTagWin('modules/reporting/rptList.html');
            	 } else {
            		 $.messager.alert('错误', "请选择日期", 'error', function(){
                         
                     });
            	 }
            	 
            	 // window.open ('modules/reporting/rptList.html' + this._getParams(), 'newwindow', 'height=510px, width=900px, scrollbars=yes, resizable=yes');
             }).bind(this)
         });
    	 
    	 this._btnCancel = this.find("cancel");
    	 this._btnCancel.linkbutton({
             onClick: (function () {
                 this.getTask().terminate();
             }).bind(this)
         });
    	 

    	 this._startTime = this.find("startDate");
         this._startTime.datebox("textbox").bind("focus", (function() {
             this._setFieldValue(this.find("startDate"),"");
         }).bind(this)).bind(this);
         this._endTime = this.find("endDate");
         this._endTime.datebox("textbox").bind("focus", (function () {
             this._setFieldValue(this.find("endDate"), "");
         }).bind(this)).bind(this);
    },
    
    openNewTagWin: function(url) {
    	var params = "<input type='hidden' name='startDate' value='" + this._getFieldValue(this.find("startDate")) + "'/>"
    				+ "<input type='hidden' name='endDate' value='" + this._getFieldValue(this.find("endDate")) + "'/>";
    	$("#tagWinContainer").html("<form id='hiddenlink' method ='get' action='"+url+"' target='_blank'>" + params + "</form>");
        var s=document.getElementById("hiddenlink");
        s.submit();
    },
    
    setDateRange: function(){
    	if (this._getFieldValue(this.find("theDate")) == "") {
    		return;
    	}
    	var timeStart = "00:00:00";
    	var timeEnd = "00:00:00";
    	if (this._getFieldValue(this.find("grp")) == "早班") {
    		timeStart = "08:00:01";
    		timeEnd = "20:00:00";
    	} else {
    		timeStart = "20:00:01";
    		timeEnd = "08:00:00";
    	}
    	var start = new Date(Date.parse(this._getFieldValue(this.find("theDate"))));
    	var end = new Date(Date.parse(this._getFieldValue(this.find("theDate"))));
    	if (this._getFieldValue(this.find("grp")) == "晚班") {
    		end = new Date(end.valueOf() + 1*24*60*60*1000);
    	}
    	this.find("startDate").datetimebox("setValue", start.format('yyyy-MM-dd') + ' ' + timeStart);
    	this.find("endDate").datetimebox("setValue", end.format('yyyy-MM-dd') + ' ' + timeEnd);
    }
}, ExpressIM.Controller.prototype);




$(document).ready(function () {
    var controller = new ExpressIM.ListReportController({});
});