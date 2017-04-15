ExpressIM.ExitController = Class.create();
ExpressIM.ExitController.prototype = Class.extend({
    _initialize: function (options) {
        this._view = "Exit";
    },

    _bindEvents: function () {
        $.messager.confirm('信息', '是否要退出?', (function (r) {
            if (r) {
                this.getTask().terminate();
                $.ajax({
                    type: "post",
                    url: "logoff",
                    success: (function (data, textStatus) {
                        window.location.reload();
                    }),
                    complete: (function (XMLHttpRequest, textStatus) {

                    })
                });
            } else {
                this.getTask().terminate();
            }
        }).bind(this), "question");
    }
}, ExpressIM.Controller.prototype);


$(document).ready(function () {
    var controller = new ExpressIM.ExitController({});
});