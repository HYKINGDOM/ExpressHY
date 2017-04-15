package com.stardust.express.actions;

import com.opensymphony.xwork2.ActionContext;
import com.opensymphony.xwork2.ActionSupport;
import com.stardust.express.models.User;
import com.stardust.express.tools.Cryptor;
import com.stardust.express.tools.IViewContext;
import com.stardust.express.tools.ViewContext;

public class ActionExecutor extends ActionSupport{

	/**
	 * 
	 */
	private static final long serialVersionUID = 2035562312657833982L;

	protected IViewContext context = new ViewContext(ActionContext.getContext());
	protected ActionContext actionContext = ActionContext.getContext();
	
	protected boolean isValidSession(){
		if (context.getSession().get("logon_user") != null) {
			User u = (User)context.getSession().get("logon_user");
			String token = context.getSession().get("credential_validate_session").toString();
			if (token.endsWith(Cryptor.GetMD5Code(u.getUsername()) + Cryptor.GetMD5Code("_bkb_dklaks_0902020202_"))) {
				return true;
			}
		}
		return false;
	}
}
