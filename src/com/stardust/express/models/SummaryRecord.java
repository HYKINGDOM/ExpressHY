package com.stardust.express.models;


public class SummaryRecord {
	
	private double freeAmount = 0;
	private double chargeAmount = 0;
	private int freeCount = 0;
	private int chargeCount = 0;
	private String date = "";
	
	
	public SummaryRecord(){
		
	}
	
	public void setDate(String d) {
		this.date = d;
	}
	
	public String getDate(){
		return this.date;
	}
	
	public void setFreeAmount(double amt) {
		freeAmount = amt;
	}
	
	public double getFreeAmount(){
		return freeAmount;
	}
	
	public void setFreeCount(int cnt) {
		freeCount = cnt;
	}
	
	public double getFreeCount(){
		return freeCount;
	}
	
	public void setChargeAmount(double amt) {
		chargeAmount = amt;
	}
	
	public double getChargeAmount(){
		return chargeAmount;
	}
	
	public void setChargeCount(int cnt) {
		chargeCount = cnt;
	}
	
	public double getChargeCount(){
		return chargeCount;
	}
}
