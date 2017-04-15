package com.stardust.express.actions;

import java.io.InputStream;
import java.io.StringBufferInputStream;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import org.apache.commons.lang3.StringEscapeUtils;
import org.apache.struts2.json.annotations.JSON;
import com.opensymphony.xwork2.ActionContext;
import com.stardust.express.dao.abstracts.DataGateFactory;
import com.stardust.express.dao.abstracts.IHistoryRecordGate;
import com.stardust.express.dao.implementations.Selection;
import com.stardust.express.dao.implementations.UserGate;
import com.stardust.express.models.HistoryRecord;
import com.stardust.express.models.User;
import com.stardust.express.reporting.SummaryReport;
import com.stardust.express.tools.IViewContext;
import com.stardust.express.tools.ViewContext;

public class SaveHistoryAction extends ActionExecutor{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = -6708571038507806813L;
	
	private String result = "success";
	
	public String getResult(){
		return result;
	}
	
	public String save() {
		if (!isValidSession()) return ERROR;
		HistoryRecord hr = new HistoryRecord(context);
		hr.setVehicleNumber(context.getString("district")+context.getString("grp")+context.getString("number"));
		hr.setChannelType(hr.getIsAffectation() ? "非国绿" : "国绿" );
		IHistoryRecordGate gate = DataGateFactory.getHistoryRecordGate(context.getString("datasource"));
		gate.update(hr);
		if (hr.getId() <= 0) {
			result = "error";
		}
		return SUCCESS;
    }
}
