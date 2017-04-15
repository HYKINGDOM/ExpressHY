package com.stardust.express.tools;

import java.math.BigDecimal;
import java.util.Date;
import java.util.Map;

public interface IViewContext {
	public Map<String, Object> getSession();
	
	public Map<String, Object> getApplication();
	
	public Integer getInt(String paramName);
	
	public Integer getInt(String paramName, Integer defaultValue);
	
	public String getString(String paramName);
	
	public String getString(String paramName, String defaultValue);
	
	public long getLong(String paramName);
	
	public long getLong(String paramName, long defaultValue);
	
	public boolean getBoolean(String paramName);
	
	public boolean getBoolean(String paramName, boolean defaultValue);
	
	public Date getDate(String paramName);
	
	public Date getDate(String paramName, Date defaultValue);
	
	public BigDecimal getDecimal(String paramName);
	
	public BigDecimal getDecimal(String paramName, BigDecimal defaultValue);
	
	public double getDouble(String paramName);
	
	public double getDouble(String paramName, double defaultValue);
}
