var qs = require('querystring');

//  注册页面的ajax,后端从ajax获取数据并且返回一个状态
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
      // console.log(post.uname);
      // console.log(post.upassword);
      // 若ajax获取到了注册新用户,则存到数据库
      var addAUser = require("../database/crud").addAUser;
      var userNameWhetherInDb = require("../database/crud").userNameWhetherInDb;

      console.log("post.uname的类型是" + typeof post.uname);
      var post_uname = post.uname;
      var post_upassword = post.upassword;
      // states是string类型 传输状态返回到ajax
      function sendStatesToAjax(states) {
        console.log("我是userNameWhetherInDb的回调函数,states为" + states);
        response.end(states);
      }
      userNameWhetherInDb(post_uname, post_upassword, sendStatesToAjax);
    });
  }
}

function loginForm(request, response){
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
      var loginFormUserNameWhetherInDb = require("../database/crud").loginFormUserNameWhetherInDb;

      console.log("post.uname的类型是" + typeof post.uname);
      var post_uname = post.uname;
      var post_upassword = post.upassword;
      // states是string类型 传输状态返回到ajax
      function sendStatesToAjax(states) {
        console.log("我是loginFormUserNameWhetherInDb的回调函数,states为" + states);
        response.end(states);
      }
      loginFormUserNameWhetherInDb(post_uname, post_upassword, sendStatesToAjax);
    });
}

exports.getData = getData;
exports.loginForm = loginForm;