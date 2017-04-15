package com.stardust.express.bo;

import java.util.ArrayList;
import java.util.List;

import com.stardust.express.dao.abstracts.DataGateFactory;
import com.stardust.express.dao.abstracts.IUserGate;
import com.stardust.express.dao.implementations.Selection;
import com.stardust.express.models.DataModel;
import com.stardust.express.models.User;
import com.stardust.express.tools.Cryptor;
import com.stardust.express.tools.IViewContext;

public class SecurityBO extends BusinessObject{
	
	private IUserGate userGate;
	
	public SecurityBO(final IViewContext context) {
		super(context);
		userGate = DataGateFactory.getUserGate(null);
	}
	
	public User verifyUser(String username, String password) {
		List<Selection> selections = new ArrayList<Selection>();
		selections.add(new Selection("username", Selection.Operator.EQUAL, username, Selection.Operand.EMPTY));
		List<DataModel> users = userGate.find(selections,"id");
		// See if there is available user exits
		if (users !=null && users.size() > 0) {
			User user = (User)users.get(0);
			// Verify password
			if (user.getId() > 0 && user.getUsername().equals(username) && user.getPassword().equals(Cryptor.GetMD5Code(password))) {
				return user;
			} else {
				return null;
			}
		} 
		return null;
	}
}
