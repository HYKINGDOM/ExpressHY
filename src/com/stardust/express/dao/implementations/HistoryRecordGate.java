package com.stardust.express.dao.implementations;


import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import org.hibernate.Query;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.Transaction;

import com.stardust.express.dao.abstracts.IHistoryRecordGate;
import com.stardust.express.models.DataModel;
import com.stardust.express.models.HistoryRecord;

public class HistoryRecordGate extends DataGate implements IHistoryRecordGate {

	public HistoryRecordGate(){
		super();
		keyProperty = "";
	}
	
	public HistoryRecordGate(String datasource) {
		super(datasource);
		keyProperty = "";
	}
	
	@Override
	protected Class<?> getModelClass() {
		return HistoryRecord.class;
	}

	@Override
	protected String getModelName() {
		return "HistoryRecord";
	}

	@Override
	public long update(DataModel model) {
		HistoryRecord hr = (HistoryRecord) model;
		Date date = hr.getDate();
		Calendar cal = Calendar.getInstance();
		cal.setTime(date);
		int year = cal.get(Calendar.YEAR);
		int month = cal.get(Calendar.MONTH) + 1;
		int day = cal.get(Calendar.DATE);
		hr.setYear(year+"");
		hr.setMonth(month+"");
		hr.setDay(day+"");
		return super.update(model);
	}
	
	public void cleanUp(String endDate) {
		Session session = null;
		Transaction tst = null;
    	try{
    		session = getSession();
    		tst = session.beginTransaction();
    		String hql = "delete from EXPRESSWAY_GATEWAY_HISTORY where REOCRD_DATE <='" + endDate + "'";
            SQLQuery query = session.createSQLQuery(hql);
            query.executeUpdate();
            tst.commit();	
		   
		}catch (Exception e) {  
	        e.printStackTrace();  
	        if (tst != null) {
	        	tst.rollback();
	        }
	    } finally{
	    	if (session != null) {
	    		session.close();  
	    	}
		}
	}
}
