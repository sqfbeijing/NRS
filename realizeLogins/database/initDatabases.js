// 初始化数据库
var MongoClient = require('mongodb').MongoClient;
var assert = require("assert");//断言
// Connection URL  nrsdb是新闻系统的数据库名字,确保连接之前要打开mongodb(mongod)
var url = 'mongodb://localhost:27017/nrsdb';
function initdb(){
	// Use connect method to connect to the Server
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		console.log("Connected correctly to server");
	  // 建一个新表 Create a collection
	  var collection = db.collection('users');
	  var tempDoc = {name: "sqf", password: 123456};
	  // 插入一个文档
	  // r是什么？？
	  collection.insertOne(tempDoc, function(err, r){
	  	assert.equal(null, err);
	  	assert.equal(1, r.insertedCount);
	  })
	  // 关闭数据库
	  // db.close();
	});
}
exports.initdb = initdb;

