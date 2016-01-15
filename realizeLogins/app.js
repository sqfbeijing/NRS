var send404 = require("./routes/index").send404;
var sendFile = require("./routes/index").sendFile;
var serveStatic = require("./routes/index").serveStatic;

var http = require("http");
var cache = {};
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

  serveStatic(response, cache, absPath);
}).listen(3000);

// /Users/shaoqianfei/Desktop/NRS/realizeLogins