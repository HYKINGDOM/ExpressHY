package com.stardust.express.models;

import java.io.Serializable;

public class DataModel implements Serializable{
	
	final public static String STATUS_ACTIVE = "A";
	final public static String STATUS_WITHDRAW = "W";
	
	protected long id = -1;
	
	public long getId() {
		return id;
	}
	
	public void setId(long id) {
		this.id = id;
	}
	

}
