package com.stardust.express.actions;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.struts2.ServletActionContext;


import com.stardust.express.bo.HistoryRecordBO;
import com.stardust.express.dao.implementations.Selection;
import com.stardust.express.dao.implementations.Selection.Operand;
import com.stardust.express.dao.implementations.Selection.Operator;
import com.stardust.express.models.DataModel;

public class HistoryAction extends ActionExecutor {

	/**
	 * 
	 */
	private static final long serialVersionUID = -5054795442024297138L;
	
	private List<DataModel> rows;
	
	private int total = 0;
	
	public List<DataModel> getRows() {
		return this.rows;
	}
	
	public int getTotal(){
		return total;
	}
	
	public String clean(){
		if (!isValidSession()) return ERROR;
		HistoryRecordBO bo = new HistoryRecordBO(context);
		String endDate = context.getString("endDate", null);
		String realpath = ServletActionContext.getServletContext().getRealPath("/upload/");
		bo.cleanUp(endDate, realpath);
		return SUCCESS;
	}
	
	public String fetch() {
		if (!isValidSession()) return ERROR;
		HistoryRecordBO bo = new HistoryRecordBO(context);
		int pageSize = context.getInt("rows");
		int start = (context.getInt("page")-1) * pageSize;
		String sortBy = context.getString("sortBy");
		String startDate = context.getString("startDate", null);
		String endDate = context.getString("endDate", null);
		String vehicleNumber = context.getString("vehicleNumber");
		String vehicleType = context.getString("vehicleType");
		String channel = context.getString("channel");
		String channelType = context.getString("channelType");
		String isAffectation = context.getString("isAffectation", null);
		
		List<Selection> selections = new ArrayList<Selection>();
		if (startDate != null && !startDate.isEmpty()) {
			selections.add(new Selection("date", Operator.GEATER_EQUAL, startDate, "startdate"));
		}
		
		if (endDate != null && !endDate.isEmpty()) {
			if (selections.size() > 0) {
				selections.add(new Selection("date", Operator.LESS_EQUAL, endDate, Operand.AND));
			} else {
				selections.add(new Selection("date", Operator.LESS_EQUAL, endDate));
			}	
		}
		
		if (vehicleNumber != null && !vehicleNumber.isEmpty()) {
			if (selections.size() > 0) {
				selections.add(new Selection("vehicleNumber", Operator.EQUAL, vehicleNumber, Operand.AND));
			} else {
				selections.add(new Selection("vehicleNumber", Operator.EQUAL, vehicleNumber));
			}	
		}
		
		if (vehicleType != null && !vehicleType.isEmpty()) {
			if (selections.size() > 0) {
				selections.add(new Selection("vehicleType", Operator.EQUAL, vehicleType, Operand.AND));
			} else {
				selections.add(new Selection("vehicleType", Operator.EQUAL, vehicleType));
			}	
		}
		
		if (channel != null && !channel.isEmpty()) {
			if (selections.size() > 0) {
				selections.add(new Selection("channel", Operator.EQUAL, channel, Operand.AND));
			} else {
				selections.add(new Selection("channel", Operator.EQUAL, channel));
			}	
		}
		
		if (channelType != null && !channelType.isEmpty()) {
			if (selections.size() > 0) {
				selections.add(new Selection("channelType", Operator.EQUAL, channelType, Operand.AND));
			} else {
				selections.add(new Selection("channelType", Operator.EQUAL, channelType));
			}	
		}
		
		if (isAffectation != null && !isAffectation.isEmpty()) {
			boolean isAff = (isAffectation.equalsIgnoreCase("Y") ? true : false);
			if (selections.size() > 0) {
				selections.add(new Selection("isAffectation", Operator.EQUAL, isAff, Operand.AND));
			} else {
				selections.add(new Selection("isAffectation", Operator.EQUAL, isAff));
			}	
		}
		
		rows = bo.filter(selections, sortBy, pageSize, start);
		total = bo.count(selections);
		if (rows == null) {
			rows = new ArrayList<DataModel>();
		}
		if (total < 0) {
			total = 0;
		}
		return SUCCESS;
	}
}
