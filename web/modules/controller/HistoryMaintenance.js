ExpressIM.HistoryMaintenanceController = Class.create();
ExpressIM.HistoryMaintenanceController.prototype = Class.extend({
    _initialize: function (options) {
        this._view = "HistoryMaintenance";
        this._modelType = "history";
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
    	this._tollCollectorLookup = new ExpressIM.UIComponent.Lookup({
            searchbox: this.find("tollCollector"),
            modelType: "user",
            id: this.getTask().taskIdx + "_tollCollector",
            fields: this._fields
        });
    	
    	
    	 this.find("isAffectation").combobox({
             onChange: (function (newValue, oldValue) {
                 if (newValue.toString() == "false") {
                	 $('#adjRow').hide();
                	 $('#reasonRow').hide();
                	 $('#freeRow').show();
                	 $('#goodsRow').show();
                	 this._setFieldValue(this.find("adjustAmount"),"0.00");
                	 this._setFieldValue(this.find("affectationDesc"),1);
                	 this._setFieldValue(this.find("merchandiseType"),"");
                 } else {
                	 $('#adjRow').show();
                	 $('#freeRow').hide();
                	 $('#reasonRow').show();
                	 $('#goodsRow').hide();
                	 this._setFieldValue(this.find("merchandiseType"),"");
                	 this._setFieldValue(this.find("amount"),"0.00");
                	 this._setFieldValue(this.find("affectationDesc"),1);
                 }
             }).bind(this)
         });
    	
    	this._tollCollectorLookup.on("OnPreLookup", this, function (ctx) {
    		 ctx.params.tollCollectorOnly = "true";
    	});
    	
    	this._operatorLookup = new ExpressIM.UIComponent.Lookup({
            searchbox: this.find("operatorInfo"),
            modelType: "user",
            id: this.getTask().taskIdx + "_operatorInfo",
            searchIDField: this.find("operatorId"),
            fields: this._fields
        });
    	
    	this._operatorLookup.on("OnPreLookup", this, function (ctx) {
   		 	ctx.params.tollCollectorOnly = "true";
    	});
    	
    	this._leaderLookup = new ExpressIM.UIComponent.Lookup({
            searchbox: this.find("leaderInfo"),
            modelType: "user",
            id: this.getTask().taskIdx + "_leaderInfo",
            searchIDField: this.find("leaderId"),
            fields: this._fields
        });
    	
    	this._leaderLookup.on("OnPreLookup", this, function (ctx) {
   		 	ctx.params.leaderOnly = "true";
    	});
    	
        this.find('fileupload').fileupload({
            dataType: 'text'
        });
    	
        for (var i = 1; i <= 4; i++) {
        	this.find("add_img_" + i).click(
	           (function (event) {
	        	   var target = event.target;
	        	   this.snapshootIdx = $(target).attr("data-index").split("_")[2];
	        	   if (!this.snapshootIdx || this.snapshootIdx < 1) return;
	               var btn = this.find('fileupload')[0];
	               var url = "uploadsnap?imageIdx=" + i;
	               this.find('fileupload').fileupload(
	                        'option',
	                        'url',
	                        url
	                );
	               btn.click();

	           }).bind(this)
	        );
        }
        
        this.find('fileupload').bind('fileuploadstart', (function (event) {
            this._uploadMsg = new ExpressIM.UIComponent.LoadingMask({});
            this._uploadMsg.render();
        }).bind(this)).bind('fileuploaddone', (function (event, data) {
            this._uploadMsg.destroy();
            this._uploadMsg = null;
            data = data.result;
            try {
            	var json = eval("(" + data + ")");
            	if (json.filename.length > 0) {
                    this._setFieldValue(this.find("snapshoot" + this.snapshootIdx), "upload/snapshoot/" + json.filename);
                    this.find("add_img_" + this.snapshootIdx).attr("src", "upload/snapshoot/" + json.filename);
            	} else {
            		$.messager.alert('错误', "上传失败,上传只支持gif,png,bmp,jpg,jpeg等图片格式", 'error', function(){
                        
                    });
            	}
                this.snapshootIdx = 0;
            } catch (e) {
            	this.snapshootIdx = 0;
            	 $.messager.alert('错误', "上传失败,上传只支持gif,png,bmp,jpg,jpeg等图片格式", 'error', function(){
                    
                 });
            }
            
        }).bind(this));
        
        this.find('maint-btn-save').click((function(){
        	this._save();
        }).bind(this));
        
        this.find('maint-btn-cancel').click((function(){
        	this.getTask().terminate();
        }).bind(this));
        
        this._setFieldValue(this.find("isAffectation"), "false");
        this._setFieldValue(this.find("amount"), "0.00");
        this._setFieldValue(this.find("adjustAmount"), "0.00");
        this._setFieldValue(this.find("exitGateway"),"");
    },
    
    _preCheckForm: function() {
        var fields = this.findWithExp("*[data-options*=required\\:true]");
        for (var i = 0; i < fields.length;i++) {
        	 if ($(fields[i]).attr('data-index') == 'merchandiseType' && this._getFieldValue(this.find("isAffectation")) == "true") continue;
             if (this._getFieldValue($(fields[i])) == "") return false;
        }
        return true;
    },
    
    _save: function(){
    	if (this._preCheckForm()) {
    		var fields = this.findWithExp("*[data-property]");
    		var data = {};
    		for (var i = 0; i < fields.length; i++) {
    			var field = $(fields[i]);
    			var property = field.attr('data-property');
    			var value = this._getFieldValue(field);
    			data[property] = value;
    		}
    		
    		this._msg = new ExpressIM.UIComponent.LoadingMask({});
            this._msg.render();
            $.ajax({
                type: "post",
                url: "saveHistory",
                data: data,
                success: (function (data, textStatus) {
                   if (data.result == "success") {
                	   $.messager.alert('信息', "保存成功", 'message', function(){
                           
                       });
                	   this._clearFields();
                   } else {
                	   $.messager.alert('错误', "保存失败", 'error', function(){
                           
                       });
                   }
                }).bind(this),
                complete: (function (XMLHttpRequest, textStatus) {
                	 this._msg.destroy();
                     this._msg = null;
                }).bind(this)
            });
    	} else {
    		$.messager.alert('错误', "请填写所有必须的字段", 'error', function(){
                
            });
    	}
    },
    
    _clearFields: function(){
    	var fields = this.findWithExp("*[data-property]");
		for (var i = 0; i < fields.length; i++) {
			var field = $(fields[i]);
			this._setFieldValue(field, "");
		}
		for (var j=1;j<=4;j++) {
			 this.find("add_img_" + j).attr("src", "resource/images/add_image.png");
		}
		
		this._setFieldValue(this.find("district"),"陕");
		this._setFieldValue(this.find("grp"),"A");
		this._setFieldValue(this.find("vehicleType"),"二轴");
		this._setFieldValue(this.find("channel"),"出口101道");
		this._setFieldValue(this.find("isAffectation"),"false");
		this._setFieldValue(this.find("channel"),"出口101道");
		this._setFieldValue(this.find("adjustAmount"),"0.00");
		this._setFieldValue(this.find("amount"),"0.00");
		this._setFieldValue(this.find("exitGateway"),"");
    }
}, ExpressIM.Controller.prototype);




$(document).ready(function () {
    var controller = new ExpressIM.HistoryMaintenanceController({});
});