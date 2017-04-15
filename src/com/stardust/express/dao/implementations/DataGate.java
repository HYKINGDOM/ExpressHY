package com.stardust.express.dao.implementations;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.cfg.Configuration;
import org.hibernate.criterion.Restrictions;
import org.hibernate.service.ServiceRegistry;
import org.hibernate.service.ServiceRegistryBuilder;

import com.microsoft.sqlserver.jdbc.SQLServerException;
import com.stardust.express.dao.abstracts.IDataGate;
import com.stardust.express.models.DataModel;
import com.stardust.express.models.Datasource;


public abstract class DataGate implements IDataGate{
	protected static SessionFactory sessionFactory;  
	protected String datasource = "";
	protected static HashMap<String, SessionFactory> connections = new HashMap<String, SessionFactory>();
	protected String keyProperty = "";
	public static String connectionString;
	public static String username;
	public static String password;
	protected static Configuration config;
	
    static{  
        try{  
            Configuration conf = new Configuration(); 
            config = conf;
            conf.configure();  
            ServiceRegistry sr = new ServiceRegistryBuilder()  
                                    .applySettings(conf.getProperties())  
                                    .buildServiceRegistry();  
            
            sessionFactory = conf.buildSessionFactory(sr); 
            connectionString = conf.getProperty("hibernate.connection.url");
            username = conf.getProperty("hibernate.connection.username");
            password = conf.getProperty("hibernate.connection.password");
            initializeConnections(conf);
        } catch (Exception e) {  
            e.printStackTrace();  
        }  
    }  
    
    public static void addDatasource(Datasource ds) {
    	addDatasource(ds, config);
    }
    
    public static void addDatasource(Datasource ds, Configuration config) {
    	// Modify configuration
    	String url = config.getProperty("hibernate.connection.url");
    	String newUrl = url.replace(url.substring(url.indexOf(";databaseName=")),";databaseName=" + ds.getDatabaseName());
    	config.setProperty("hibernate.connection.url", newUrl);
    	
    	ServiceRegistry sr = new ServiceRegistryBuilder()  
        .applySettings(config.getProperties())  
        .buildServiceRegistry();
    	
    	// Create session factory
    	SessionFactory factory = config.buildSessionFactory(sr);
    	
    	// Push factory to map
    	connections.put(ds.getDatasourceName(), factory);
    	
    	// Restore configuration
    	config.setProperty("hibernate.connection.url", url);
    }
    
    public static void reload(){
    	for (String key : connections.keySet()) {
    		SessionFactory sf = connections.get(key);
    		try {
    			sf.close();
    		} catch (Exception e) {
    			continue;
    		}
    	}
    	connections.clear();
    	initializeConnections(config);
    }
    
	protected static void initializeConnections(Configuration conf){
		Session session = sessionFactory.openSession(); 
		try{  
    		String hql="from Datasource";
    		Query query=session.createQuery(hql);
    		
            @SuppressWarnings("unchecked")
			List<Datasource> datasources = query.list();
            for (Datasource datasource : datasources)  { 
            	if (connections.containsKey(datasource.getDatasourceName())) continue;
            	addDatasource(datasource, conf);
            }
        } catch (Exception e) {  
        	e.printStackTrace();  
        } finally {  
            session.close();  
        }  
	}
    
	protected void setQueryParameters(List<Selection> selections, Query query) {
		if (selections == null || selections.isEmpty()) return ;
		for (Selection selection : selections) {
			if (selection.getProperty().isEmpty() || selection.getProperty() == null) continue;
			Object value = selection.getValue();
			if (value instanceof String) {
				if (selection.getOperator().equals(Selection.Operator.LIKE)) {
					query.setString(selection.getParameterName(), ((String) value) + "%%");
				} else {
					query.setString(selection.getParameterName(), (String) value);
				}
			}
			if (value instanceof Integer) {
				query.setInteger(selection.getParameterName(), (Integer) value);
			}
			if (value instanceof BigDecimal) {
				query.setBigDecimal(selection.getParameterName(), (BigDecimal) value);
			}
			if (value instanceof Date) {
				query.setDate(selection.getParameterName(), (Date) value);
			}
			if (value instanceof Double) {
				query.setDouble(selection.getParameterName(), (Double) value);
			}
			if (value instanceof Boolean) {
				query.setBoolean(selection.getParameterName(), (Boolean) value);
			}
		}
	}
	
	protected String buildWhereClause(List<Selection> selections) {
		String where = "";
		if (selections == null || selections.isEmpty()) return "";
		for (Selection selection : selections) {
			if (selection.getProperty().isEmpty() || selection.getProperty() == null) continue;
			if (!where.isEmpty()) {
				where += " " + selection.getOperand().getOperand();
			}
			where += " " + selection.getProperty() + "" + selection.getOperator().getOperator() +":" + selection.getParameterName();
		}
		if (!where.isEmpty()) {
			where = " where " + where;
 		}
		
		
		return where;
	}
	
    protected Session getSession() {
    	if (datasource == null || datasource.isEmpty()) {
    		return sessionFactory.openSession();
    	} else {
    		SessionFactory factory = connections.get(datasource);
    		if (factory == null) {
    			return null; 
    		} else {
    			return factory.openSession();
    		}
    	}
    }
    
    public DataGate(){
    	datasource = "";
    }
    
    public DataGate(String datasource) {
    	this.datasource = datasource;
    }
    
    public void setDatasource(String datasource) {
    	this.datasource = datasource;
    }
    
    public String getDatasource() {
    	return datasource;
    }
    
    public List<DataModel> fetchAll(){
    	return find(-1, -1, "id");
    }
    
    public List<DataModel> find(int start, int size, List<Selection> selections, String sortBy) {
    	Session session = getSession();
    	String orderByClause = "";
    	if (sortBy != null && !sortBy.isEmpty()) {
    		if (sortBy.startsWith(":")) {
    			orderByClause = " order by " + sortBy.replace(":", "") + " desc ";
    		} else {
    			orderByClause = " order by " + sortBy;
    		}
    	}
    	try{
		   String hql = "from " + this.getModelName() + buildWhereClause(selections) + orderByClause;
		   Query query = session.createQuery(hql);
		   if (start >= 0 && size > 0) { 
			   query.setFirstResult(start);
			   query.setMaxResults(size);
		   }
		   setQueryParameters(selections, query);
		   
		   @SuppressWarnings("unchecked")
		   List<DataModel> list=query.list();
		   if (list != null && list.size() > 0) {
           		return list;
           } else {
        	    return new ArrayList<DataModel>();
           }
		}catch (Exception e) {  
	        e.printStackTrace();  
	    } finally{
		    session.close();  
		}
	    return new ArrayList<DataModel>();
    }
    
    public List<DataModel> find(int start, int size, String sortBy) {
    	return find(start, size ,null, null);
    }
    
    public List<DataModel> find(List<Selection> selections, String sortBy) {
    	return find(-1, -1, selections, sortBy);
    }
    
    public DataModel find(String key) {
    	if (!this.keyProperty.isEmpty()) {
    		Session session = getSession(); 
        	
        	try{  
        		Criteria c = session.createCriteria(this.getModelClass());
        		c.add(Restrictions.eq(this.keyProperty,key));
                
                @SuppressWarnings("unchecked")
    			List<DataModel> list = c.list();
                if (list.size() > 0) {
                	return list.get(0);
                }
            } catch (Exception e) {  
            	e.printStackTrace();  
            } finally {  
                session.close();  
            }  
    	}
    	return null;
    }
    
    public DataModel find(long id) {
    	Session session = getSession(); 
    	
    	try{  
    		Criteria c = session.createCriteria(this.getModelClass());
    		c.add(Restrictions.eq("id",id));
            
            @SuppressWarnings("unchecked")
			List<DataModel> list = c.list();
            if (list.size() > 0) {
            	return list.get(0);
            }
        } catch (Exception e) {  
        	e.printStackTrace();  
        } finally {  
            session.close();  
        }  
        return null;
    }
    
    public long remove(DataModel model) {
    	Session session = getSession();
    	Transaction transaction = null;  
    	
    	try{  
    		transaction = session.beginTransaction();   
            session.delete(model);  
            transaction.commit();  
            return model.getId();
        } catch (Exception e) {  
            if(null != transaction){  
            	transaction.rollback();  
            } 
            if (e instanceof org.hibernate.exception.ConstraintViolationException) {
            	SQLServerException exception =  (SQLServerException) e.getCause();
            	return exception.getErrorCode();
            } else {
            	e.printStackTrace();  
            }
        } finally {  
            session.close();  
        }  
        return 0;
    }
    
    public long update(DataModel model) {
    	if (model.getId() > 0) {
    		this.edit(model);
    	} else {
    		this.add(model);
    	}
    	return model.getId();
    }
    
    public void add(DataModel model) {
    	Session session = getSession();
    	Transaction transaction = null;  
    	
    	try{  
    		transaction = session.beginTransaction();   
            session.save(model);  
            transaction.commit();  
        } catch (Exception e) {  
            if(null != transaction){  
            	transaction.rollback();  
            }  
            e.printStackTrace();  
        } finally {  
            session.close();  
        }  
    }
    
    public void edit(DataModel model) {
    	Session session = getSession();
    	Transaction transaction = null;  
    	
    	try{  
    		transaction = session.beginTransaction();   
            session.update(model);  
            transaction.commit();  
        } catch (Exception e) {  
            if(null != transaction){  
            	transaction.rollback();  
            }  
            e.printStackTrace();  
        } finally {  
            session.close();  
        }  
    }
    
    public int count(List<Selection> selections){
    	Session session = getSession();
    	try{
    		 String hql = "select count(id) from " + this.getModelName() + buildWhereClause(selections);
  		   	 Query query = session.createQuery(hql);
  		     setQueryParameters(selections, query); 
    		 int num=((Number)query.iterate().next()).intValue();  
    		 return num;
		}catch (Exception e) {  
	        e.printStackTrace();  
	    } finally{
		    session.close();  
		}
	    return 0;
    }
    
    public int count(){
	    return count(null);
    }
    
    abstract protected Class<?> getModelClass();
    abstract protected String getModelName();
}
