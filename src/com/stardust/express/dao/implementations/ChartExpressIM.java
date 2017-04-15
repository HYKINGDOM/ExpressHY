package com.stardust.express.dao.implementations;

import com.opensymphony.xwork2.util.KeyProperty;
import com.stardust.express.dao.abstracts.IChartExpress;
import com.stardust.express.models.ChartExpress;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.Transaction;

import java.sql.Connection;

/**
 * Created by Administrator on 2017/4/14.
 */
public class ChartExpressIM extends DataGate implements IChartExpress {
    public ChartExpressIM() {
        super();
        keyProperty = "";
    }

    public ChartExpressIM(String datesource) {
        super(datesource);
        keyProperty = "";
    }

    @Override
    public void chartDate(String[] para) {


    }

    @Override
    protected Class<?> getModelClass() {
        return ChartExpress.class;
    }

    @Override
    protected String getModelName() {
        return "ChartExpress";
    }
}