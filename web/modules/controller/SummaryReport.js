ExpressIM.SummaryReportController = Class.create();
ExpressIM.SummaryReportController.prototype = Class.extend({
    _initialize: function (options) {
        this._view = "SummaryReport";
    },

    _getParams: function(){
    	var p = "?startDate=" + this._getFieldValue(this.find("startDate")) + "&endDate=" + this._getFieldValue(this.find("endDate")) + "&vCount=" + this._getFieldValue(this.find("vCount")) + "&vAmount=" + this._getFieldValue(this.find("vAmount"));
    	return p;
    },
    
    _bindEvents: function () {
    	 this._btnRun = this.find("run");
    	 this._btnRun.linkbutton({
             onClick: (function () {
            	 this.openNewTagWin('modules/reporting/rptSummary.html');
            	 //window.open ('modules/reporting/rptSummary.html' + this._getParams(), 'newwindow', 'height=510px, width=900px, scrollbars=yes, resizable=yes');
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
    				+ "<input type='hidden' name='endDate' value='" + this._getFieldValue(this.find("endDate")) + "'/>"
			    	+ "<input type='hidden' name='vCount' value='" + this._getFieldValue(this.find("vCount")) + "'/>"
			    	+ "<input type='hidden' name='vAmount' value='" + this._getFieldValue(this.find("vAmount")) + "'/>";
    	$("#tagWinContainer").html("<form id='hiddenlink' method ='get' action='"+url+"' target='_blank'>" + params + "</form>");
    	var s=document.getElementById("hiddenlink");
        s.submit();
    }
}, ExpressIM.ReportController.prototype);




$(document).ready(function () {
    var controller = new ExpressIM.SummaryReportController({});
});