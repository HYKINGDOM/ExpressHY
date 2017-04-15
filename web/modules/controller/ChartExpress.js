/**
 * Created by Administrator on 2017/4/13.
 */
ExpressIM.HistoryController = Class.create();
ExpressIM.HistoryController.prototype = Class.extend({
    _initialize: function (options) {
        this._view = "History";
    },

    _bindEvents: function () {

        this._startTime = this.find("startDate");
        this._startTime.datebox("textbox").bind("focus", (function() {
            this._setFieldValue(this.find("startDate"),"");
        }).bind(this)).bind(this);
        this._endTime = this.find("endDate");
        this._endTime.datebox("textbox").bind("focus", (function () {
            this._setFieldValue(this.find("endDate"), "");
        }).bind(this)).bind(this);

        this._vehicleType = this.find("vehicleType");
        this._vehicleType.datebox("textbox").bind("focus", (function () {
            this._setFieldValue(this.find("vehicleType"), "");
        }).bind(this)).bind(this);

        this._channel = this.find("channel");
        this._channel.datebox("textbox").bind("focus", (function () {
            this._setFieldValue(this.find("channel"), "");
        }).bind(this)).bind(this);

        this._channelType = this.find("channelType");
        this._channelType.datebox("textbox").bind("focus", (function () {
            this._setFieldValue(this.find("channelType"), "");
        }).bind(this)).bind(this);

        this.grid = this.find("grid");
        this.grid.datagrid({
            url: "history",
            onBeforeLoad:(function(params){
                params.startDate = this._getFieldValue(this.find("startDate"));
                params.endDate = this._getFieldValue(this.find("endDate"));
                params.vehicleNumber = this._getFieldValue(this.find("vehicleNumber"));
                params.vehicleType = this._getFieldValue(this.find("vehicleType"));
                params.channel = this._getFieldValue(this.find("channel"));
                params.channelType = this._getFieldValue(this.find("channelType"));
                params.sortBy = ":date";
            }).bind(this),
            onLoadError: (function(data) {

            }).bind(this),
            onClickCell: (function(index,field,value) {
                var rows = this.grid.datagrid("getRows");
                this._currentSelected = rows[index];
                //alert(JSON.stringify(rows[index].id))
            }).bind(this),
            onDblClickRow: (function(index,row) {
                //this.showDetailForm(row);
            }).bind(this)
        });

        this.search = this.find("search");
        this.search.linkbutton({
            onClick: (function () {
                this.grid.datagrid('reload');
            }).bind(this)
        });
        if (session != "MASTER") {
            this.find("delete").hide();
        } else {
            this.remove = this.find("delete");
            this.remove.linkbutton({
                onClick: (function () {
                    if (this._currentSelected) {
                        $.messager.confirm('信息', '确定要删除该记录?', (function (r) {
                            if (r) {
                                this.removeRecord(this._currentSelected.id);
                            } else {

                            }
                        }).bind(this), "question");
                    }

                }).bind(this)
            });
        }
        $('#' + this.getTask().taskIdx).window("maximize");
    },

    removeRecord: function(id) {
        this._msg = new ExpressIM.UIComponent.LoadingMask({});
        this._msg.render();
        $.ajax({
            type: "post",
            url: "deleterecord?MODEL_TYPE=history&id=" + id,
            success: (function (data, textStatus) {
                this._msg.destroy();
                this._msg = null;
                if (data.error && data.error.length > 0) {
                    $.messager.alert('错误', data.error, 'error');
                }
                this.grid.datagrid('reload');
            }).bind(this),
            complete: (function (XMLHttpRequest, textStatus) {

            }).bind(this)
        });
    },

    showDetailForm: function(row){
        var reportName = "rptApproved.html";
        if (row.isAffectation) {
            reportName = "rptRejected.html";
        }
        window.open ('modules/reporting/' + reportName + this.modelToParameter(row), 'newwindow', 'height=600px, width=900px, scrollbars=yes, resizable=yes');
    },

    modelToParameter: function(model) {
        var results = "?run=true";
        for (var key in model) {
            if (key == "operator") {
                results +="&" + key + "=" +escape(model[key].name);
            } else if (key == "leader") {
                results +="&" + key + "=" +escape(model[key].name);
            } else if (key.indexOf("snapshoot") != -1){
                if (model[key] && model[key].length > 0) {
                    results +="&" + key + "=" +escape(model[key]);
                } else {
                    results +="&" + key + "=" +escape("resource/images/photo-not-available.jpg");
                }

            }else {
                results +="&" + key + "=" +escape(model[key]);
            }

        }
        return results;
    }
}, ExpressIM.Controller.prototype);

$(document).ready(function () {
    var controller = new ExpressIM.HistoryController({});
});

function formatDatebox(val) {
    var re = /-?\d+/;
    var m = re.exec(val);
    var d = new Date(parseInt(m[0]));
    // 按【2012-02-13 09:09:09】的格式返回日期
    return d.format("yyyy-MM-dd hh:mm:ss");
}

Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

