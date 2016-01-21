var qs = require('querystring');

//  注册页面的ajax,后端从ajax获取数据并且返回一个状态
function getData(request, response) {
  if (request.method !== 'POST') {
    return;
  }
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
    // console.log(post.uname);
    // console.log(post.upassword);
    // 若ajax获取到了注册新用户,则存到数据库
    // console.log("require connectToDatabase 前")
    // 传到数据库的参数
    var paraToDatabase = {
      datas: {
        post_uname: post.uname,
        post_upassword: post.upassword,
      },
      operation: "dealRegister"
    };

    var connectToDatabase = require("../database/crud").connectToDatabase;
    //去数据库执行操作了：
    connectToDatabase(request, response, paraToDatabase);
  });
}

// 处理登录页面的ajax
function loginForm(request, response) {
  if (request.method !== "POST" || request.url !== "/loginForm") {
    // console.log("loginForm 既不是POST 也不是/loginForm");
    return;
  }
  var body = '';

  request.on('data', function(data) {
    body += data;
    if (body.length > 1e6)
      request.connection.destroy();
  });
  // data传输完毕之后执行的函数
  request.on('end', function() {
    // 解析字符串为对象
    var post = qs.parse(body);
    var paraToDatabase = {
      datas: {
        post_uname: post.uname,
        post_upassword: post.upassword,
      },
      operation: "dealLogin"
    };
    var connectToDatabase = require("../database/crud").connectToDatabase;
    //去数据库执行操作了：
    connectToDatabase(request, response, paraToDatabase);
  });
}

exports.getData = getData;
exports.loginForm = loginForm;