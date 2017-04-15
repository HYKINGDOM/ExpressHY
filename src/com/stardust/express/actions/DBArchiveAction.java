package com.stardust.express.actions;

import org.apache.commons.lang3.StringEscapeUtils;

import com.stardust.express.dao.implementations.DatabaseArchiveProxy;


public class DBArchiveAction extends ActionExecutor {
	
	int resultCode = 1;
	
	public int getResultCode(){
		return resultCode;
	}
	/**
	 * 
	 */
	private static final long serialVersionUID = -2671938967053122545L;
	public String archive() {
		String databaseName = StringEscapeUtils.escapeHtml4(context.getString("database"));
		String datasourceName = StringEscapeUtils.escapeHtml4(context.getString("datasource"));
		resultCode = new DatabaseArchiveProxy().archive(databaseName, datasourceName);
		return SUCCESS;
	}
}
