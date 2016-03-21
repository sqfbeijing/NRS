var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	// 去数据库拿新闻表的所有内容
	var News = global.dbHandel.getModel('news');
	var docs = [];

	News.find({}, function(err, docs){
		// console.log("所有doc");
		// console.log(docs);
		//docs是个包含所有doc的数组
		docs = docs;
	});

	if (!req.session.user) { 
		// console.log(2);
		// req.session.error = "请先登录";
		res.redirect("/touristIndex.html"); //未登录则重定向到 /login 路径
	} else {
		res.render('userIndex', {
			user: {
				name: req.session.user.name
			},
			docs: docs
		});
	}
});


/* GET login page. */
router.route("/login.html").get(function(req, res) { // 到达此路径则渲染login文件，并传出title值供 login.html使用
	res.render("login", {
		title: 'User Login'
	});
}).post(function(req, res) { // 从此路径检测到post方式则进行post数据的处理操作
	//get User info
	//这里的User就是从model中获取user对象，通过global.dbHandel全局方法（这个方法在app.js中已经实现)
var User = global.dbHandel.getModel('user');
	var uname = req.body.uname; //获取post上来的 data数据中 uname的值
	User.findOne({
		name: uname
	}, function(err, doc) { //通过此model以用户名的条件 查询数据库中的匹配信息
		if (err) { //错误就返回给原post处（login.html) 状态码为500的错误
		res.send(500);
		console.log(err);
		} else if (!doc) { //查询不到用户名匹配信息，则用户名不存在
			req.session.error = 'wrongUser';
			res.send("wrongUser"); //	状态码返回404
		} else {
			if (req.body.upassword != doc.password) { //查询到匹配用户名的信息，但相应的password属性不匹配
				req.session.error = "wrongPassword";
				res.send("wrongPassword");
			} else { //信息匹配成功，则将此对象（匹配到的user) 赋给session.user  并返回成功
// 开启会话
req.session.user = doc;
				// res.sendStatus(200);
				res.send("correct");
			}
		}
	});
});

router.get('/userIndex.html', function(req, res, next) {
	// 去数据库拿新闻表的所有内容
	var News = global.dbHandel.getModel('news');
	// var docs = [];

	News.find({}, function(err, docs){
		if (!req.session.user) { 
		res.redirect("/touristIndex.html"); //未登录则重定向到 /login 路径
	} else {
		res.render('userIndex', {
			user: {
				name: req.session.user.name
			},
			docs: docs
		});
	}
});
});

/* GET home page. */
router.get("/touristIndex.html", function(req, res) {
	if (!req.session.user) {
		res.render('touristIndex');
	} else {
		res.render('userIndex', {
			user: {
				name: req.session.user.name
			}
		});
	}

});
//注销页面
router.post("/userLogout.html", function(req, res) {
	console.log(333);
	//先去掉session
	delete req.session.user;
	res.send("logoutSuccess");
});


/* GET register page. */
router.route("/register.html").get(function(req,res){    // 到达此路径则渲染register文件，并传出title值供 register.html使用
	res.render("register",{title:'User register'});
}).post(function(req,res){ 
	 //这里的User就是从model中获取user对象，通过global.dbHandel全局方法（这个方法在app.js中已经实现)
var User = global.dbHandel.getModel('user');
var uname = req.body.uname;
var upassword = req.body.upassword;
	User.findOne({name: uname},function(err,doc){   // 同理 /login 路径的处理方式
		if(err){ 
			res.send(500);
			req.session.error =  '网络异常错误！';
			console.log(err);
		}else if(doc){ 
			req.session.error = '用户名已存在！';
			res.send("isExistedUserName");
		}else{ 
			// 增加到数据库
			var newUser = new User();
			newUser.name = uname;
			newUser.password = upassword;

			newUser.save(function(err) {  //存储  
				if (err) {  
					console.log('save failed');  
					res.send(500);
				} else {
					console.log('存储成功!');  
					res.send("success");
				}
			});  
		}
	});
});
module.exports = router;