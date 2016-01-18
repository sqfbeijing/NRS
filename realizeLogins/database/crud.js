var MongoClient = require('mongodb').MongoClient;
var assert = require("assert");//断言
// Connection URL  nrsdb是新闻系统的数据库名字,确保连接之前要打开mongodb(mongod)
var url = 'mongodb://localhost:27017/nrsdb';

// 两个参数均为字符串类型
function addAUser(name, password){
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		console.log("正确地连接到mongodb数据库");
	  // 建一个新表 Create a collection
	  var collection = db.collection('users');
	  var aUserData = {name: name, password: password};
	  // 插入一个文档
	  // r是什么？？
	  collection.insertOne(aUserData, function(err, r){
	  	assert.equal(null, err);
	  	assert.equal(1, r.insertedCount);
	  })
	  // 数据库插入完成
	  // 关闭数据库
	  // db.close();
	});
}
exports.addAUser = addAUser;