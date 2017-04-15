package com.stardust.express.actions;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.StringEscapeUtils;

import com.stardust.express.bo.AdminBOFactory;
import com.stardust.express.bo.IAdminBO;
import com.stardust.express.models.DataModel;

public class LookupAction extends ActionExecutor {

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
	
	public String fetch() {
		if (!isValidSession()) return ERROR;
		IAdminBO bo = AdminBOFactory.create(context);
		int pageSize = context.getInt("rows");
		int start = (context.getInt("page")-1) * pageSize;
		String searchBy = context.getString("searchBy");
		String searchValue = StringEscapeUtils.unescapeHtml4(context.getString("searchValue"));
		String sortBy = context.getString("sortBy");
		rows = bo.filter(searchBy, searchValue, sortBy, pageSize, start);
		total = bo.count(searchBy, searchValue);
		if (rows == null) {
			rows = new ArrayList<DataModel>();
		}
		if (total < 0) {
			total = 0;
		}
		return SUCCESS;
	}
}
