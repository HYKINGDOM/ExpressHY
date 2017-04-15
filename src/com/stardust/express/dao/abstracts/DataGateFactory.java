package com.stardust.express.dao.abstracts;

import com.stardust.express.dao.implementations.HistoryRecordGate;
import com.stardust.express.dao.implementations.UserGate;

public  class DataGateFactory {
	public static IUserGate getUserGate(String datasource) {
		return new UserGate(datasource);
	}
	
	public static IHistoryRecordGate getHistoryRecordGate(String datasource) {
		return new HistoryRecordGate(datasource);
	}
}
