var send404 = require("./routes/router").send404;
var sendFile = require("./routes/router").sendFile;
var serveStatic = require("./routes/router").serveStatic;

var http = require("http");
var cache = {};
//初始化数据库
// var initdb = require("./database/initDatabases").initdb;
// initdb();

//创建服务器
var server = http.createServer(function(request, response) {
  console.log("成功开启了服务器.")
  var filePath;
  //设定网站前台的根目录
  if (request.url == "/") {
    // 发送的文档为这个
    filePath = "/views/login.html";
  } else {
    filePath = request.url; //  /static/css/style.css 
  }
  // 若不是ajax则返回对应文件
  if (filePath !== "/views/error.html" && filePath !== "/loginForm") {
    // 改变/blog/v2/v2.html 为blog/v2/v2.html  去掉/
    var absPath = filePath.substring(1);
    serveStatic(response, cache, absPath);
  }
  // 注册页面获取ajax数据,并在getData方法中回调 存放到数据库的方法
  var registerGetData = require("./routes/dealAjax").getData;
  registerGetData(request, response);
  // 登录页面的ajax表单
  var loginForm = require("./routes/dealAjax").loginForm;
  loginForm(request, response);
}).listen(3000);



// /Users/shaoqianfei/Desktop/NRS/realizeLogins