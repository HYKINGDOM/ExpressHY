package com.stardust.express.reporting;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.stardust.express.dao.implementations.DataGate;
import com.stardust.express.dao.implementations.Selection;
import com.stardust.express.models.SummaryRecord;

public class SummaryReport {
	
	protected String getPureConnectionString() {
		String url = DataGate.connectionString;
		url = url.replace(url.substring(url.indexOf(";databaseName=")), "");
		return url;
	}
	
	protected String getPureDatabaseName() {
		String url = DataGate.connectionString;
		url = url.substring(url.indexOf(";databaseName="));
		url = url.replace(";databaseName=", "");
		return url;
	}
	
	protected String getWhereClause(List<Selection> selections) {
		String where = "";
		for (Selection s : selections) {
			where += s.getOperand().getOperand() + s.getProperty() + s.getOperator().getOperator() + "? ";
		}
		if (where.length() > 0) where = " where " + where;
		return where;
	}
	
	protected void setParameters(List<Selection> selections, PreparedStatement pstmt)  {
		int i=1;
		for (Selection s : selections) {
			java.sql.Date d = new java.sql.Date(((Date)s.getValue()).getTime());
			try {
				pstmt.setDate(i, d);
			} catch (Exception e) {
				e.printStackTrace();
			}
			i++;
		}
	}
	
	protected String getTimeExpress(String summaryBy){
		if (summaryBy.equalsIgnoreCase("year")) {
			return "YEAR";
		} else if(summaryBy.equalsIgnoreCase("month")){
			return "YEAR+'-'+MONTH";
		} else {
			return "YEAR+'-'+MONTH+'-'+DAY";
		}
	}
	
	public List<SummaryRecord> run(String summaryBy, List<Selection> selections) {
		Connection conn = null;
		List<SummaryRecord> records = new ArrayList<SummaryRecord>();
		try {
		    conn = DriverManager.getConnection(getPureConnectionString() + ";user=" + DataGate.username + ";password=" + DataGate.password); 
			String sql = "SELECT COUNT(id) as cnt,SUM(AMOUNT) as free,SUM(ADJUST_AMOUNT) as charge,(" + getTimeExpress(summaryBy) + ") as dt, IS_AFFECTATION  FROM " + this.getPureDatabaseName() +".dbo.EXPRESSWAY_GATEWAY_HISTORY " + this.getWhereClause(selections) + "GROUP BY " + getTimeExpress(summaryBy) + ",IS_AFFECTATION ORDER BY " + getTimeExpress(summaryBy);
		    PreparedStatement pstmt = conn.prepareStatement(sql);
			setParameters(selections,pstmt);
			ResultSet rs = pstmt.executeQuery();
			
			while (rs.next()) {
				int count = rs.getInt("cnt");
				double free = rs.getDouble("free");
				double charge = rs.getDouble("charge");
				String dt = rs.getString("dt");
				if (dt.isEmpty()) continue;
				boolean isAffectation = rs.getBoolean("IS_AFFECTATION");
				SummaryRecord sr = null;
				if (records.size() > 0 && records.get(records.size() - 1).getDate().equals(dt)) {
				    sr = records.get(records.size() - 1);
				} else {
				   sr = new SummaryRecord();
				   sr.setDate(dt);
				   records.add(sr);
				}
				if (isAffectation) {
					sr.setChargeAmount(charge);
					sr.setChargeCount(count);
				} else {
					sr.setFreeAmount(free);
					sr.setFreeCount(count);
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				if (conn!=null) conn.close();
			} catch (Exception e) {
				e.printStackTrace();
			} 
		}
		return records;
	}
}
