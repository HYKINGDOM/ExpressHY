ExpressIM.SimpleModel = Class.create();
ExpressIM.SimpleModel.prototype = Class.extend({
    initialize: function (options) {
        this._data = options.data ? options.data : {};
        this._fieldsDefinition = options.fields ? options.fields : {};
        this._indexField = "ID";
    },

    setData: function (data) {
        this._data = data;
    },

    getData: function () {
        return this._data;
    },

    get: function (property) {
        return this._data[property];
    },

    set: function (property, value) {
        this._data[property] = value;
    },

    toUrlParameter: function () {
        var param = "";
        for (var p in this._data) {
            if (!this._fieldsDefinition[p]) continue;
            if (param == "") {
                param = this._fieldsDefinition[p] + "=" + escape(this._data[p]);
            } else {
                param += "&" + this._fieldsDefinition[p] + "=" + escape(this._data[p]);
            }
        }
        return param;
    },

    toJSONParameter: function() {
        var json = {};
        for (var p in this._data) {
            if (!this._fieldsDefinition[p]) continue;
            /*
            if (param == "") {
                param = this._fieldsDefinition[p] + "=" + escape(this._data[p]);
            } else {
                param += "&" + this._fieldsDefinition[p] + "=" + escape(this._data[p]);
            }
            */
            json[this._fieldsDefinition[p]] = (this._data[p]);
        }
        return json;
    },

    getId: function () {
        return this._data.id;
    }
}, ExpressIM.EventDelegate.prototype);