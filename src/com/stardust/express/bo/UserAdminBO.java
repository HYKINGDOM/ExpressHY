package com.stardust.express.bo;

import java.util.List;
import java.util.ArrayList;
import com.stardust.express.dao.abstracts.DataGateFactory;
import com.stardust.express.models.DataModel;
import com.stardust.express.models.User;
import com.stardust.express.tools.Cryptor;
import com.stardust.express.tools.IViewContext;
import com.stardust.express.dao.implementations.Selection;


public class UserAdminBO extends AdminBO {

	public UserAdminBO(IViewContext context) {
		super(context);
		gate = DataGateFactory.getUserGate("");
	}

	@Override
	protected DataModel _createModel(IViewContext ctx) {
		return new User(ctx);
	}
	
	@Override
	public int count(String searchBy, String searchValue) {
		List<Selection> selections = new ArrayList<Selection>();
		if (searchBy != null && !searchBy.isEmpty()) {
    		selections.add(new Selection(searchBy, Selection.Operator.LIKE, searchValue));
    	}
		
		if (context.getBoolean("tollCollectorOnly")) {
			if (selections.size() > 0) {
				selections.add(new Selection("type", Selection.Operator.EQUAL, "O", Selection.Operand.AND));
			} else {
				selections.add(new Selection("type", Selection.Operator.EQUAL, "O", Selection.Operand.EMPTY));
			}
		}
		
		if (context.getBoolean("leaderOnly")) {
			if (selections.size() > 0) {
				selections.add(new Selection("type", Selection.Operator.EQUAL, "L", Selection.Operand.AND));
			} else {
				selections.add(new Selection("type", Selection.Operator.EQUAL, "L", Selection.Operand.EMPTY));
			}
		}
		return super.count(selections);
	}
	
	@Override
	public List<DataModel> filter(String searchBy, String searchValue, String sortBy, int pageSize, int page) {
		List<Selection> selections = new ArrayList<Selection>();
		if (searchBy != null && !searchBy.isEmpty()) {
    		selections.add(new Selection(searchBy, Selection.Operator.LIKE, searchValue));
    	}
		
		if (context.getBoolean("tollCollectorOnly")) {
			if (selections.size() > 0) {
				selections.add(new Selection("type", Selection.Operator.EQUAL, "O", Selection.Operand.AND));
			} else {
				selections.add(new Selection("type", Selection.Operator.EQUAL, "O", Selection.Operand.EMPTY));
			}
		}
		
		if (context.getBoolean("leaderOnly")) {
			if (selections.size() > 0) {
				selections.add(new Selection("type", Selection.Operator.EQUAL, "L", Selection.Operand.AND));
			} else {
				selections.add(new Selection("type", Selection.Operator.EQUAL, "L", Selection.Operand.EMPTY));
			}
		}
		
		return super.filter(selections, sortBy, pageSize, page);
	}
	
	@Override
	 protected Boolean _preUpdate(DataModel model)
    {
		User user = (User)model;
		if (user.getPassword().length() <= 16) {
			user.setPassword(Cryptor.GetMD5Code(user.getPassword()));
		}
        return true;
    }
	


}
