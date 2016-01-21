var MongoClient = require('mongodb').MongoClient;
var assert = require("assert"); //断言
// Connection URL  nrsdb是新闻系统的数据库名字,确保连接之前要打开mongodb(mongod)
var url = 'mongodb://localhost:27017/nrsdb';

function connectToDatabase(request, response, paraToDatabase) {
	console.log("我在connectToDatabase函数里面")
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		// states是string类型 传输状态返回到ajax
		function sendStatesToAjax(states) {
			console.log("ajax states为" + states);
			response.end(states);
		}
		var database = {};
		// 增加用户账号方法
		database.addAUser = function(request, response, datasToAddAUser) {
			// 建一个新表 Create a collection
			var collection = db.collection(datasToAddAUser.collectionName);
			var aUserData = {
				name: datasToAddAUser.name,
				password: datasToAddAUser.password
			};
			// 插入一个文档
			// r是什么？？
			collection.insertOne(aUserData, function(err, r) {
				assert.equal(null, err);
				assert.equal(1, r.insertedCount);
				//插入完成之后，执行返回状态到ajax的方法
				sendStatesToAjax(datasToAddAUser.statesToAjax);
			})
		};

		database.userNameWhetherInDb = function(request, response, paraToDatabase) {
			// 传送到ajax的信息
			var statesToAjax = {
				existedUserName: "isExistedUserName",
				succeed: "succeed",
				noUserName: "noUserName",
				wrongPassword: "wrongPassword"
			};
			var collection = db.collection('users');
			var uName = paraToDatabase.datas.post_uname;
			var uPassword = paraToDatabase.datas.post_upassword;
			console.log("开始查找");
			collection.findOne({
				name: uName
			}, function(err, doc) {
				if (err) {
					console.log("报错了。");
					console.log(err);
				} else if (doc) {
					// 若找到了这个doc
					console.log("userNameWhetherInDb 找到了对应的doc");
					// 若是处理注册页面的
					if (paraToDatabase.operation === "dealRegister") {
						sendStatesToAjax(statesToAjax.existedUserName);
					} else if (paraToDatabase.operation === "dealLogin") {
						// 登录页面，且有账号,且密码相同
						if (doc.password === uPassword) {
							// 先异步设置cookie
							var setCookie = require("../bin/manageCookie").setCookie;
							setCookie(request, response, uName);
							//然后再发送到ajax
							sendStatesToAjax(statesToAjax.succeed);
						} else {
							sendStatesToAjax(statesToAjax.wrongPassword);
						}
					}
				} else if (!doc && paraToDatabase.operation === "dealRegister") {
					// 若是处理注册页面的且没有这个doc(用户名)
					console.log("既没有报错也没有找到对应的doc,说明应该插入这个新账号");
					var datasToAddAUser = {
						collectionName: "users",
						name: uName,
						password: uPassword,
						statesToAjax: statesToAjax.succeed
					}
					database.addAUser(request, response, datasToAddAUser);
				} else if (!doc && paraToDatabase.operation === "dealLogin") {
					// 若是处理登录页面的且没有这个doc(用户名)
					console.log("既没有报错也没有找到对应的doc,说明登录的账号不存在");
					sendStatesToAjax(statesToAjax.noUserName);
				}
			});
		}
		database.userNameWhetherInDb(request, response, paraToDatabase);
	});
	// console.log("我在connectToDatabase函数最后面")
	// return database;
}

exports.connectToDatabase = connectToDatabase;