package com.stardust.express.webInterfaces;

import com.stardust.express.bo.SecurityBO;
import com.stardust.express.models.User;
import com.stardust.express.tools.ResponseObject;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by Sylar on 15/5/12.
 */
public class UserAction extends BaseAction {

    public String operatorLogon() {
        SecurityBO bo = new SecurityBO(context);
        String username = context.getString("username");
        String password = context.getString("password");
        User user = bo.verifyUser(username, password);
        ResponseObject.Builder builder = new ResponseObject.Builder();
        builder.setData(null);
        builder.setSuccess(false);
        if (user != null && user.getId() > 0) {
            if (!user.getStatus().equals(User.STATUS_ACTIVE)) {
                builder.setMessage("当前登录用户为禁用状态,请联系管理员");
                responseData = builder.build();
            } else if (!user.getType().equals(User.USER_TYPE_OPERATOR)) {
                builder.setMessage("请使用操作员账户登录");
                responseData = builder.build();
            } else if (isExperied()) {
            	builder.setMessage("系统故障0x1125expired");
                responseData = builder.build();
            } else {
                Map<String, Object> data = new HashMap<String, Object>();
                data.put("username", user.getUsername());
                data.put("name", user.getName());
                data.put("id", user.getId());
                builder.setData(data);
                builder.setMessage("登录成功");
                builder.setSuccess(true);
                responseData = builder.build();
            }
        } else {
            builder.setMessage("用户名或密码错误");
            responseData = builder.build();
        }
        return SUCCESS;
    }

    public String leaderLogon() {
        SecurityBO bo = new SecurityBO(context);
        String username = context.getString("username");
        String password = context.getString("password");
        User user = bo.verifyUser(username, password);
        ResponseObject.Builder builder = new ResponseObject.Builder();
        builder.setData(null);
        builder.setSuccess(false);
        if (user != null && user.getId() > 0) {
            if (!user.getStatus().equals(User.STATUS_ACTIVE)) {
                builder.setMessage("当前登录用户为禁用状态,请联系管理员");
                responseData = builder.build();
            } else if (!user.getType().equals(User.USER_TYPE_LEADER)) {
                builder.setMessage("请使用审核员账户登录");
                responseData = builder.build();
            } else if (isExperied()) {
            	builder.setMessage("系统故障0x1125expired");
                responseData = builder.build();
            } else {
                Map<String, Object> data = new HashMap<String, Object>();
                data.put("id", user.getId());
                builder.setData(data);
                builder.setMessage("登录成功");
                builder.setSuccess(true);
                responseData = builder.build();
            }
        } else {
            builder.setMessage("用户名或密码错误");
            responseData = builder.build();
        }
        return SUCCESS;
    }
}
