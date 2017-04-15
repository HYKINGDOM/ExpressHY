package com.stardust.express.models;

import com.stardust.express.tools.IViewContext;

public class User extends DataModel {

	public final static String USER_TYPE_ADMIN = "A";
	public final static String USER_TYPE_OPERATOR = "O";
	public final static String USER_TYPE_LEADER = "L";
	
	protected String username = "";
	protected String name = "";
	protected String password = "";
	protected String email = "";
	protected long roleId;
	protected String type = USER_TYPE_ADMIN;
	protected String status = DataModel.STATUS_ACTIVE;
	
	public User(){
		
	}
	
	public void setStatus(String status) {
		this.status = status;
	}
	
	public String getStatus() {
		return this.status;
	}
	
	public User(IViewContext ctx) {
		id = ctx.getLong("id");
		username = ctx.getString("username");
		name = ctx.getString("name");
		status = ctx.getString("status");
		password = ctx.getString("password");
		email = ctx.getString("email");
		roleId = ctx.getLong("roleId");
		type = ctx.getString("type");
	}
	
	public String getType(){
		return type;
	}
	
	public void setType(String t){
		type = t;
	}
	
	public String getName() {
		return this.name;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	
	public String getUsername() {
		return this.username;
	}
	
	public void setUsername(String username) {
		this.username = username;
	}
	
	public String getPassword() {
		return this.password;
	}
	
	public void setPassword(String password) {
		this.password = password;
	}
	
	public long getRoleId() {
		return this.roleId;
	}
	
	public void setRoleId(long roleId) {
		this.roleId = roleId;
	}
	
	public String getEmail(){
		return this.email;
	}
	
	public void setEmail(String email){
		this.email = email;
	}
}
