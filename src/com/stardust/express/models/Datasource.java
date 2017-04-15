package com.stardust.express.models;

public class Datasource extends DataModel {
	private String datasourceName = "";
	private String databaseName = "";
	
	public void setDatasourceName(String name) {
		datasourceName = name;
	}
	
	public String getDatasourceName() {
		return datasourceName;
	}
	
	public void setDatabaseName(String name) {
		databaseName = name;
	}
	
	public String getDatabaseName() {
		return databaseName;
	}
}
