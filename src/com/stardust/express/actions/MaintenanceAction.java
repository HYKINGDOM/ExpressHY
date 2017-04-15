package com.stardust.express.actions;


import org.apache.commons.lang3.StringEscapeUtils;

import com.stardust.express.bo.AdminBOFactory;
import com.stardust.express.bo.IAdminBO;
import com.stardust.express.models.DataModel;


public class MaintenanceAction extends  ActionExecutor {
	private static final long serialVersionUID = -2191774577797836729L;
	private DataModel model;
	private String error = "";
	
	public DataModel getModel() {
		return model;
	}
	
	public String getError() {
		return error;
	}
	
	public String read() {
		if (!isValidSession()) return ERROR;
		IAdminBO bo = AdminBOFactory.create(context);
		String key = StringEscapeUtils.unescapeHtml4(context.getString("key"));
		model = bo.get(key); 
		return SUCCESS;
	}
	
	public String delete() {
		if (!isValidSession()) return ERROR;
		IAdminBO bo = AdminBOFactory.create(context);
		long error = bo.remove();
		if (error == 547) {
			this.error = "由于该记录在其他地方使用，无法进行删除，请将状态改为'注销'";
		}
		return SUCCESS;
	}
	
	public String update() {
		if (!isValidSession()) return ERROR;
		IAdminBO bo = AdminBOFactory.create(context);
		model = bo.update();
		return SUCCESS;
	}
}
