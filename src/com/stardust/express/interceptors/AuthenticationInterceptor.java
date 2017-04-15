package com.stardust.express.interceptors;

import java.util.Map;

import com.opensymphony.xwork2.ActionInvocation;
import com.opensymphony.xwork2.interceptor.Interceptor;
import com.stardust.express.models.User;

public class AuthenticationInterceptor implements Interceptor {  

	private static final long serialVersionUID = 8149085439273994455L;

	@Override
	public void destroy() {
		
	}
	
	@Override
	public void init() {
		
	}
	
	@Override
	public String intercept(ActionInvocation actionInvocation) throws Exception {
		Map<String, Object> session = actionInvocation.getInvocationContext().getSession();  
		User user = (User)session.get("logon_user");  
	    if (user == null) {
	      return "invalid_session";
	    } else {  
	      return actionInvocation.invoke();  
	    }  
	}  
}  