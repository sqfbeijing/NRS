var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var formidable = require('formidable');
// util必须要，但是不清楚它是干嘛的
var util = require('util');

router.get('/', function(req, res, next) {
	if (!req.session.admin) {
		// 最前面其实应该有views省略了
		res.redirect("/admin/adminLogin.html"); //未登录则重定向到 /login 路径
	} else {
		res.render('admin/adminIndex', {
			admin: {
				name: req.session.admin.name,
			}
		});
	}
});

/* GET login page. */
router.route("/adminLogin.html").get(function(req, res) { // 到达此路径则渲染login文件，并传出title值供 login.html使用
	res.render("admin/adminLogin");
}).post(function(req, res) { // 从此路径检测到post方式则进行post数据的处理操作
	//get User info
	//这里的User就是从model中获取user对象，通过global.dbHandel全局方法（这个方法在app.js中已经实现)
var User = global.dbHandel.getModel('admin');
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
				res.send("wrongPassword");
			} else { //信息匹配成功，则将此对象（匹配到的user) 赋给session.user  并返回成功
				// 开启会话
				req.session.admin = doc;
				res.send("correct");
			}
		}
	});
});


/* GET home page. */
router.get("/adminIndex.html", function(req, res) {
	if (!req.session.admin) { //到达/home路径首先判断是否已经登录
		res.redirect("admin/adminLogin.html"); //未登录则重定向到 /login 路径
	} else {
		res.render('admin/adminIndex', {
			admin: {
				name: req.session.admin.name
			}
		});
	}
});
// adminIndex页面增加一个新闻条目的操作
router.post("/addANewsItem", function(req, res) {
	// app.js用json()方法已经解析json对象为js对象
	console.log(req.body);
	console.log(req.body.newsType);
	console.log(req.body.obj);
	var newsType = req.body.newsType;
	var obj = req.body.obj;
	var News = global.dbHandel.getModel('news');

	News.findOne({	newsType: newsType },function(err, doc) {
		if (err) {
			return handleError(err);
		}
		if (!doc) {
			console.log("找不到");
			return;
		}
		// 找到了
		console.log("找到了对应类型的新闻" + newsType);
		console.log(doc.items);
		// doc.items.push(obj);
		var arr = doc.items;
		arr.push(obj);
		// update操作，不知道为什么下面注释掉的会出错
		News.update({newsType: newsType }, {items: arr }, function(err, docs) {
			console.log(docs);
			console.log('update success');
			res.send("ok");
		});
		// doc.items = arr;
		// console.log(doc.items)
		// // 保存到数据库
		// doc.save(function(err){
		// 	if (err) return handleError(err);
		// 	console.log("保存成功");
		// 	res.send("ok");
		// });
});
});

//注销页面
router.post("/adminLogout.html", function(req, res) {
	//先去掉session
	delete req.session.admin;
	res.send("logoutSuccess");
});

router.post("/uploadImg", function(req, res) {
	var form = new formidable.IncomingForm(); //创建上传表单

	form.keepExtensions = true; //保留后缀
	form.maxFieldsSize = 10 * 1024 * 1024; //单个图片文件大小不能超过10M
	form.parse(req, function(err, fields, files) {
		console.log(util.inspect({
			fields: fields,
			files: files
		}))
		console.log("类型名字是:" + fields.typeName);
		if (err) {
			res.locals.error = err;
			res.render('index', {
				title: TITLE
			});
			return;
		}

		// var extName = ''; //后缀名
		// switch (files.fulAvatar.type) {
		// 	case 'image/jpeg':
		// 		extName = 'jpeg';
		// 		break;
		// 	case 'image/jpg':
		// 		extName = 'jpg';
		// 		break;
		// 	case 'image/png':
		// 		extName = 'png';
		// 		break;
		// 	case 'image/x-png':
		// 		extName = 'png';
		// 		break;
		// }
		console.log(files.fulAvatar.name);
		// if (extName.length == 0) {
		// 	res.locals.error = '只支持png和jpg格式图片';
		// 	res.render('index', {
		// 		title: TITLE
		// 	});
		// 	return;
		// }
		console.log(4)
		// var avatarName = Math.random() + '.' + extName;
		// console.log()

		var tmp = '../public/news/images/' + fields.typeName;
		form.uploadDir = path.join(__dirname, tmp); //文件保存的临时目录为当前项目下的tmp文件夹
		var newPath = form.uploadDir + "/" + files.fulAvatar.name;
		fs.renameSync(files.fulAvatar.path, newPath); //重命名
	});
// 刷新页面
// res.redirect("/admin/adminIndex.html");
});

router.post("/uploadVideo", function(req, res) {

	var form = new formidable.IncomingForm(); //创建上传表单

	form.keepExtensions = true; //保留后缀
	form.maxFieldsSize = 10 * 1024 * 1024; //单个图片文件大小不能超过10M
	form.parse(req, function(err, fields, files) {
		console.log(util.inspect({
			fields: fields,
			files: files
		}))
		console.log("类型名字是:" + fields.typeName);
		if (err) {
			res.locals.error = err;
			res.render('index', {
				title: TITLE
			});
			return;
		}

		// var extName = ''; //后缀名
		// switch (files.fulAvatar.type) {
		// 	case 'image/jpeg':
		// 		extName = 'jpeg';
		// 		break;
		// 	case 'image/jpg':
		// 		extName = 'jpg';
		// 		break;
		// 	case 'image/png':
		// 		extName = 'png';
		// 		break;
		// 	case 'image/x-png':
		// 		extName = 'png';
		// 		break;
		// }
		// console.log(files.fulAvatar.name);
		// var avatarName = Math.random() + '.' + extName;
		// console.log()

		var tmp = '../public/news/videos/' + fields.typeName;
		form.uploadDir = path.join(__dirname, tmp); //文件保存的临时目录为当前项目下的tmp文件夹
		var newPath = form.uploadDir + "/" + files.fulAvatar.name;
		// console.log(newPath);
		fs.renameSync(files.fulAvatar.path, newPath); //重命名
	});
	res.end("ok");
});

// 管理员页面获取新闻对应的
router.post("/getNewsItems", function(req, res){
	// res.end("ok");
	var newsType = req.body.newsType;
	var count = req.body.count;
	var News = global.dbHandel.getModel('news');

	News.findOne({newsType: newsType}, function(err, docs){
		console.log(docs);
		console.log(docs.items);
			//发到前端
			res.send(docs.items);
		});
});
// 管理员页面删除一个新闻条目
router.post("/deleteAItem", function(req, res){
	// res.end("ok");
	var newsType = req.body.newsType;
	var title = req.body.title;
	var News = global.dbHandel.getModel('news');

	News.findOne({newsType: newsType}, function(err, docs){
		console.log(docs);
		console.log(docs.items);
		var arr = docs.items;

		arr.forEach(function(elem, index, array){
			if (elem.title === title) {
				//删除这个
				array.splice(index, 1);
			}
		});
		News.update({newsType: newsType}, {items: arr}, function(err, docs) {

		});
			//发到前端
			console.log(docs);
			console.log(' 删除 update success');
			res.send("ok");
		});
});

// 管理员页面将一个新闻条目设为热点
router.post("/setHotAItem", function(req, res){
	// res.end("ok");
	var newsType = req.body.newsType;
	var title = req.body.title;
	var News = global.dbHandel.getModel('news');

	News.findOne({newsType: newsType}, function(err, docs){
		console.log(docs);
		console.log(docs.items);
		var arr = docs.items;

		arr.forEach(function(elem, index, array){
			if (elem.title === title) {
				//删除这个
				elem.hot = true;
			}
		});
		News.update({newsType: newsType}, {items: arr}, function(err, docs) {

		});
			//发到前端
			console.log(docs);
			console.log(' 设为热点 update success');
			res.send("ok");
		});
});

// 管理员页面将一个新闻条目设为热点
router.post("/cancelHotAItem", function(req, res){
	// res.end("ok");
	var newsType = req.body.newsType;
	var title = req.body.title;
	var News = global.dbHandel.getModel('news');

	News.findOne({newsType: newsType}, function(err, docs){
		console.log(docs);
		console.log(docs.items);
		var arr = docs.items;

		arr.forEach(function(elem, index, array){
			if (elem.title === title) {
				//删除这个
				elem.hot = false;
			}
		});
		News.update({newsType: newsType}, {items: arr}, function(err, docs) {

		});
			//发到前端
			console.log(docs);
			console.log(' 取消热点 update success');
			res.send("ok");
		});
});
// router.post("/uploadVideo", function(req, res) {
// 	var form = new formidable.IncomingForm(); //创建上传表单

// 	form.keepExtensions = true; //保留后缀
// 	form.maxFieldsSize = 100 * 1024 * 1024; //单个图片文件大小不能超过100M
// 	form.parse(req, function(err, fields, files) {
// 		console.log(util.inspect({
// 			fields: fields,
// 			files: files
// 		}))

// 		// if (err) {
// 		// 	res.locals.error = err;
// 		// 	res.render('index', {
// 		// 		title: TITLE
// 		// 	});
// 		// 	return;
// 		// }

// 		// console.log(files.fulAvatar.name);
// 		var fileName = files.fulAvatar.name;
// 		// console.log("avatarName是:" + avatarName);
// 		// console.log("form.uploadDir是:" + form.uploadDir);
// 		// var path = form.uploadDir + "/" + fileName;

// 		// console.log("path是:" + path);
// 		var tmp = '../public/news/videos/' + fields.typeName;
// 		console.log("tmp:" + tmp)
// 		form.uploadDir = path.join(__dirname, tmp); //文件保存的临时目录为当前项目下的tmp文件夹
// 		var path = form.uploadDir + "/" + fileName;
// 		fs.renameSync(files.fulAvatar.path, path); //重命名
// 	});
// 	// res.locals.success = '上传成功';
// 	// console.log("sc");
// 	// res.render('index', { title: TITLE });  
// });



module.exports = router;