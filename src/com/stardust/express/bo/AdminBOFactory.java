package com.stardust.express.bo;


import com.stardust.express.tools.IViewContext;

public class AdminBOFactory {
	/*
	static {
		// Add admin bo class here...
		// AdminBOFactory.register("user", UserAdminBO.class);
	}
	
	private static HashMap<String, Class<?>> boMap = new HashMap<String, Class<?>>();
	
	private static void register(String key, Class<?> boClass) {
		if (!boMap.containsKey(key)) {
			boMap.put(key, boClass);
		}
	}
	*/
	public static IAdminBO create(IViewContext context) {
		String modelName = context.getString("MODEL_TYPE");
		if (modelName.equals("user")) {
			return new UserAdminBO(context);
		}
		if (modelName.equals("history")) {
			return new HistoryRecordBO(context);
		}
		return null;
		/*
		if (boMap.containsKey(modelName)) {
			Class<?> c = boMap.get(modelName);
			Constructor<?> cons[] = c.getConstructors();
			try{
				IAdminBO bo = (IAdminBO)cons[0].newInstance(context);
				return bo;
	        }catch(Exception e){
	            e.printStackTrace();
	        }
			
		} else {
			return null;
		}
		return null;
		*/
	}
}
