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

    // // states是string类型 传输状态返回到ajax
    // function sendStatesToAjax(states) {
    //   console.log("我是userNameWhetherInDb的回调函数,states为" + states);
    //   response.end(states);
    // }
    // userNameWhetherInDb(post_uname, post_upassword, sendStatesToAjax);
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
    // Too much POST data, kill the connection!
    // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
    if (body.length > 1e6)
      request.connection.destroy();
  });
  // data传输完毕之后执行的函数
  request.on('end', function() {
    // 解析字符串为对象
    var post = qs.parse(body);
    // use post['blah'], etc.
    // console.log(post.uname);
    // console.log(post.upassword);
    // 若ajax获取到了equire("../database/crud").addAUser;
    // 调用数据库查询
    var loginFormUserNameWhetherInDb = require("../database/crud").loginFormUserNameWhetherInDb;

    console.log("post.uname的类型是" + typeof post.uname);
    var post_uname = post.uname;
    var post_upassword = post.upassword;
    // states是string类型 传输状态返回到ajax
    function sendStatesToAjax(states, uName) {
      console.log("我是loginFormUserNameWhetherInDb的回调函数,states为" + states);
      // 若states为 "succeed" 则： ajax返回之前，应执行user加密、写入cookie到浏览器的函数
      if (states === "succeed") {
        // 设置cookie方法
        var setCookie = require("../bin/manageCookie").setCookie;
        setCookie(request, response, uName);
      }
      response.end(states);
    }
    // 数据库做完操作之后执行回调函数sendStatesToAjax
    loginFormUserNameWhetherInDb(post_uname, post_upassword, sendStatesToAjax);
  });
}

exports.getData = getData;
exports.loginForm = loginForm;