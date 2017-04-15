package com.stardust.express.tools;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import com.opensymphony.xwork2.ActionContext;

public class ViewContext implements IViewContext {
	
	protected ActionContext context;
	
	protected HashMap<String, Object> parameters = new HashMap<String, Object>();
	
	public ViewContext(ActionContext context) {
		this.context = context;
		
		for (String key : context.getParameters().keySet()) {
			Object value = context.getParameters().get(key);
			parameters.put(key, value);
		}
	}
	
	public Map<String, Object> getSession(){
		return this.context.getSession();
	}
	
	public Map<String, Object> getApplication(){
		return this.context.getApplication();
	}
	
	public Integer getInt(String paramName) {
		return getInt(paramName, 0);
	}
	
	public Integer getInt(String paramName, Integer defaultValue) {
		Object value = parameters.get(paramName);
		int results = defaultValue;
		try {
			String [] values =  (String [])value;
			results = Integer.parseInt(values[0]);
		} catch (Exception e){
		} 
		return results;
	}
	
	public String getString(String paramName) {
		return getString(paramName, "");
	}
	
	public String getString(String paramName, String defaultValue) {
		Object value = parameters.get(paramName);
		String results = defaultValue;
		try {
			String [] values =  (String [])value;
			results = values[0];
		} catch (Exception e){
		} 
		return results;
	}
	
	public long getLong(String paramName) {
		return getLong(paramName, 0);
	}
	
	public long getLong(String paramName, long defaultValue) {
		Object value = parameters.get(paramName);
		long results = defaultValue;
		try {
			String [] values =  (String [])value;
			results = Long.parseLong(values[0]);
		} catch (Exception e){
		} 
		return results;
	}
	
	public boolean getBoolean(String paramName) {
		return getBoolean(paramName, false);
	}
	
	public boolean getBoolean(String paramName, boolean defaultValue) {
		Object value = parameters.get(paramName);
		boolean results = defaultValue;
		try {
			String [] values =  (String [])value;
			results = Boolean.parseBoolean(values[0]);
		} catch (Exception e){
		} 
		return results;
	}
	
	public Date getDate(String paramName) {
		return getDate(paramName, null);
	}
	
	public Date getDate(String paramName, Date defaultValue) {
		Object value = parameters.get(paramName);
		Date results = defaultValue;
		try {
			String [] values =  (String [])value;
			results = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(values[0]);
		} catch (Exception e){
		} 
		return results;
	}
	
	public BigDecimal getDecimal(String paramName) {
		return getDecimal(paramName, new BigDecimal(0));
	}
	
	public BigDecimal getDecimal(String paramName, BigDecimal defaultValue) {
		Object value = parameters.get(paramName);
		BigDecimal results = defaultValue;
		try {
			String [] values =  (String [])value;
			results = new BigDecimal(values[0]);
		} catch (Exception e){
		} 
		return results;
	}
	
	public double getDouble(String paramName) {
		return getDouble(paramName, 0);
	}
	
	public double getDouble(String paramName, double defaultValue) {
		Object value = parameters.get(paramName);
		double results = defaultValue;
		try {
			String [] values =  (String [])value;
			results = Double.parseDouble(values[0]);
		} catch (Exception e){
		} 
		return results;
	}
}
