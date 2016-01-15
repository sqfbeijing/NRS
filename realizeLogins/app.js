var send404 = require("./routes/router").send404;
var sendFile = require("./routes/router").sendFile;
var serveStatic = require("./routes/router").serveStatic;

var http = require("http");
var cache = {};
  //初始化数据库
  var initdb = require("./database/initDatabases").initdb;
  initdb();

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
  // 改变/blog/v2/v2.html 为blog/v2/v2.html  去掉/
  var absPath = filePath.substring(1);

  serveStatic(response, cache, absPath);
  // req的输入流。读取数据。JSON.parse
  // http
  // 拿到的可能是字节?字符串?buffer?
  // 请问您今天要来点兔子吗？  14:01:09
  // 得parse吧
  // 请问您今天要来点兔子吗？  14:01:10
  // 有body-parse的时候, 他会根据req的content type给你转换
  // 处理注册数据
  // if (request.url === "/testData") {
  //   var email = request.body.name;
  //   console.log("获取到的数据是" + email);
  // }

  // 获取ajax数据到后台
  var getData = require("./routes/dealAjax").getData;
  // 得到ajax一个user数据
  var aUserData = getData(request, response);
  // 若ajax获取到了注册新用户,则存到数据库
  if (aUserData) {
   var addAUser = require("./database/crud").addAUser;
   var name = aUserData.name;
   var pw = aUserData.password;
   addAUser(name, pw);
   console.log("成功将名为" + name + "  密码为" + pw + "的用户存到了数据库");
 }
}).listen(3000);



// /Users/shaoqianfei/Desktop/NRS/realizeLogins