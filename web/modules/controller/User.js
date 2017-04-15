ExpressIM.AdminUserController = Class.create();
ExpressIM.AdminUserController.prototype = Class.extend({
    _initialize: function (options) {
        this._view = "User";
        this._modelType = "user";
        this._lockKeyField = true;
        this._fields = [
            { label: "ID",
                property: "id",
                gridOptions: "width:100,field:'id'",
                isSearchField: false
            },
            { label: "用户名",
                property: "username",
                gridOptions: "width:200,field:'username'",
                isSearchField: true,
                isKeyField: true
            },
            { label: "姓名",
                property: "name",
                gridOptions: "width:200,field:'name'",
                isSearchField: true,
                isKeyField: false
            },
            { label: "状态",
                property: "status",
                gridOptions: "width:200,field:'status',formatter:ExpressIM.UIComponent.DataGridFormater.UserStatus",
                isSearchField: true,
                isKeyField: false
            },
            { label: "用户组",
                property: "type",
                gridOptions: "width:200,field:'type',formatter:ExpressIM.UIComponent.DataGridFormater.UserGroup",
                isSearchField: true,
                isKeyField: false
            }
        ];
    },

    _bindEvents: function () {
        this.on("OnCreateNew", this, (function (ctx) {
            this.find("status").combobox("setValue", "A");
            this.find("type").combobox("setValue", "A");
            this._restrictPassword();
        }));

        this.on("OnReset", this, (function (ctx) {
            this.find("status").combobox("setValue", "A");
            this.find("type").combobox("setValue", "A");
        }));

        this.on("OnReadComplete", this, (function (ctx) {
            var password = this.find("password");
            var value = password.textbox("getValue");
            this._restrictPassword();
        }));
        
        this._lookup.on("OnPreFilter", this, function (ctx) {
            if (ctx.params.searchBy == "status") {
                if ("激活".indexOf(ctx.params.searchValue) != -1) {
                    ctx.params.searchValue = "A";
                }
                if ("注销".indexOf(ctx.params.searchValue) != -1) {
                    ctx.params.searchValue = "W";
                }
            }
            if (ctx.params.searchBy == "type") {
                if ("管理员".indexOf(ctx.params.searchValue) != -1) {
                    ctx.params.searchValue = "A";
                }
                if ("操作员".indexOf(ctx.params.searchValue) != -1) {
                    ctx.params.searchValue = "O";
                }
                if ("审核人".indexOf(ctx.params.searchValue) != -1) {
                    ctx.params.searchValue = "L";
                }
            }
        });
    },

    _restrictPassword: function () {
        this.find("password").textbox('textbox').attr("maxlength", 16);
        this._setFieldValue(this.find("username"), this._getFieldValue(this.find("SEARCH_KEY")));
        this._disableField(this.find("username"));
    }
}, ExpressIM.MaintenanceController.prototype);




$(document).ready(function () {
    var controller = new ExpressIM.AdminUserController({});
});