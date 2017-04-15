package com.stardust.express.models;

import com.stardust.express.tools.IViewContext;

/**
 * Created by HY on 2017/4/14.
 */
public class ChartExpress extends DataModel {

    private String year = "";
    private String month = "";
    private String day = "";
    private String date;
    private String merchandiseType = "";



    public ChartExpress(IViewContext ctx){

        merchandiseType = ctx.getString("merchandiseType");
        year = ctx.getString("year");
        month = ctx.getString("month");
        day = ctx.getString("day");
        date = ctx.getString("date");
        vehicleType = ctx.getString("vehicleType");

    }

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
    }

    public String getMonth() {
        return month;
    }

    public void setMonth(String month) {
        this.month = month;
    }

    public String getDay() {
        return day;
    }

    public void setDay(String day) {
        this.day = day;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getMerchandiseType() {
        return merchandiseType;
    }

    public String getVehicleType() {
        return vehicleType;
    }

    public void setVehicleType(String vehicleType) {
        this.vehicleType = vehicleType;
    }

    private String vehicleType = "";

    public void setMerchandiseType(String merchandiseType) {
        this.merchandiseType = merchandiseType;
    }



}
