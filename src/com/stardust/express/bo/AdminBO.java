package com.stardust.express.bo;

import java.util.ArrayList;
import java.util.List;

import com.stardust.express.dao.abstracts.IDataGate;
import com.stardust.express.dao.implementations.Selection;
import com.stardust.express.models.DataModel;
import com.stardust.express.models.User;
import com.stardust.express.tools.IViewContext;

abstract public class AdminBO extends BusinessObject implements IAdminBO{

	public AdminBO(IViewContext context) {
		super(context);
	}
	
	protected IDataGate gate;
    public static int ERROR_CANNT_NOT_DELETED = -2;
    public static int ERROR_NORMAL = -1;
    protected User user;

    protected Boolean _preUpdate(DataModel model)
    {
        return true;
    }

    protected long _update(DataModel model)
    {
        try
        {
            return gate.update(model);
        }
        catch(Exception e)
        {
            return AdminBO.ERROR_NORMAL;
        }
    }

    protected Boolean _preRemove(DataModel model)
    {
        return true;
    }

    protected long _remove(DataModel model)
    {
        try
        {
           return gate.remove(model);
        } catch (Exception e){
           return  AdminBO.ERROR_CANNT_NOT_DELETED;
        } 
    }

    protected Boolean _postGet(DataModel model)
    {
        return true;
    }

    protected DataModel _get(long id) {
        try
        {
            return gate.find(id);
        }
        catch (Exception e)
        {
            return null;
        }
    }

    protected DataModel _get(String key)
    {
        try
        {
            return gate.find(key);
        }
        catch (Exception e)
        {
            return null;
        }
    }

    public DataModel update(DataModel model)
    {
        if (_preUpdate(model))
        {
            _update(model);
            _postUpdate(model);
            return model;
        }
        return _createModel(context);
    }

    protected void _postUpdate(DataModel model)
    {

    }

    public DataModel update()
    {
        DataModel model = _createModel(context);
        update(model);
        return model;
    }

    public long remove()
    {
        DataModel model = _createModel(context);
        model.setId(context.getLong("id"));
        return remove(model);
    }

    public long remove(DataModel model)
    {
        if (_preRemove(model))
        {
            return _remove(model);
        }
        return -1;
    }

    public DataModel get(long id)
    {
        DataModel retVal = _get(id);
        if (retVal != null)
        {
            if (_postGet(retVal))
            {
                return retVal;
            }
        }
        return null;
    }

    public DataModel get(String key)
    {
        DataModel retVal = _get(key);
        if (retVal != null)
        {
            if (_postGet(retVal))
            {
                return retVal;
            }
        }
        return _createModel(context);
    }

    public List<DataModel> filter(List<Selection> selections, String sortBy, int pageSize, int page)
    {
        return gate.find(page, pageSize, selections, sortBy);
    }
    
    public List<DataModel> filter(String searchBy, String searchValue, String sortBy, int pageSize, int page)
    {
    	List<Selection> selections = new ArrayList<Selection>();
    	if (searchBy != null && !searchBy.isEmpty()) {
    		selections.add(new Selection(searchBy, Selection.Operator.LIKE, searchValue));
    	}
        return gate.find(page, pageSize, selections, sortBy);
    }

    public List<DataModel> filter(List<String> properties, List<Object> values, String sortBy, int pageSize, int page)
    {
    	if (properties.size() != values.size()) return new ArrayList<DataModel>();
    	List<Selection> selections = new ArrayList<Selection>();
    	for (int i=0; i < properties.size(); i++) {	
    		String property = properties.get(i);
    		if (property == null || property.isEmpty()) continue;
    		Object value = values.get(i);
    		selections.add(new Selection(property, Selection.Operator.EQUAL, value));
    	}
        return gate.find(page, pageSize, selections, sortBy);
    }

    protected Boolean _preFilter(List<String> colums, List<Object> values, String sortBy, int pageSize, int page)
    {
        return true;
    }

    protected Boolean _preFilter(List<DataModel> models)
    {
        return true;
    }

    public int count(String searchBy, String searchValue) {
    	List<Selection> selections = new ArrayList<Selection>();
    	if (searchBy != null && !searchBy.isEmpty()) {
    		selections.add(new Selection(searchBy, Selection.Operator.LIKE, searchValue));
    	}
    	return gate.count(selections);
    }
    
    public int count(List<Selection> selections) {
    	return gate.count(selections);
    }
    
    protected abstract DataModel _createModel(IViewContext ctx);
}
