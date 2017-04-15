package com.stardust.express.actions;

import java.io.File;
import java.io.IOException;
import java.util.Date;
import java.util.UUID;

import org.apache.commons.io.FileUtils;
import org.apache.struts2.ServletActionContext;

import com.opensymphony.xwork2.ActionContext;




public class UploadAction extends  ActionExecutor {

	/**
	 * 
	 */
	private static final long serialVersionUID = -6671097863297369346L;
	
	private String filename = "";
	private File file; 
	private String fileContentType;
	private String fileFileName;
	
	public void setFileContentType(String type) {
		fileContentType = type;
	}
	
	public String getFilename(){
		return filename;
	}
	
	public void setFilename(String path){
		filename = path;
	}
	
	public void setFile(File file) {
		this.file = file;
	}
	
	public void setFileFileName(String name) {
		this.fileFileName = name;
	}
	
	public String upload(){
		String realpath = ServletActionContext.getServletContext().getRealPath("/upload/snapshoot");
        if (file != null) {
        	if (this.fileFileName.toLowerCase().endsWith("png")
        		|| this.fileFileName.toLowerCase().endsWith("jpeg") 
        		|| this.fileFileName.toLowerCase().endsWith("jpg")
        		|| this.fileFileName.toLowerCase().endsWith("bmp")
        		|| this.fileFileName.toLowerCase().endsWith("gif")) {
	        	filename = new Date().getTime() + "_" + UUID.randomUUID().toString() + this.fileFileName; 
	        	try {
	            File savefile = new File(new File(realpath), filename);
	            if (!savefile.getParentFile().exists())
	                savefile.getParentFile().mkdirs();
	            FileUtils.copyFile(file, savefile);
	        	} catch (Exception e) {
	        		filename = "";
	        	}
        	}
        }
		return SUCCESS;
	}
	
}
