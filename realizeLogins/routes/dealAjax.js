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

    request.on('end', function() {
      // 解析字符串为对象
      var post = qs.parse(body);
      // use post['blah'], etc.
      console.log(post.uname);
      console.log(post.upassword);
      // response.writeHead(200); 
      // 若注册成功,返回一句话"注册成功",服务器返回数据到ajax
      response.end("succeed");
      // 若注册不成功,返回一句话"注册不成功"一个
      // 传到数据库的数据对象
      var temp = {
        name: post.uname,
        password: post.upassword
      };
      // getData方法返回数据对象
      return temp;
    });
  }
  // 此方法如果没有ajax事件则返回false
  return false;
}
exports.getData = getData;