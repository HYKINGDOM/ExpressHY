package com.stardust.express.dao.implementations;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import com.stardust.express.models.Datasource;

public class DatabaseArchiveProxy {
	public int archive(String database, String datasouceName) {
		int result = 1;
		if (!createDatabase(database)) {
			result = -1;
		}
	    if (result > 0 && !importData(getPureDatabaseName(), database)){
	    	result = -2;
	    } 
	    if (result > 0) {
	    	if (!addDatasource(datasouceName, database)) {
	    		result = -3;
	    	}
	    }
	    return result;
	}
	
	protected boolean createDatabase(String database){
		Connection conn = null;
		try {
		    conn = DriverManager.getConnection(getPureConnectionString() + ";user=" + DataGate.username + ";password=" + DataGate.password); 
			Statement s = conn.createStatement();
			conn.setAutoCommit(false);
			try {
				 s.executeUpdate("DROP DATABASE " + database);
			} catch (Exception e) {
				//do nothing if has not table exits
			}
			s.executeUpdate("CREATE DATABASE " + database);
			conn.commit();
			return true;
		} catch (Exception e) {
			try {
				conn.rollback();
			} catch (SQLException se) {
				se.printStackTrace();
			}
			e.printStackTrace();
		} finally {
			try {
				if (conn!=null) conn.close();
			} catch (Exception e) {
				e.printStackTrace();
			} 
		}
		return false;
	}
	
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
	
	protected boolean addDatasource(String datasource, String database) {
		Connection conn = null;
		try {
		    conn = DriverManager.getConnection(getPureConnectionString() + ";user=" + DataGate.username + ";password=" + DataGate.password); 
		    conn.setAutoCommit(false);
		    Statement s = conn.createStatement();
		    s.executeUpdate("INSERT INTO " + getPureDatabaseName() + ".dbo." + "EXPRESSWAY_DATASOURCE (SOURCE_NAME, DATABASE_NAME) VALUES ('" + datasource + "','" + database + "')" );
			Datasource ds = new Datasource();
			ds.setDatabaseName(database);
			ds.setDatasourceName(datasource);
			DataGate.addDatasource(ds);
		    conn.commit();
		    return true;
		} catch (Exception e) {
			try {
				conn.rollback();
			} catch (SQLException se) {
				se.printStackTrace();
			}
			e.printStackTrace();
			return false;
		} finally {
			try {
				if (conn!=null) conn.close();
			} catch (Exception e) {
				e.printStackTrace();
			} 
		}

	}
	
	protected boolean importData(String fromDB, String toDB){
		List<String> tableList = getImportTableOrderedList();
		
		Connection conn = null;
		try {
		    conn = DriverManager.getConnection(getPureConnectionString() + ";user=" + DataGate.username + ";password=" + DataGate.password); 
		    conn.setAutoCommit(false);
		    Statement s = conn.createStatement();
		    for (String table : tableList) {
		    	s.execute("SELECT * into " + toDB + ".dbo." + table + " FROM " + fromDB +".dbo." + table);
		    }
		    conn.commit();
		    return true;
		} catch (Exception e) {
			try {
				conn.rollback();
			} catch (SQLException se) {
				se.printStackTrace();
			}
			e.printStackTrace();
			return false;
		} finally {
			try {
				if (conn!=null) conn.close();
			} catch (Exception e) {
				e.printStackTrace();
			} 
		}
	}
	
	protected List<String> getImportTableOrderedList(){
		// Create a list with dependency orders
		List<String> list = new ArrayList<String>();
		list.add("EXPRESSWAY_USER_ROLE");
		list.add("EXPRESSWAY_USER");
		//list.add("EXPRESSWAY_MERCHANDISE_CATEGORY");
		//list.add("EXPRESSWAY_VEHICLE_CATEGORY");
		return list;
	}
}
