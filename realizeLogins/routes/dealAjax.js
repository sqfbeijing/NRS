var qs = require('querystring');

//  后端从ajax获取数据并且返回一个状态
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
    // 传到数据库的数据对象
    var temp = {};
    request.on('end', function() {
      // 解析字符串为对象
      var post = qs.parse(body);
      // use post['blah'], etc.
      // console.log(post.uname);
      // console.log(post.upassword);
      // 若ajax获取到了注册新用户,则存到数据库
      var addAUser = require("../database/crud").addAUser;
      var isExistedUserName = require("../database/crud").isExistedUserName;

      console.log("post.uname的类型是" + typeof post.uname);
      var post_uname = post.uname;
      var post_upassword = post.upassword;
      // states是string类型 传输状态返回到ajax
      function sendStatesToAjax(states) {
        console.log("我是isExistedUserName的回调函数,states为" + states);
        response.end(states);
      }
      isExistedUserName(post_uname, post_upassword, sendStatesToAjax);

      //   function f1(post_uname, callback) {
      //     if (isExistedUserName(post_uname)) {
      //       console.log("有同名账户名");
      //       response.end("existedUserName");
      //       return;
      //     } else {
      //       callback( post_uname, post_upassword);
      //     }
      //   }
      //   function f2 (post_uname, post_upassword){
      //     addAUser(post_uname, post_upassword);
      //     console.log("dealAjax 37 成功将名为" + post_uname + "  密码为" + post_upassword + "的用户存到了数据库");
      //           // 若注册成功,返回一句话"注册成功",服务器返回数据到ajax
      //   // console.log("返回了succeed到前端 0")
      //   response.end("succeed");
      //   // console.log("返回了succeed到前端 1")
      // }
      // f1(post_uname, function(post_uname, post_upassword) {
      //   f2(post_uname, post_upassword);
      // })
    });
}
}
exports.getData = getData;