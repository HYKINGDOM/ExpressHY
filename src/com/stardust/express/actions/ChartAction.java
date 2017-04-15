package com.stardust.express.actions;

import com.stardust.express.bo.HistoryRecordBO;
import com.stardust.express.dao.implementations.Selection;
import com.stardust.express.models.DataModel;
import org.apache.struts2.ServletActionContext;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Administrator on 2017/4/14.
 */
public class ChartAction extends ActionExecutor{


    private List<DataModel> rows;

    private int total = 0;

    public List<DataModel> getRows() {
        return this.rows;
    }

    public int getTotal(){
        return total;
    }



    public String chartIM() {
        if (!isValidSession()) return ERROR;
        HistoryRecordBO bo = new HistoryRecordBO(context);
        int pageSize = context.getInt("rows");
        int start = (context.getInt("page")-1) * pageSize;

        String day = context.getString("day");
        String month = context.getString("month");
        String year = context.getString("year");
        String date = context.getString("date");
        String sortBy = context.getString("sortBy");
        String merchandiseType = context.getString("merchandiseType");
        String vehicleType = context.getString("vehicleType");


        List<Selection> selections = new ArrayList<Selection>();




        if (vehicleType != null && !vehicleType.isEmpty()) {
            if (selections.size() > 0) {
                selections.add(new Selection("vehicleType", Selection.Operator.EQUAL, vehicleType, Selection.Operand.AND));
            } else {
                selections.add(new Selection("vehicleType", Selection.Operator.EQUAL, vehicleType));
            }
        }

        rows = bo.filter(selections, sortBy, pageSize, start);
        total = bo.count(selections);
        if (rows == null) {
            rows = new ArrayList<DataModel>();
        }
        if (total < 0) {
            total = 0;
        }
        return SUCCESS;
    }
}
