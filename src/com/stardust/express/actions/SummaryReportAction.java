package com.stardust.express.actions;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.stardust.express.dao.implementations.Selection;
import com.stardust.express.dao.implementations.Selection.Operand;
import com.stardust.express.dao.implementations.Selection.Operator;
import com.stardust.express.models.SummaryRecord;
import com.stardust.express.reporting.SummaryReport;

public class SummaryReportAction extends ActionExecutor {

	/**
	 *
	 */
	private static final long serialVersionUID = 4014745096879618188L;

	private List<SummaryRecord> rows = new ArrayList<SummaryRecord>();

	private int total = 0;

	public List<SummaryRecord> getRows(){
		return this.rows;
	}

	public int getTotal(){
		return total;
	}

	public String fetch(){
		if (!isValidSession()) return ERROR;
		String summaryBy = context.getString("summaryBy","day");
		Date startDate = context.getDate("startDate", null);
		Date endDate = context.getDate("endDate", null);
		List<Selection> selections = new ArrayList<Selection>();
		if (startDate != null) {
			selections.add(new Selection("REOCRD_DATE", Operator.GEATER_EQUAL, startDate, "startdate"));
		}

		if (endDate != null) {
			if (selections.size() > 0) {
				selections.add(new Selection("REOCRD_DATE", Operator.LESS_EQUAL, endDate, Operand.AND));
			} else {
				selections.add(new Selection("REOCRD_DATE", Operator.LESS_EQUAL, endDate));
			}
		}
		rows = new SummaryReport().run(summaryBy, selections);

		double totalChargeCount = 0;
		double totalFreeCount = 0;
		double totalChargeAmount = 0;
		double totalFreeAmount = 0;
		for(SummaryRecord sr : rows) {
			totalFreeCount +=  sr.getFreeCount();
			totalChargeCount += sr.getChargeCount();
			totalChargeAmount +=  sr.getChargeAmount();
			totalFreeAmount += sr.getFreeAmount();
		}

		SummaryRecord srTotalCount = new SummaryRecord();
		srTotalCount.setDate("月出口总流量(辆)");
		srTotalCount.setFreeCount(context.getInt("vCount"));
		srTotalCount.setChargeAmount(totalChargeCount + totalFreeCount);
		SummaryRecord srTotaAmount = new SummaryRecord();
		srTotaAmount.setDate("月拆分前<br/>应收总金额(元))");
		srTotaAmount.setFreeAmount(context.getDouble("vAmount"));
		srTotaAmount.setChargeAmount(totalChargeAmount + totalFreeAmount);
		SummaryRecord srPercentCount = new SummaryRecord();
		srPercentCount.setDate("车辆免缴率(%)");
		srPercentCount.setChargeAmount((totalFreeCount/(totalFreeCount + totalChargeCount)) * 100);
		SummaryRecord srPercentAmount = new SummaryRecord();
		srPercentAmount.setDate("通行费免征率(%)");
		srPercentAmount.setChargeAmount(totalFreeAmount/(totalChargeAmount + totalFreeAmount) * 100);
		SummaryRecord sum = new SummaryRecord();
		sum.setDate("合计:");
		sum.setChargeAmount(totalChargeAmount);
		sum.setChargeCount((int)totalChargeCount);
		sum.setFreeAmount(totalFreeAmount);
		sum.setFreeCount((int)totalFreeCount);
		srPercentCount.setFreeAmount((totalFreeCount/context.getDouble("vCount")) * 100);
		srPercentAmount.setFreeAmount((totalFreeAmount/context.getDouble("vAmount")) * 100);
		rows.add(sum);
		rows.add(srTotalCount);
		rows.add(srTotaAmount);
		rows.add(srPercentCount);
		rows.add(srPercentAmount);
		total = rows.size();
		return SUCCESS;
	}

}
