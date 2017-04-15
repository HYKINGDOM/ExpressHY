/*
* Stardust Software R&D Group Confidential
* Project: Express Gateway IM
*
* (C) Copyright Stardust Software R&D Group. 2014
*
* The source code for this program is not published or otherwise divested of 
* its trade secrets
*/

$.messager.defaults = { ok: "确定", cancel: "取消" };
var ExpressIM = {
    version: 'Beta In Door 1.0.1',
    copyright: 'Stardust Software',
    baseURL: '/ExpressIM' ,
    controllerDir: '',
    viewDir: "/ExpressIM/modules/view/",
    formDir:"/ExpressIM/modules/form/",
    modelDir: "",
    frontcontroller: "frontcontroller",
    reportserver: "reportserver",
    menuType: "menu",
    stationName: "勉县收费站",
    stationOwner: "周俊华"
};

ExpressIM.UIComponent = {};

Date.prototype.format = function(fmt)   
{ //author: meizz   
  var o = {   
    "M+" : this.getMonth()+1,                 //月份   
    "d+" : this.getDate(),                    //日   
    "h+" : this.getHours(),                   //小时   
    "m+" : this.getMinutes(),                 //分   
    "s+" : this.getSeconds(),                 //秒   
    "q+" : Math.floor((this.getMonth()+3)/3), //季度   
    "S"  : this.getMilliseconds()             //毫秒   
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
}; 

/**
*	Array iterator
* @author:	Cheng Li, Sep 06, 2013
**/
var $A = Array.from = function (iterable) {
    if (!iterable) return [];
    if (iterable.toArray) {
        return iterable.toArray();
    } else {
        var results = [];
        for (var i = 0; i < iterable.length; i++)
            results.push(iterable[i]);
        return results;
    }
}

/**
* Standard class declaration 
* @author:	Cheng Li, Sep 06, 2013
**/
var Class = {
    create: function () {
        return function () {
            this.initialize.apply(this, arguments);
        }
    }
}

/**
* Standard class inherit 
* @author:	Cheng Li, Sep 06, 2013
**/
Class.extend = function (destination, source) {
    for (property in source) {
        if (property.toString().indexOf("super_") != -1) continue;
        if (destination[property] != null) {
            destination["super_" + property] = source[property];
            continue;
        } else {
            destination[property] = source[property];
        }
    }
    return destination;
}

/**
* Bind scope 
* @author:	Cheng Li, Sep 06, 2013
**/
Function.prototype.bind = function () {
    var __method = this, args = $A(arguments), object = args.shift();
    return function () {
        return __method.apply(object, args.concat($A(arguments)));
    }
}

/**
* Bind scope with event argument
* @author:	Cheng Li, Sep 06, 2013
**/
Function.prototype.bindAsEventListener = function () {
    var __method = this, args = $A(arguments), object = args.shift();
    return function (event) {
        return __method.apply(object, [event || window.event].concat(args));
    }
}

/**
* Observer class, the instance of this class contains two members, in one word, they are <who> does <what> when observing event fired
* @author:	Cheng Li, Sep 06, 2013
**/
var Observer = Class.create();
Observer.prototype = {
    /**
    * Constructor
    **/
    initialize: function (executer, method) {
        this.executer = executer;
        this.method = method;
    },

    /**
    * Execute the callback when event fired
    **/
    Notify: function () {
        return this.method.apply(this.executer, arguments);
    },

    /**
    * Check if the current instance is equal to given observer
    **/
    IsEqual: function (observer) {
        return this.executer.IsEqual(observer.executer) && this.method == observer.method;
    }
}

/**
* Observer chain manages all observers who care the same event
* @author:	Cheng Li, Sep 06, 2013
**/
var ObserverChain = Class.create();
ObserverChain.prototype = {
    /**
    * Constructor
    **/
    initialize: function (event_name) {
        this.event_name = name;
        this.observer_list = [];
    },

    /**
    * Add new observer to chain
    * @param observer the new observer
    **/
    AddObserver: function (observer) {
        this.observer_list.push(observer);
    },

    /**
    * Notify all observers on chain when event fired
    * @param context data context
    **/
    NotifyAllObservers: function (context) {
        for (n = 0; n < this.observer_list.length; n++) {
            try {
                this.observer_list[n].Notify(context);
            } catch (e) {
            }
        }
    },

    /**
    * Remove observer from event chain
    * @param observer observer going to be removed
    **/
    StopObserving: function (observer) {
        for (n = 0; n < this.observer_list.length; n++) {
            try {
                if (this.observer_list[n].IsEqual(observer)) {
                    this.observer_list.splice(n, 1);
                }
            } catch (e) {
            }
        }
    }
}

/**
* Observer manager manages all event chains for each event. When one event fired, the om will notify all observers in the related event chain
* @author:	Cheng Li, Sep 06, 2013
**/
var ObserverManager = Class.create();
ObserverManager.prototype = {
    /**
    * Constructor
    **/
    initialize: function () {
        this.event_list = [];
    },

    /**
    * Add an observer for given event
    * @param event_name name of event
    * @observer observer who listen the event
    **/
    AddObserver: function (event_name, observer) {
        if (this.event_list.length <= 0 || this.event_list[event_name] == null) {
            this.event_list.push(event_name);
            this.event_list[event_name] = new ObserverChain(event_name);
        }
        this.event_list[event_name].AddObserver(observer);
    },

    /**
    * Tell all observers the given event has been fired
    * @param event_name name of event
    * @context data context
    **/
    NotifyAllObservers: function (event_name, context) {
        if (this.event_list[event_name]) {
            return this.event_list[event_name].NotifyAllObservers(context);
        }
    },

    /**
    * Remove observer from event chain according to event name
    * @param event_name name of event
    * @observer Removed observer
    **/
    StopObserving: function (event_name, observer) {
        if (this.event_list[event_name]) {
            this.event_list[event_name].StopObserving(observer);
        }
    }
}

/**
* Information class allows you to output all kinds of message to developers or log(error, warning, debugInfo)
* @author Cheng Li, Sep 06, 2013
**/
var Information = {
    error: function (message) {
        alert(message);
    },

    warning: function (message) {
        // alert(message);
    },

    debugInfo: function (message) {
        try {
            console.log(message);
        } catch (e) {
        }
    }
}

/**
* Common function helper class
* @author:	Cheng Li, Sep 06, 2013
**/
var Utils = {
    /**
    * Get element absolute offset left and offset top
    * @author:	Cheng Li, Sep 06, 2013
    * @param element
    * @return JSON value include X and Y coordinates {x:1,y:22}
    **/
    getElementLocationInViewPort: function (webElement) {
        var x = 0;
        var y = 0;
        // Convert JQuery object to DOM node
        try {
            webElement = webElement[0];
        } catch (e) { }
        var element = webElement;
        while (element) { // the loop to calculate element offsets in view port
            if (element == webElement.ownerDocument.body) break;
            if (element.offsetParent) {
                x += element.offsetLeft + element.offsetParent.clientLeft;
                y += element.offsetTop + element.offsetParent.clientTop;
            }
            element = element.offsetParent;
        }
        element = webElement;
        var s_x = 0;
        var s_y = 0;
        while (element) { // the loop to calculate total scroll distance
            s_x += element.scrollLeft || 0;
            s_y += element.scrollTop || 0;
            element = element.parentNode;
        }
        return { x: (x - s_x), y: (y - s_y) };
    }
}

/**
* Runtime context data storage
* @author Cheng Li, Sep 08,2013
**/
var Context = Class.create();
Context.prototype = {
    initialize: function () {
        this.param_list = [];
        this.id = "";
    },

    get: function (param_name) {
        var result = "";
        if (this.param_list[param_name]) {
            result = this.param_list[param_name];
        }
        return result;
    },

    set: function (param_name, param_value) {
        if (this.param_list.length <= 0 || this.param_list[param_name] == null) {
            this.param_list.push(param_name);
        }
        this.param_list[param_name] = param_value;
    },

    get$: function (property_name) {
        var result = "";
        try {
            eval('result = this.' + property_name);
        } catch (e) { }
        return result;
    },

    set$: function (property_name, property_value) {
        try {
            eval('this.' + property_name + " = " + property_value);
        } catch (e) { }
    }
}


/**
** Abstract super class for model entity class
** This class supplies basic data manipulation like sort by, search
** You can extend this class by inherit it and add your
** Database access logic by overide the Load() method.
** You can also attach controller or view object to the model object
** so that them can observe the change of model object and react
** @author Cheng Li, Sep 12, 2013
**/
ExpressIM.DataStore = Class.create();
ExpressIM.DataStore.prototype = {
    /**
    ** Constructor
    **/
    initialize: function (options) {
        this.observerManager = new ObserverManager();
        this.Columns = [];
        this.RecordNumber = 0;
        if (options.columns) {
            this.setColumns(options.columns)
        }
        this.JSONStore = new Array();
        this.data = new Array();
    },

    /**
    ** Attach a view or controller to this model object and make them observe model refresh event
    **/
    attach: function (listener) {
        this.addObserver("refresh", listener, listener.On_model_refresh);
    },

    /**
    ** Detach view or controller from model
    **/
    detach: function (listener) {
        // Implementation
        this.stopObserving("refresh", listener, listener.On_model_refresh);
    },

    /**
    ** Fire refresh event and notify all observers the model has been changed
    **/
    refresh: function () {
        this.OnRefresh();
    },

    /**
    ** Fire refresh event and notify all observers the model has been changed
    **/
    OnRefresh: function () {
        var context = new Object();
        this.RecordNumber = this.data.length;
        context.sender = this;
        context.requestAction = "model_refresh";
        this.notifyObserver("refresh", context);
    },

    /**
    ** Initialize the model data structure
    **/
    setColumns: function (columns) {
        for (i = 0; i < columns.length; i++) {
            this.Columns.push(columns[i].name);
            this.Columns[columns[i].name] = {
                index: i,
                name: columns[i].name,
                type: columns[i].type,
                length: columns[i].length
            };
        }
    },

    /**
    ** Load data and fire pre-load data event
    **/
    loadData: function (request) {
        this.notifyObserver("pre_load_data", request);
        this.load(request);
    },

    /**
    ** Load data without firing pre-load data event
    **/
    load: function (request) {
        this.data = request.data;
        this.RecordNumber = this.data.length;
        this.notifyObserver("post_load_data", request);
    },

    /**
    ** Parse JSON data and fill into inner data array
    **/
    fillStore: function (originalResponse) {
        try {
            var response = eval('(' + originalResponse.responseText + ')');
            this.JSONStore = response;
            this.data = this.JSONStore.data;
            this.RecordNumber = this.JSONStore.data.length;
        } catch (e) { }
        this.notifyObserver("post_load_data", this);
        this.OnRefresh();
    },

    /**
    ** Entry function for sorting model data
    **/
    sortBy: function (column_name, direction_code) {
        this.notifyObserver("pre_sort_data", this);
        setTimeout(this.doSort.bind(this, column_name, direction_code), 0);
    },

    /**
    ** Sortor method
    **/
    doSort: function (column_name, direction_code) {
        var direction_code = (direction_code) ? direction_code : "ASC";
        var column_index = this.Columns[column_name].index;
        var column_type = this.Columns[column_name].type;
        var data = this.data;
        var sort_fn = function (left, right) {
            var result = 0;
            var left_val = left[column_index]
            var right_val = right[column_index]
            if (column_type == "N") {
                left_val = parseFloat(left_val);
                right_val = parseFloat(right_val);
            }
            if (left_val > right_val) {
                result = (direction_code == "ASC") ? 1 : -1;
            }
            if (left_val < right_val) {
                result = (direction_code == "ASC") ? -1 : 1;
            }
            return result;
        }
        this.data.sort(sort_fn);
        sort_fn = null;
        this.notifyObserver("post_sort_data", this);
        this.OnRefresh();
    },

    /**
    ** Get a data in specific row and colum
    **/
    get: function (row_number, column_name) {
        var result = "";
        try {
            var column_index = this.Columns[column_name].index;
            result = this.data[row_number][column_index];
        } catch (e) {

        }
        return result;
    },

    /**
    * Get specific column by id
    * @param id - Id of specific row
    * @param column_name which column you want to return
    * @return return value of specific column
    **/
    getById: function (id, column_name) {
        var idIdx = this.Columns["id"].index;
        var result = null;
        for (var i = 0; i < this.data.length; i++) {
            if (this.get(i, "id") == id) {
                result = this.get(i, column_name);
                break;
            }
        }
        return result;
    },

    /**
    ** Get a specific row
    **/
    getRow: function (row_number) {
        return this.data[row_number];
    },

    /**
    ** Set data into model
    **/
    set: function (row_number, column_name, new_value) {
        try {
            var column_index = this.Columns[column_name].index;
            this.data[row_number][column_index] = new_value;
        } catch (e) {

        }
    },

    removeRow: function (row_number) {
        this.data.splice(row_number, 1);
        this.RecordNumber--;
        this.OnRefresh();
    },

    addRow: function (row_number, row) {
        this.data[row_number] = row;
        this.OnRefresh();
    },
    /**
    * Add event lisenter for the instance
    * @param event_name the name of observing event
    * @param evecuter the this pointer for who call the method
    * @param method event handler
    **/
    addObserver: function (event_name, executer, method) {
        var observer = new Observer(executer, method);
        this.observerManager.AddObserver(event_name, observer);
    },

    /**
    * Stop observe event
    * @param event_name the name of observing event
    * @param evecuter the this pointer for who call the method
    * @param method event handler
    **/
    stopObserving: function (event_name, executer, method) {
        var observer = new Observer(executer, method);
        this.observerManager.StopObserving(event_name, observer);
    },

    /**
    * Trigger event by giving event name
    * @param event_name the name of observing event
    * @param context context obect contains runtime variables
    **/
    notifyObserver: function (event_name, context) {
        this.observerManager.NotifyAllObservers(event_name, context);
    }
}

ExpressIM.EventDelegate = Class.create();
ExpressIM.EventDelegate.prototype = {
    /**
    * Constructor
    **/
    initialize: function () {
        this.observerManager = new ObserverManager();
        if (this._initialize) {
            this._initialize();
        }
    },

    addObserver: function (event_name, executer, method) {
        var observer = new Observer(executer, method);
        this.observerManager.AddObserver(event_name, observer);
    },

    stopObserving: function (event_name, executer, method) {
        var observer = new Observer(executer, method);
        this.observerManager.StopObserving(event_name, observer);
    },

    notifyObserver: function (event_name, context) {
        this.observerManager.NotifyAllObservers(event_name, context);
    },

    on: function (event_name, executer, method) {
        this.addObserver(event_name, executer, method);
    },

    trigger: function (event_name, context) {
        this.notifyObserver(event_name, context);
    },

    parseEvents: function (taskIdx) {
        var array = $('#' + taskIdx + " *[delegate-events]");
        var self = this;
        $.each(array, function (i, element) {
            element = $(element);
            if (element.attr("delegate-events")) {
                var events = element.attr("delegate-events").split(",");
                $.each(events, function (j, event) {
                    var e1 = event.split(":")[0];
                    var e2 = event.split(":")[1];

                    if (element.attr("class").indexOf("easyui-textbox") != -1 || element.attr("class").indexOf("easyui-validatebox") != -1 || element.attr("class").indexOf("easyui-number") != -1) {
                        element.textbox('textbox').on(e1, function (evt) {
                            var e = evt || window.event;
                            var target = e.target || e.srcElement;
                            self.trigger(e2, {
                                event: e,
                                target: $(target),
                                element: element
                            });
                        });
                    } else if (element.attr("class").indexOf("easyui-combobox") != -1) {
                        //element.combobox();
                    } else {
                        element.on(e1, (function (evt) {
                            var e = evt || window.event;
                            var target = e.target || e.srcElement;
                            self.trigger(e2, {
                                event: e,
                                target: $(target),
                                element: element
                            });
                        }).bind(this));
                    }
                });
            }
        });
    }
};


ExpressIM.UIComponent.LoadingMask = Class.create();
ExpressIM.UIComponent.LoadingMask.prototype = Class.extend({
    initialize: function (options) {
        this.observerManager = new ObserverManager();
        this._message = options.message ? options.message : "处理中,请等待...";
        this._element = options.element ? options.element : $("body");
    },

    render: function () {
        this._mask = $("<div class=\"datagrid-mask\" style=\"z-index:9998;display:block\"></div>").appendTo(this._element);
        var msg = $("<div class=\"datagrid-mask-msg\" style=\"z-index:9999;display:block;left:50%\"></div>").html(this._message).appendTo(this._element);
        msg._outerHeight(40);
        msg.css({ marginLeft: (-msg.outerWidth() / 2), lineHeight: (msg.height() + "px") });
        this._loadingBar = msg;
    },

    destroy: function () {
        this._loadingBar.remove();
        this._mask.remove();
    },

    update: function (message) {
        this._loadingBar.html(message);
    }

}, ExpressIM.EventDelegate.prototype);

ExpressIM.UIComponent.Lookup = Class.create();
ExpressIM.UIComponent.Lookup.prototype = Class.extend({
    /**
    * Constructor
    **/
    initialize: function (options) {
        this.observerManager = new ObserverManager();
        this._searchbox = options.searchbox;
        this._searchIDField= options.searchIDField;
        this._modelType = options.modelType;
        this._id = options.id;
        this._fields = options.fields;
        this._width = options.width ? options.width : 700;
        this._height = options.height ? options.height : 250;
        this._selectedRecord = null;
        this._params = options.params ? options.params : "";
        this._render();
    },

    getSelected: function() {
        return this._selectedRecord;
    },

    setParams: function(params) {
        this._params = params;
    },

    getParams: function() {
        return this._params;
    },

    _getActionUrl: function() {
        return   "lookup?MODEL_TYPE=" + this._modelType + this.getParams();
    },

    disable: function() {
        this._disabled = true;
        if (this._searchbox) {
            this._searchbox.textbox("disable");
        }
    },

    readonly: function() {
         if (this._searchbox) {
            this._searchbox.textbox("textbox").attr("readonly", true);
        }
    },

    allowWrite: function() {
        if (this._searchbox) {
            this._searchbox.textbox("textbox").attr("readonly", false);
        }
    },

    enable: function() {
        this._disabled = false;
        if (this._searchbox) {
            this._searchbox.textbox("enable");
        }
    },

    clear: function() {
        if (this._searchbox) {
            this._searchbox.textbox("setValue","");
        }
         if (this._searchIDField) {
            this._searchIDField.textbox("setValue","");
        }
        this._selectedRecord = null;
        this.trigger("OnClear", {

        });
    },

    getValue: function() {
         if (this._searchbox) {
            return this._searchbox.textbox("getValue");
        }
        return "";
    },

    show: function() {
           if (!this._searchWin) {
                    //var html = "<table style='width:" + this._width + "px;height:" + this._height + "px;' id='" + this._id + "_search_grid' toolbar='#search_grid_toolbar' remoteSort='true' loadMsg='处理中,请等待...' singleSelect='true' data-options=\"pageSize:10,fitColumns:true,pagination:true,rownumbers:false,url:'" + this._getActionUrl() + "'\" class=\"easyui-datagrid\"><thead><tr>";
                    var html = "<table style='width:" + this._width + "px;height:" + this._height + "px;' id='" + this._id + "_search_grid' toolbar='#search_grid_toolbar' remoteSort='true' loadMsg='处理中,请等待...' singleSelect='true' data-options=\"pageSize:10,fitColumns:true,pagination:true,rownumbers:false\"><thead><tr>";
                    var searchFields = "";
                    for (var i = 0; i < this._fields.length; i++) {
                        if (this._fields[i].gridOptions) {
                            html += "<th data-options=\"" + this._fields[i].gridOptions + "\">" + this._fields[i].label + "</th>";
                            if (this._fields[i].isSearchField) {
                                searchFields += "<option value='" + this._fields[i].property + "'>" + this._fields[i].label + "</option>";
                            }
                            if (this._fields[i].isKeyField) {
                                this._keyField = this._fields[i].property;
                            }
                        }
                    }
                    html += '</tr></thead></table>';
                    html += ' <div id="search_grid_toolbar" style="padding:2px 5px;">'
                    html += "<select id='search_fields' class=\"easyui-combobox\" style='height:20px;width:80px;' data-options='editable:false'>" + searchFields + "</select>";
                    html += "<input id='search_input' class=\"easyui-searchbox\" style=\"width:300px\" data-options=\"prompt:'请输入查找关键字'\"></input>"
                    html += '</div>'; 1
                    $("#taskContainer").append("<div id='" + this._id + "_search_window'>" + html + "</div>");
                    this._searchWin = $('#' + this._id + "_search_window").window({
                        modal: true,
                        title: "查找",
                        minimizable: false,
                        maximizable: false,
                        resizable: false,
                        shadow: false,
                        onClose: (function () {
                            this._searchWin.window("destroy");
                            this._searchWin = null;
                        }).bind(this),
                        onOpen: (function () {
                            $.parser.parse($('#' + this._id + '_search_window'), (function () {
                                this._searchGrid = $('#' + this._id + "_search_grid");
                                this._searchGrid.datagrid({
                                	method:"post",
                                    url: this._getActionUrl(),
                                    onBeforeLoad:(function(params){
                                             params.trust = 'Y';
                                             this.trigger("OnPreLookup", {params:params,datagrid:this._searchGrid,lookup:this});
                                    }).bind(this),
                                    onLoadError: (function(data) {
                                        try{
                                            var json = eval("(" + data.responseText + ")");
                                            if (json.remoteMessage) {
                                                $.messager.alert('错误', json.message, 'error', function(){
                                                    window.location.reload();
                                                });
                                            }
                                        }catch(e) {
                                        }
                                    }).bind(this),
                                    onDblClickRow: (function () {
                                        this._selectedRecord  = this._searchGrid.datagrid("getSelected");
                                        if (this._searchbox) {
                                            this._searchbox.textbox("setValue", this._searchGrid.datagrid("getSelected")[this._keyField]);
                                        } 
                                        if (this._searchIDField) {
                                            this._searchIDField.textbox("setValue",  this._searchGrid.datagrid("getSelected")["id"]);
                                        }
                                        if (!this._searchbox && !this.searchIDField) {
                                            this.trigger("OnLookup", {record:this._selectedRecord});
                                        }
                                        this._searchWin.window("close");
                                    }).bind(this)
                                });

                                //$('#' + this.getTask().taskIdx + "_search_grid").datagrid('getPager').pagination({
                                // beforePageText: "第",
                                //afterPageText: " 共 {pages}",
                                // displayMsg: "显示从 {from} 到 {to} (共 {total} 条记录)"
                                //});
                                $('#search_input').searchbox({ searcher:
                                         (function (value, name) {
                                            var searchParameters = {
                                                   searchBy: $('#search_fields').combobox("getValue"),
                                                   searchValue: value
                                             };

                                             this.trigger("OnPreFilter", {params:searchParameters});

                                             this._searchGrid.datagrid({
                                                 queryParams: searchParameters ,
                                                 pageNumber: 1
                                             });
                                             //this._searchGrid.datagrid({ pageNumber: 1 });
                                             this._searchGrid.datagrid("reload");
                                         }).bind(this)
                                });
                            }).bind(this));
                        }).bind(this)
                    });

                } else {
                    this._searchWin.window("open");
                }
    },

    _render: function () {
        if (this._searchbox) {
            this._searchbox.textbox({
                onClickButton: (function () {
                    this.show();
                }).bind(this)
            });

            this._searchbox.textbox({
                onChange: (function (newValue, oldValue) {
                    this.trigger("OnLookup", {
                        oldValue: oldValue,
                        searchbox: this._searchbox,
                        value: newValue
                    });
                }).bind(this)
            });

            this._searchbox.textbox("textbox").on("focus", (function (e) {
                this.clear();
            }).bind(this));
        }

        if (this._searchIDField && this._searchIDField.is(':hidden')) {
            this._searchIDField.textbox("textbox").parent().hide();
        }
    }
}, ExpressIM.EventDelegate.prototype);


ExpressIM.Controller = Class.create();
ExpressIM.Controller.prototype = Class.extend({
    /**
    * Constructor
    **/
    initialize: function (options) {
        this.options = options;
        this.observerManager = new ObserverManager();
        this._initialize(options);

        this.getEventDelegate().on("OnViewParseComplete", this, (function (context) {
            this.getEventDelegate().parseEvents(this.getTask().taskIdx);
            this.__bindEvents();
            $("textarea[class=richeditor]").cleditor({width:550,height:300});
            //$('input[class="uploadify-box"]').uploadify({'buttonText':"选择文件"});
            this._reset();
        }).bind(this));

        this.getEventDelegate().on("OnBeforeParseView", this, (function (context) {
            $("input[type=checkbox]").iCheck({
                 checkboxClass: 'icheckbox_flat-blue',
                 radioClass: 'iradio_minimal'
            });

             this.__preProceed();
        }).bind(this));

        this.getEventDelegate().on("OnTerminate", this, (function (context) {
            this.__destory(context);
        }).bind(this));
    },

    __destory: function (context) {
        this._destory();
    },

    __preProceed: function () {
        return;
    },

    _preProceed: function () {
        return;
    },

    __bindEvents: function () {
        this.___bindDefaultEvents();
        this._bindEvents();
    },

    _showRemoteMessage: function (json) {
        if (json.type == "ERROR") {
            $.messager.alert('错误', json.message, 'error');
        } else if(json.type =="INVALID_SESSION") {
            $.messager.alert('错误', json.message, 'error', function(){
                window.location.reload();
            });
        } else if (json.type == "INFO") {
            $.messager.alert('信息', json.message, 'info');
        }
    },

    _setFieldValue: function (field, value) {
        if (field.attr("class") && field.attr("class").indexOf("easyui-textbox") != -1 || field.attr("class").indexOf("easyui-validatebox") != -1 || field.attr("class").indexOf("easyui-numberbox") != -1) {
            field.textbox("setValue", value.toString());
        } else if (field.attr("class") && field.attr("class").indexOf("easyui-combobox") != -1) {
            field.combobox("setValue", value);
        } else if (field.attr("class") && (field.attr("class").indexOf("easyui-datebox") != -1 || field.attr("class").indexOf("easyui-datetimebox") != -1)) {
            field.datebox("setValue", value);
        }
        else if (field.attr("type") == "checkbox") {
            var on = field.attr("on-value") ? field.attr("on-value") : true;
            var off =  field.attr("off-value") ? field.attr("off-value") : false;
            if (value.toString() == "true" || value == on) {
                field.iCheck('check');
            } else {
                field.iCheck('uncheck');
            }
        } else  if (field.attr("class") == "richeditor") {
             field.html(unescape(value));
             field.val(unescape(value));
             field.cleditor()[0].updateFrame(); 
        } else  if (field.attr("class") == "city-picker") {
             field.val(value);
        } else if (field.attr("type") == "hidden") {
            field.val(value);
        } else if (field.attr("class") == "textarea") {
            field.val(value);
        }
    },

    _getFieldValue: function (field) {
        if (field.attr("class") && field.attr("class").indexOf("easyui-textbox") != -1 || field.attr("class").indexOf("easyui-validatebox") != -1 || field.attr("class").indexOf("easyui-numberbox") != -1) {
            return field.textbox("getValue");
        } else if (field.attr("class") && field.attr("class").indexOf("easyui-combobox") != -1) {
            return field.combobox("getValue");
        } else if (field.attr("class") && (field.attr("class").indexOf("easyui-datebox") != -1 || field.attr("class").indexOf("easyui-datetimebox") != -1)) {
            return field.datebox("getValue");
        }else if (field.attr("type") == "checkbox") {
            var checked = false;
            var on = field.attr("on-value") ? field.attr("on-value") : true;
            var off =  field.attr("off-value") ? field.attr("off-value") : false;
            if (field.parent().attr("class").indexOf("checked") != -1) {
                checked = true;
            }
            return checked ? on : off;
        } else  if (field.attr("class") == "richeditor") {
            field.cleditor()[0].updateTextArea(); 
            return escape(field.val());
        } else  if (field.attr("class") == "city-picker") {
             return field.val();
        } else if (field.attr("type") == "hidden") {
            return field.val();
        } else if (field.attr("class") == "textarea") {
            return field.val();
        }
        return "";
    },

    _disableField: function (field) {
        if (field.attr("class") && field.attr("class").indexOf("easyui-textbox") != -1 || field.attr("class").indexOf("easyui-validatebox") != -1 || field.attr("class").indexOf("easyui-numberbox") != -1) {
            field.textbox({
                disabled: true
            });
        } else if (field.attr("class") && field.attr("class").indexOf("easyui-combobox") != -1) {
            field.combobox("disable");
            /*
            field.combobox({
                disabled: true
            });
            */
        } else if (field.attr("class") && (field.attr("class").indexOf("easyui-datebox") != -1 || field.attr("class").indexOf("easyui-datetimebox") != -1)) {
            field.datebox({
                disabled: true
            });
        } else if (field.attr("type") == "checkbox") {
            field.iCheck('disable');
        } else  if (field.attr("class") == "richeditor") {
            field.cleditor()[0].disable(true);
        } else  if (field.attr("class") == "city-picker") {
             field.attr("disabled", true);
        } else if (field.attr("class") == "textarea") {
            field.attr("disabled", true);
        }
    },

    _enableField: function (field) {
        if (field.attr("class") && field.attr("class").indexOf("easyui-textbox") != -1 || field.attr("class").indexOf("easyui-validatebox") != -1 || field.attr("class").indexOf("easyui-numberbox") != -1) {
            field.textbox({
                disabled: false
            });
        } else if (field.attr("class") && field.attr("class").indexOf("easyui-combobox") != -1) {
             field.combobox("enable");
             /*
             field.combobox({
                disabled: false
            });
            */
        } else if (field.attr("class") && (field.attr("class").indexOf("easyui-datebox") != -1|| field.attr("class").indexOf("easyui-datetimebox")!=-1)) {
            field.datebox({
                disabled: false
            });
        }else if (field.attr("type") == "checkbox") {
            field.iCheck('enable');
        } else  if (field.attr("class") == "richeditor") {
              field.cleditor()[0].disable(false);
        } else  if (field.attr("class") == "city-picker") {
             field.attr("disabled", false);
        }else if (field.attr("class") == "textarea") {
             field.attr("disabled", false);
        }
    },

    ___bindDefaultEvents: function () {
        if (this._bindDefaultEvents) {
            this._bindDefaultEvents();
        }
    },

    _bindEvents: function () {
        return;
    },

    getTask: function () {
        if (!this._task) {
            this._task = ExpressIM.TaskManger.getTask(this._view);
        }
        return this._task;
    },

    getEventDelegate: function () {
        return this.getTask().eventDelegate;
    },

    find: function (idx) {
        var o = this.findWithExp("*[data-index=" + idx + "]");
        if (o.attr("data-index")) {
            return o;
        } else {
            return null;
        }
    },

    findWithExp: function (exp) {
        var task = this.getTask();
        var elements = $('#' + task.taskIdx + " " + exp);
        return elements;
    }

}, ExpressIM.EventDelegate.prototype);

ExpressIM.ReportController = Class.create();
ExpressIM.ReportController.prototype = Class.extend({
    _bindDefaultEvents: function(){
        this._btnCancel = this.find("maint-btn-cancel");
        if (this._btnCancel) {
            this._btnCancel.linkbutton({
                onClick: (function () {
                    this.getTask().terminate();
                }).bind(this)
            });
        }

        this._btnRun = this.find("maint-btn-run");
        if (this._btnRun) {
            this._btnRun.linkbutton({
                onClick: (function () {
                    this._run();
                }).bind(this)
            });
        }
    },

    __getFiltersParameters: function(){
        var fields = this.findWithExp("*[filter-field]");
        var param = "";
        for (var i = 0; i < fields.length; i++) {
            var f = $(fields[i]);
            if (f.attr("filter-field")) {
                var v = this._getFieldValue(f);
                if (v && v != "") {
                    param += "&" + f.attr("filter-field") + "=" + escape(v);
                }
            }
        }
        return param;
    },

    _run: function() {
        var param = this.__getFiltersParameters();
        window.open(ExpressIM.reportserver + "?action=reportservice&report=" + this._report + param);
        /*
         this._msg = new ExpressIM.UIComponent.LoadingMask({});
        this._msg.render();
        $.ajax({
            type: "post",
            url: ExpressIM.frontcontroller + "?action=reportservice&report=" + this._report,
            success: (function (data, textStatus) {
                    this._show(data);
            }).bind(this),
            complete: (function (XMLHttpRequest, textStatus) {
                this._msg.destroy();
                this._msg = null;
            }).bind(this)
        });
        */
    },

    _show: function(reportData){

    }
}, ExpressIM.Controller.prototype);



ExpressIM.MaintenanceController = Class.create();
ExpressIM.MaintenanceController.prototype = Class.extend({

    _clear: function () {
        var fields = this.findWithExp("*[data-field]");
        for (var i = 0; i < fields.length; i++) {
            var f = $(fields[i]);
            if (f.attr("data-field")) {
                this._enableField(f);
                this._setFieldValue(f, "");
            }
        }
    },

    _fillRecord: function (json) {
        this._model = this._createModel();
        this._model.setData(json);
        this._fillForm();
        this.trigger("OnReadComplete", {});
    },

    _getModelDefinition: function () {
        var fields = this.findWithExp("*[data-field]");
        var definition = { id: "id" };
        for (var i = 0; i < fields.length; i++) {
            var dbField = $(fields[i]).attr("data-field");
            var modelProperty = $(fields[i]).attr("data-property");
            definition[modelProperty] = dbField;
        }
        return definition;
    },

    _createModel: function () {
        this._model = new ExpressIM.SimpleModel({
            fields: this._getModelDefinition()
        });
        this._model.set("id", -1);
        return this._model;
    },

    _clearModel: function () {
        this._model = null;
    },

    _fillForm: function () {
        var json = this._model.getData();
        for (var p in json) {
            var v = json[p];
            var f = this.findWithExp("*[data-property=" + p + "]");
            if (f && f.attr("data-property")) {
                this._enableField(f);
                this._setFieldValue(f, v);
            }
        }
    },

    _pullForm: function () {
        var fields = this.findWithExp("*[data-field]");
        for (var i = 0; i < fields.length; i++) {
            var modelProperty = $(fields[i]).attr("data-property");
            this._model.set(modelProperty, this._getFieldValue($(fields[i])));
        }
    },

    _reset: function () {
        this._clearModel();
        this._searchKeyField.textbox("setValue", "");
        this._clear();
        var fields = this.findWithExp("*[data-field]");
        for (var i = 0; i < fields.length; i++) {
            this._disableField($(fields[i]));
        }
        this.trigger("OnReset", {});
    },

    _readRecord: function (key) {
        this._msg = new ExpressIM.UIComponent.LoadingMask({});
        this._msg.render();
        $.ajax({
            type: "post",
            url: this._readModule + "?MODEL_TYPE=" + this._modelType + (this._getReadParameters ? this._getReadParameters() : ""),
            data: {key: key},
            success: (function (data, textStatus) {
                 var json = data.model;
                 if (json.remoteMessage) {
                     this._reset();
                     this._showRemoteMessage(json);
                 } else if (json.id && json.id > 0) {
                    this._fillRecord(json);
                } else {
                    this._notFoundRecord();
                }
            }).bind(this),
            complete: (function (XMLHttpRequest, textStatus) {
                this._msg.destroy();
                this._msg = null;
            }).bind(this)
        });
    },

    _notFoundRecord: function() {
        $.messager.confirm('信息', '没有找到相关记录，是否要创建新纪录?', (function (r) {
                if (r) {
                    this._clear();
                    this._createModel();
                    this.trigger("OnCreateNew", {});
                } else {
                    this._reset();
                }
            }).bind(this), "question");
    },

    __preCheckForm: function() {
           var fields = this.findWithExp("*[data-options*=required\\:true]");
           for (var i = 0; i < fields.length;i++) {
                if (!$(fields[i]).textbox("isValid")) return false;
           }
           if (this._preCheckForm) return this._preCheckForm();
           return true;
    },

    _updateRecord: function () {
        if (!this._model) return;
        if (!this.__preCheckForm()) {
            $.messager.alert('错误', "请填写所有的必要字段，并保证输入的值符合要求", 'error', function(){ });
            return;
        }
        this.trigger("OnPreUpdateRecord", {});
        this._pullForm();
        this._msg = new ExpressIM.UIComponent.LoadingMask({});
        this._msg.render();
        $.ajax({
            type: "post",
            url: this._updateModule + "?MODEL_TYPE=" + this._modelType, //+ "&" + this._model.toUrlParameter(),
            data:this._model.toJSONParameter(),
            success: (function (data, textStatus) {
                this._msg.destroy();
                this._msg = null;
                if (data) {
                    var json = data.model;
                     if (json.remoteMessage) {
                        this._showRemoteMessage(json);
                    } else if (json.id && json.id > 0) {
                        this.trigger("OnPostUpdateRecord", {json:json});
                    }
                }
                this._reset();
            }).bind(this),
            complete: (function (XMLHttpRequest, textStatus) {

            }).bind(this)
        });
    },

    _deleteRecord: function () {
        if (!this._model) return;
        this._pullForm();
        this._msg = new ExpressIM.UIComponent.LoadingMask({});
        this._msg.render();
        $.ajax({
            type: "post",
            url: this._deleteModule + "?MODEL_TYPE=" + this._modelType + "&id=" + this._model.getId(),
            success: (function (data, textStatus) {
                this._msg.destroy();
                this._msg = null;
                this._reset();
                if (data.error && data.error.length > 0) {
                	 $.messager.alert('错误', data.error, 'error');
                }
            }).bind(this),
            complete: (function (XMLHttpRequest, textStatus) {

            }).bind(this)
        });
    },

    _setKeyField: function() {
            for (var i=0;i<this._fields.length;i++) {
                var f = this._fields[i];
                if (f.isKeyField) {
                    this.find(f.dbField).textbox("setValue", this.find("SEARCH_KEY").textbox("getValue"));
                    if (this._lockKeyField) {
                      this.find(f.dbField).textbox({disabled:true});
                    }
                }
            }
    },

    _buildDefaultParameters: function() {
            if (!this._actionModule) {
                this._actionModule = "maintenance";
            }
            if (!this._deleteModule) {
                this._deleteModule = "deleterecord";
            }
            if (!this._readModule) {
                this._readModule = "readrecord";
            }
            if (!this._updateModule) {
                this._updateModule = "updaterecord";
            }
    },

    _bindDefaultEvents: function () {
        this._buildDefaultParameters();
        /*
        * bind buttons events
        */
        this._btnSave = this.find("maint-btn-save");
        if (this._btnSave) {
            this._btnSave.linkbutton({
                onClick: (function () {
                    this._updateRecord();
                }).bind(this)
            });
        }

        this._btnDelete = this.find("maint-btn-delete");
        if (this._btnDelete) {
            this._btnDelete.linkbutton({
                onClick: (function () {
                    $.messager.confirm('信息', '是否要删除该记录?', (function (r) {
                        if (r) {
                            this._deleteRecord();
                            this.trigger("OnDelete", {});
                        }
                    }).bind(this), "question");
                }).bind(this)
            });
        }

        this._btnCancel = this.find("maint-btn-cancel");
        if (this._btnCancel) {
            this._btnCancel.linkbutton({
                onClick: (function () {
                    this.getTask().terminate();
                }).bind(this)
            });
        }
        /*
        * bind search key field events
        */
        this._searchKeyField = this.find("SEARCH_KEY");
        if (this._searchKeyField) {
            this._lookup = new ExpressIM.UIComponent.Lookup({
                searchbox: this._searchKeyField,
                modelType: this._modelType,
                id: this.getTask().taskIdx,
                fields: this._fields
            });

            this._lookup.on("OnLookup", this, (function (ctx) {
                if (ctx.value != "") {
                    this._readRecord(ctx.value);
                } else {
                    this._reset();
                }
            }).bind(this));
        }

        /**
        * bind action events
        **/
        this.on("OnCreateNew", this, (function (ctx) {
            if (this._btnSave) {
                this._btnSave.linkbutton("enable");
                this._setKeyField();
            }
        }));

        /**
        * bind action events
        **/
        this.on("OnReadComplete", this, (function (ctx) {
            if (this._btnDelete) {
                this._btnDelete.linkbutton("enable");
            }
            if (this._btnSave) {
                this._btnSave.linkbutton("enable");
            }
            this._setKeyField();
        }));

        /**
        * bind action events
        **/
        this.on("OnReset", this, (function (ctx) {
            if (this._btnDelete) {
                this._btnDelete.linkbutton("disable");
            }
            if (this._btnSave) {
                this._btnSave.linkbutton("disable");
            }
        }));
    }
}, ExpressIM.Controller.prototype);


/**
 * Static object to manage all tasks (startup, terminate and etc)
 * @author Cheng Li Nov 16, 2014
 **/
ExpressIM.TaskManger = {
    tasks: {},
    taskIndex: 0,
    startup: function (title, view) {
        if (!ExpressIM.TaskManger.tasks[view]) {
            ExpressIM.TaskManger._loadView(title, view);
        }
    },

    _startup: function (title, view, html) {
        ExpressIM.TaskManger.taskIndex++;
        // Create task
        var ed = new ExpressIM.EventDelegate();
        ExpressIM.TaskManger.tasks[view] = {
            view: view,
            eventDelegate: ed,
            taskIdx: 'task_' + ExpressIM.TaskManger.taskIndex,
            terminate: function () {
                ExpressIM.TaskManger.terminate(view);
            }
        };

        $("#taskContainer").append("<div id='task_" + ExpressIM.TaskManger.taskIndex + "' style='visibility:hidden;'>" + html + "</div>");

        var win = $('#task_' + ExpressIM.TaskManger.taskIndex).window({
            modal: false,
            title: title,
            minimizable: false,
            maximizable: false,
            resizable: false,
            shadow: false,
            onClose: function () {
                ExpressIM.TaskManger.terminate(view);
            },
            onOpen: function () {
                ed.trigger("OnWindowReady", {});
            }
        });

        ExpressIM.TaskManger.tasks[view].window = win;

        ed.trigger("OnBeforeParseView", {});

        $.parser.parse($('#task_' + ExpressIM.TaskManger.taskIndex), function () {
             $('#task_' + ExpressIM.TaskManger.taskIndex).css({visibility:'visible'});
            ed.trigger("OnViewParseComplete", {});
        });
    },

    _loadView: function (title, view) {
        ExpressIM.TaskManger._msg = new ExpressIM.UIComponent.LoadingMask({});
        ExpressIM.TaskManger._msg.render();
        $.get(ExpressIM.viewDir + view + ".html", null,
            (function (response) {
                ExpressIM.TaskManger._msg.destroy();
                ExpressIM.TaskManger._startup(title, view, response);
            }).bind(this));
    },

    getTask: function (view) {
        return ExpressIM.TaskManger.tasks[view];
    },

    terminate: function (view) {
        var task = ExpressIM.TaskManger.tasks[view];
        if (task) {
           ExpressIM.TaskManger.tasks[view] = null;
           task.eventDelegate.trigger("OnTerminate",{task: task});
           $("#" + task.taskIdx).window("close");   
            $("#" + task.taskIdx).window("destroy", true);   
            $("#" + task.taskIdx).remove();
        }
    }
};

/**
* Primary menu object for ExpressIM, the menu core is based on apycom menus see http://apycom.com/
* @author Cheng Li Nov 16, 2014
**/
ExpressIM.Menu = Class.create();
ExpressIM.Menu.prototype = {
    initialize: function (options) {
        this._menuType = options.menuType;
        this._json = {};
    },
    
    setMenu: function(json){
    	this._json = json;
    },
    
    render: function (container) {
        this._container = container;
        $.get(ExpressIM.baseURL + "/includes/app/data/"+this._menuType+".js", null,
            (function (response) {
                this._data = eval('(' + response + ')');
                var html = this._render(this._data.items);
                html += ' <script language="javascript" src="includes/' + ExpressIM.menuType + '/menu.js" type="text/javascript"></script>';
                html += '<div id="copyright" style="display:none">Copyright &copy; 2014 <a href="http://apycom.com/">Apycom jQuery Menus</a></div>';
                this._container.html(html);
                this._bindEvents();
            }).bind(this));
    },

    _bindEvents: function () {
        var links = $('a[class*=apy-menu-item]');
        for (var i = 0; i < links.length; i++) {
            var link = $(links[i]);
            link.click((function (evt) {
                var event = evt || window.event;
                var target = event.target || event.srcElement;
                var view = $(target).attr("view-idx");
                var title = $(target).attr("view-title");
                if (view && view.length > 0) {
                    ExpressIM.TaskManger.startup(title, view);
                }
            }).bindAsEventListener(this));
        }
    },

    _render: function (items) {
        var retVal = "";
        for (var i = 0; i < items.length; i++) {
            var html = "";
            var item = items[i];
            if (!item) continue;
            var view = item.view ? item.view : "";
            var hasChild = item.items && item.items.length > 0;
            var cssClass = hasChild ? "parent apy-menu-item" : "apy-menu-item";
            html += '<li><a href="javascript:void(0);" class="' + cssClass + '" view-title="' + item.text + '" view-idx="' + view + '"><span view-title="' + item.text + '" view-idx="' + view + '" style="font-size:14px;font-family: 宋体, microsoft yahei,Helvetica,Arial,宋体,sans-serif;">' + item.text + '</span></a>';

            if (hasChild) {
                html += this._render(item.items);
            }

            html += "</li>";
            retVal += html;
        }
        if (items[0].isRoot) {
            retVal = "<div id='menu'><ul class='menu' style='z-index:9999px;'>" + retVal + "</ul></div>"; ;
        } else {
            retVal = "<div><ul>" + retVal + "</ul></div>";
        }
        return retVal;
    }
};

Number.prototype.formatMoney = function (places, symbol, thousand, decimal) {
    places = !isNaN(places = Math.abs(places)) ? places : 2;
    symbol = symbol !== undefined ? symbol : "￥";
    thousand = thousand || ",";
    decimal = decimal || ".";
    var number = this,
        negative = number < 0 ? "-" : "",
        i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
    return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
};

ExpressIM.UIComponent.DataGridFormater = {};
ExpressIM.UIComponent.DataGridFormater.UserStatus = function(val,row) {
     if(val == "A") return "激活";
     if(val == "W") return "注销";
} ;

ExpressIM.UIComponent.DataGridFormater.UserGroup = function(val,row) {
    if(val == "A") return "管理员";
    if(val == "O") return "操作员";
    if(val == "L") return "审核人";
} ;

ExpressIM.UIComponent.DataGridFormater.Opeartor = function(val,row) {
    return row.operator.name;
} ;

ExpressIM.UIComponent.DataGridFormater.Leader = function(val,row) {
    return row.operator.name + ", " + row.leader.name;
} ;

ExpressIM.UIComponent.DataGridFormater.DateTime = function(val, row) {
	return val.replace("T"," ");
};

ExpressIM.UIComponent.DataGridFormater.stationOwner = function(val, row) {
	return ExpressIM.stationOwner;
};

ExpressIM.UIComponent.DataGridFormater.HistoryAmount = function(val, row) {
	if (row.isAffectation) {
		return "<span style='color:red;font-weight:bold;'>" + "(" + row.adjustAmount.formatMoney() + ")" + "</span>";
	} else {
		return "<span style='color:green;font-weight:bold;'>" + row.amount.formatMoney() + "</span>";
	}
};

var sumCols = ["月出口总流量",
               "月拆分前",
               "车辆免缴率",
               "通行费免征率",
               "合计"
];

function isSumRow(row){
	var val = row.date;
	for (var i=0; i < sumCols.length; i++) {
		if (val.toString().indexOf(sumCols[i])!=-1) {
			return true;
		}
	}
	return false;
}

ExpressIM.UIComponent.DataGridFormater.Count = function(val, row) {
	if (row.date.indexOf("合计") != -1) return row.chargeCount;
	if (isSumRow(row)) return "";
	return val;
};

ExpressIM.UIComponent.DataGridFormater.Money = function(val, row) {
	if (row.date.indexOf("合计") != -1) return row.freeAmount.formatMoney();
	if (isSumRow(row)) return "";
	return val.formatMoney();
};

ExpressIM.UIComponent.DataGridFormater.Money2 = function(val, row) {
	if (row.date.indexOf("合计") != -1) return row.chargeAmount.formatMoney();
	if (isSumRow(row)) return "";
	return val.formatMoney();
};

ExpressIM.UIComponent.DataGridFormater.CommentFull = function(val, row){
	if (row.affectationDesc != 0 && row.isAffectation) {
		var result = "";
		var v = row.affectationDesc;
		v = v.toString();
		switch (v) {
			case "1":
				result = "[假冒原因]:装载货物为《鲜活农产品品种目录表》以外";
				break;
			case "2":
				result = "[假冒原因]:装载绿通货物未占车辆核载质量80%以上";
				break;
			case "3":
				result = "[假冒原因]:装载绿通货物未占车厢容积80%以上";
				break;
			case "4":
				result = "[假冒原因]:混装鲜活农产品、混装范围以外其他农产品超过车辆核定载质量或车厢容积20%以上";
				break;
			case "5":
				result = "[假冒原因]:装载绿通货物总重超过公路承载能力5%";
				break;
			case "6":
				result = "[假冒原因]:装载货物为经过深加工农产品";
				break;
			case "7":
				result = "[假冒原因]:故意混装非鲜活农产品或混装其他货物的运输车辆";
				break;
		} 
		return val + "<br/>" + result;
	} else {
		return val;
		
	}
};

ExpressIM.UIComponent.DataGridFormater.Sum = function(val, row) {
	//if (isSumRow(row)) return "x";
	if (row.date.indexOf("合计") != -1) return row.freeCount;
	if (row.date.indexOf("月出口总流量") != -1) return row.freeCount;//row.chargeAmount.formatMoney();
	if (row.date.indexOf("月拆分前") != -1) return row.freeAmount.formatMoney();//row.chargeAmount.formatMoney();
	if (row.date.indexOf("车辆免缴率") != -1) return  row.freeAmount + "%";//Math.round(row.chargeAmount*100)/100 + "%";
	if (row.date.indexOf("通行费免征率") != -1) return row.freeAmount + "%";//Math.round(row.chargeAmount*100)/100 + "%";
	return val;
};



ExpressIM.UIComponent.DataGridFormater.HistoryForm = function(val, row) {
	function modelToParameter(model) {
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
	var reportName = "rptApproved.html";
	if (row.isAffectation) {
		reportName = "rptRejected.html";
	}
	
	var videoLink = "";
	if (row.video) {
		videoLink = "&nbsp;&nbsp;<a href='" + row.video +"' >下载视频</a>";
	}
	
	if (!row.isAffectation) {
		return  "<a href='" +'modules/reporting/' + reportName + modelToParameter(row) + "' target='_blank'>车辆查验图片资料</a>" + videoLink;
	} else {
		var results = "<a href='" +'modules/reporting/' + reportName + modelToParameter(row) + "' target='_blank'>车辆处理登记表</a>";
		results += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href='" +'modules/reporting/rptRejectedPhoto.html' + modelToParameter(row) + "' target='_blank'>调查照片记录表</a>"
		//return "<a href='" +'modules/reporting/rptRejectedPhoto.html'+ modelToParameter(row) + "' target='_blank'>车辆处理登记表</a>";
		return  results  + videoLink;
	}
	//return "<a href='" +'modules/reporting/' + reportName + modelToParameter(row) + "' target='_blank'>" + text +'</a>';
	//return '<a href="javascript:void(0)" class="history-row" data-index="row_' + row.id + '">' + "详细" +'</a>';
};


Date.prototype.format = function(format)
{
	 var o = {
	 "M+" : this.getMonth()+1, //month
	 "d+" : this.getDate(),    //day
	 "h+" : this.getHours(),   //hour
	 "m+" : this.getMinutes(), //minute
	 "s+" : this.getSeconds(), //second
	 "q+" : Math.floor((this.getMonth()+3)/3),  //quarter
	 "S" : this.getMilliseconds() //millisecond
	 };
	 if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
	 (this.getFullYear()+"").substr(4 - RegExp.$1.length));
	 for(var k in o)if(new RegExp("("+ k +")").test(format))
	 format = format.replace(RegExp.$1,
	 RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
	 return format;
}