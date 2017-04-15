<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<link rel="shortcut icon" href="resource/images/logo.png"/> 
<title>汉宁高速公路绿色通道稽查综合管理系统</title>
<style type="text/css">
        .app-background 
        {
            background-color:rgb(53,109,186);
            background-image:url('resource/images/Wallpaper.jpg');
            background-size:cover; 
            background-repeat:no-repeat;
            overflow:hidden;
        }
        
        .app-statusbar-left
        {
            background-image:url('resource/images/status_left.gif');
            background-repeat:no-repeat;
            width:24px;
            height:25px;
        }
        
         .app-statusbar-divide
        {
            background-image:url('resource/images/status_divider.jpg');
            background-repeat:repeat-x;
            height:25px;
            width:2px;
        }
        
        .app-statusbar-back
        {
            background-image:url('resource/images/status_back.jpg');
            background-repeat:repeat-x;
            height:25px;
            font-size:14px;
            font-weight:bold;
            color:#555555;
            font-family:Arial;
        }
        
       .app-statusbar-icon
        {
            background-image:url('resource/images/star_red.gif');
            background-repeat:no-repeat;
            height:16px;
            font-size:16px;
        }
        .app-logo 
        {
            background-image:url('resource/images/stardust.png');
            width:860px;
            height:129px;
        }
    </style>
	<link href="includes/easyui/themes/default/easyui.css" rel="stylesheet"   type="text/css"/>
    <link href="includes/easyui/themes/icon.css" rel="stylesheet"   type="text/css"/>
    <link href="includes/easyui/themes/color.css" rel="stylesheet"   type="text/css"/>
    <link href="includes/app/util/richeditor/jquery.cleditor.css" rel ="stylesheet"  type="text/css"/>
    <link href="includes/app/util/checkbox/css/all.css?v=1.0.2" rel ="stylesheet"  type="text/css"/>
    <link href="includes/menu/menu.css" rel ="stylesheet"  type="text/css"/>
    <link href="includes/app/css/main.css" rel ="stylesheet"  type="text/css"/>
    <script language="javascript" src="includes/app/data/city.js" type="text/javascript" ></script>
    <script language="javascript" src="includes/easyui/jquery.min.js" type="text/javascript" ></script>
    <script language="javascript" src="includes/easyui/jquery.easyui.min.js" type="text/javascript"></script>
    <script language="javascript" src="includes/easyui/locale/easyui-lang-zh_CN.js" type="text/javascript"></script>
    <script language="javascript" src="includes/app/util/checkbox/icheck.js" type="text/javascript" ></script>
    <script language="javascript" src="includes/app/util/richeditor/jquery.cleditor.js" type="text/javascript" ></script>
    <script language="javascript" src="includes/app/util/fileupload/js/vendor/jquery.ui.widget.js" type="text/javascript" ></script>
    <script language="javascript" src="includes/app/util/fileupload/js/jquery.iframe-transport.js" type="text/javascript" ></script>
    <script language="javascript" src="includes/app/util/fileupload/js/jquery.fileupload.js" type="text/javascript" ></script>
    <script language="javascript" src="includes/app/util/lib.js" type="text/javascript" ></script>
    <script language="javascript" src="includes/app/util/cookie.js" type="text/javascript" ></script>
    <script language="javascript" src="modules/model/SimpleModel.js" type="text/javascript" ></script>
</head>
<body class="app-background">
	<%
		if (session.getAttribute("logon_username") == null) {
			response.sendRedirect("logon.jsp");
		}
	%>
  <script  language="javascript" type="text/javascript">
  	var session = ('<%=session.getAttribute("logon_username")%>');
  	$(document).ready(function () {
  		var username = ('<%=session.getAttribute("logon_username")%>');
  		var menuname = "";
  		if (username == "MASTER") {
  			menuname = "admin-menu";
  		} else {
  			menuname = "admin-menu-normal";
  		}
  		var menu = new ExpressIM.Menu({menuType:menuname});
        menu.render($('#menuContainer'));
        $('#c_site_name').html(ExpressIM.stationName);
    });
  </script>
  <div style="position:absolute;left:80px;top:20px;">
     <img  src="resource/images/login_logo.png" width="130" height="130" /> 
  </div>
  <div id="menuContainer" style="position:relative;left:70px;top:160px;"></div>
      <div id="statusBar" style="position:absolute;right:0px;bottom:0px;">
        <table cellpadding="0" cellspacing="0" border="0">
            <tr>
                <td>
                    <div class="app-statusbar-left"></div>
                </td>
                 <td>
                    <div class="app-statusbar-back" style="width:30px;"><div class="app-statusbar-icon"  style="position:relative;top:5px;"></div></div>
                </td>
                 <td>
                    <div class="app-statusbar-back" style="width:400px;"><span style="position:relative;top:4px;">汉宁高速绿色通道信息管理系统 - <span id='c_site_name'></span></span></span></div>
                </td>
            </tr>
        </table>
    </div>
    <div style="position:absolute;left:10px;bottom:5px;">
            <img src="resource/images/stardust.png" width="450" height="60" />
    </div>

    <div id="taskContainer"></div>
    <div id="dialogContainer"></div>
    <div id="tagWinContainer"></div>
</body>
</html>