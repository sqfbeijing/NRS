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

  // 处理ajax
  getData(request, response);

}).listen(3000);

var qs = require('querystring');

function getData(request, response) {
  if (request.method == 'POST') {
    // 若不是注册页面,则立即返回
    if (request.url != "/views/error.html") {
      return;
    }
    var body = '';

    request.on('data', function(data) {
      body += data;
      // Too much POST data, kill the connection!
      // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
      if (body.length > 1e6)
        request.connection.destroy();
    });

    request.on('end', function() {
      // 解析字符串为对象
      var post = qs.parse(body);
      // use post['blah'], etc.
      console.log(post.uname);
      console.log(post.upassword);
      // response.writeHead(200); 
      // 若注册成功,返回一句话"注册成功",服务器返回数据到ajax
      response.end("succeed");
      // 若注册不成功,返回一句话"注册不成功"

    });
  }
}


// /Users/shaoqianfei/Desktop/NRS/realizeLogins