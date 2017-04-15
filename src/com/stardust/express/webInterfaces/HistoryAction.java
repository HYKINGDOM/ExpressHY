package com.stardust.express.webInterfaces;

import com.stardust.express.bo.HistoryRecordBO;
import com.stardust.express.models.HistoryRecord;
import com.stardust.express.tools.ResponseObject;
import org.apache.commons.io.FileUtils;
import org.apache.struts2.ServletActionContext;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;

/**
 * Created by Sylar on 15/5/12.
 */
public class HistoryAction extends BaseAction {

    //车牌照片
    public File carFrontImage;

    private String carFrontImageFileName;
    //车身照片
    public File carBodyImage;

    private String carBodyImageFileName;
    //车尾照片
    public File carBackImage;

    private String carBackImageFileName;
    //货物照片
    public File goodsImage;

    private String goodsImageFileName;
    //视频
    public File video;

    private String videoFileName;

    private HistoryRecord historyRecord;

    private static final String SNAPSHOOT_DIR = "/upload/snapshoot";
    private static final String VIDEO_DIR = "/upload/video";

    public String archive() {
        HistoryRecordBO bo = new HistoryRecordBO(context);
//        HistoryRecord historyRecord = new HistoryRecord(context);
        String snapShootPath = ServletActionContext.getServletContext().getRealPath(SNAPSHOOT_DIR);
        String videoPath = ServletActionContext.getServletContext().getRealPath(VIDEO_DIR);
        ResponseObject.Builder builder = new ResponseObject.Builder();
        try {
            historyRecord.setSnapshoot1(copyFileToDest(snapShootPath, carFrontImage, carFrontImageFileName));
            historyRecord.setSnapshoot2(copyFileToDest(snapShootPath, carBodyImage, carBodyImageFileName));
            historyRecord.setSnapshoot3(copyFileToDest(snapShootPath, carBackImage, carBackImageFileName));
            historyRecord.setSnapshoot4(copyFileToDest(snapShootPath, goodsImage, goodsImageFileName));
            historyRecord.setVideo(copyFileToDest(videoPath, video, videoFileName));
            historyRecord = (HistoryRecord) bo.update(historyRecord);
            if (historyRecord != null && historyRecord.getId() > 0) {
                builder.setSuccess(true);
                builder.setData(null);
                builder.setMessage("数据录入成功");
            } else {
                builder.setSuccess(false);
                builder.setData(null);
                builder.setMessage("数据录入失败");
            }
            responseData = builder.build();
        } catch (Exception e) {
            builder.setSuccess(false);
            builder.setData(null);
            builder.setMessage("数据录入失败");
            e.printStackTrace();
        }
        return SUCCESS;
    }

    private String copyFileToDest(String baseDir, File file, String filename) throws IOException {
        if (file == null) return "";
        String destPath = baseDir + File.separator + filename;
        FileUtils.copyFile(file, new File(destPath));
        String contextPath = SNAPSHOOT_DIR + File.separator + filename;
        return contextPath;
    }

    public File getVideo() {
        return video;
    }

    public void setVideo(File video) {
        this.video = video;
    }

    public File getGoodsImage() {
        return goodsImage;
    }

    public void setGoodsImage(File goodsImage) {
        this.goodsImage = goodsImage;
    }

    public File getCarBackImage() {
        return carBackImage;
    }

    public void setCarBackImage(File carBackImage) {
        this.carBackImage = carBackImage;
    }

    public File getCarBodyImage() {
        return carBodyImage;
    }

    public void setCarBodyImage(File carBodyImage) {
        this.carBodyImage = carBodyImage;
    }

    public File getCarFrontImage() {
        return carFrontImage;
    }

    public void setCarFrontImage(File carFrontImage) {
        this.carFrontImage = carFrontImage;
    }

    public HistoryRecord getHistoryRecord() {
        return historyRecord;
    }

    public void setHistoryRecord(HistoryRecord historyRecord) {
        this.historyRecord = historyRecord;
    }

    public String getCarFrontImageFileName() {
        return carFrontImageFileName;
    }

    public void setCarFrontImageFileName(String carFrontImageFileName) {
        this.carFrontImageFileName = carFrontImageFileName;
    }

    public String getCarBodyImageFileName() {
        return carBodyImageFileName;
    }

    public void setCarBodyImageFileName(String carBodyImageFileName) {
        this.carBodyImageFileName = carBodyImageFileName;
    }

    public String getCarBackImageFileName() {
        return carBackImageFileName;
    }

    public void setCarBackImageFileName(String carBackImageFileName) {
        this.carBackImageFileName = carBackImageFileName;
    }

    public String getGoodsImageFileName() {
        return goodsImageFileName;
    }

    public void setGoodsImageFileName(String goodsImageFileName) {
        this.goodsImageFileName = goodsImageFileName;
    }

    public String getVideoFileName() {
        return videoFileName;
    }

    public void setVideoFileName(String videoFileName) {
        this.videoFileName = videoFileName;
    }
}
