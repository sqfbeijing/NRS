var MongoClient = require('mongodb').MongoClient;
var assert = require("assert"); //断言
// Connection URL  nrsdb是新闻系统的数据库名字,确保连接之前要打开mongodb(mongod)
var url = 'mongodb://localhost:27017/nrsdb';

// 两个参数均为字符串类型
function addAUser(name, password) {
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		console.log("addAUser正确地连接到mongodb数据库");
		// 建一个新表 Create a collection
		var collection = db.collection('users');
		var aUserData = {
			name: name,
			password: password
		};
		// 插入一个文档
		// r是什么？？
		collection.insertOne(aUserData, function(err, r) {
			assert.equal(null, err);
			assert.equal(1, r.insertedCount);
		})
			// 数据库插入完成
			// 关闭数据库
			// db.close();
		});
}

function userNameWhetherInDb(uName, uPassword, callback) {
	var result = false;
	// 传送到ajax的信息
	var statesToAjax = {
		existedUserName: "isExistedUserName",
		succeed: "succeed"
	};
	MongoClient.connect(url, function(err, db) {
		console.log("userNameWhetherInDb 正确地连接到mongodb数据库");
		var collection = db.collection('users');
		console.log("开始查找");
		collection.findOne({name: uName}, function (err, doc){
			if (err) {
				console.log("报错了。");
				console.log(err);
			} else if (doc) {
				// 若找到了这个doc
				console.log("userNameWhetherInDb 找到了对应的doc");
				callback(statesToAjax.existedUserName);
			} else {
				console.log("既没有报错也没有找到对应的doc,说明应该插入这个新账号");
				addAUser(uName, uPassword);
				callback(statesToAjax.succeed);
			}
		});
		// console.log("马上关闭数据库")
		// db.close();
	});
	return result;
}

function loginFormUserNameWhetherInDb(uName, uPassword, callback) {
	// 传送到ajax的信息
	var statesToAjax = {
		noUserName: "noUserName",
		succeed: "succeed",
		wrongPassword: "wrongPassword"
	};
	MongoClient.connect(url, function(err, db) {
		console.log("loginFormUserNameWhetherInDb 正确地连接到mongodb数据库");
		var collection = db.collection('users');
		console.log("开始查找");
		collection.findOne({name: uName}, function (err, doc){
			if (err) {
				console.log("报错了。");
				console.log(err);
			} else if (doc) {
				// 若找到了这个doc
				console.log("loginFormUserNameWhetherInDb 找到了对应的doc,账户名存在");
				console.log("数据库中这个doc的类型是:" + typeof doc);
				console.log("数据库中这个doc(账户名对应的密码)是:" + doc.password);
				if (doc.password === uPassword) {
					console.log("与数据库中账户名密码均一致！");
					// 这里多写一个uName参数，用于匹配成功之后，传到另外的函数进行加密操作
					callback(statesToAjax.succeed, uName);
				} else {
					console.log("与数据库中账户名一致,但是密码不一致！");
					callback(statesToAjax.wrongPassword);
				}
			} else {
				console.log("既没有报错也没有找到对应的doc,说明没有这个账户名");
				callback(statesToAjax.noUserName);
			}
		});
		// console.log("马上关闭数据库")
		// db.close();
	});
}
exports.addAUser = addAUser;
exports.userNameWhetherInDb = userNameWhetherInDb;
exports.loginFormUserNameWhetherInDb = loginFormUserNameWhetherInDb;