package com.stardust.express.webInterfaces;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import com.stardust.express.actions.ActionExecutor;
import com.stardust.express.dao.abstracts.DataGateFactory;
import com.stardust.express.dao.abstracts.IHistoryRecordGate;
import com.stardust.express.models.DataModel;
import com.stardust.express.models.HistoryRecord;
import com.stardust.express.tools.ResponseObject;
/**
 * Created by Sylar on 15/5/13.
 */
public class BaseAction extends ActionExecutor {

    public ResponseObject responseData;


    public ResponseObject getResponseData() {
        return responseData;
    }
    
	protected boolean isExperied() {
		/*
		try {
			Date current = new Date();
			SimpleDateFormat sd = new SimpleDateFormat("yyyy-MM-dd");
			Date experied = sd.parse("2015-12-26");
			if (current.after(experied)) {
				return true;
			} else {
				return false;
			}
		} catch (Exception e) {
			return true;
		}
		*/
		return false;
	}
}
