// CRUD create read update delete
// 插入
var insertDocuments = function(db, callback) {
  // Get the documents collection 如果没有，就创建这个新表，表名是documents
  var collection = db.collection('documents');
  // Insert some documents
  collection.insertMany([
    // 插入3个 document,(3行)
    {a : 1}, {a : 2}, {a : 3}
    ], function(err, result) {
        // 断言判断相等，若不等会报错
        assert.equal(err, null);
        assert.equal(3, result.result.n);
        assert.equal(3, result.ops.length);
        console.log("Inserted 3 documents into the document collection");
        callback(result);
    });
}
// 更新（修改）
var updateDocument = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Update document where a is 2, set b equal to 1 （增加b = 1）
  collection.updateOne({ a : 2 }
    , { $set: { b : 1 } }, function(err, result) {
        assert.equal(err, null);
        assert.equal(1, result.result.n);
        console.log("Updated the document with the field a equal to 2");
        callback(result);
    });  
}

// 查询
var findDocuments = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Find some documents
  collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    // assert.equal(2, docs.length);
    console.log("Found the following records");
    console.dir(docs)
    callback(docs);
});      
}

var MongoClient = require('mongodb').MongoClient
, assert = require('assert');

// Connection URL logindb为数据库的名字
var url = 'mongodb://localhost:27017/logindb';
// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server");

  insertDocuments(db, function() {
    updateDocument(db, function() {
        findDocuments(db, function() {
            db.close();
        })
    });
});
});

/**
删除的方法
var removeDocument = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Insert some documents
This will remove the first document where the field a equals to 3. 
  collection.deleteOne({ a : 3 }, function(err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    console.log("Removed the document with the field a equal to 3");
    callback(result);
  });    
}
*/



