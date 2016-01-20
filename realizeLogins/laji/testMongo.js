// A simple query using findOne

var MongoClient = require('mongodb').MongoClient,
  test = require('assert');
MongoClient.connect('mongodb://localhost:27017/test', function(err, db) {

  // Create a collection we want to drop later
  var collection = db.collection('simple_limit_skip_find_one_query');
  // Insert a bunch of documents for the testing
  collection.insertMany([{a:1, b:1}, {a:2, b:2}, {a:3, b:3}], {w:1}, function(err, result) {
    test.equal(null, err);

    // Peform a simple find and return all the documents
    collection.findOne({a:2}, {fields:{b:1}}, function(err, doc) {
      test.equal(null, err);
      test.equal(null, doc.a);
      test.equal(2, doc.b);
      console.log("bp")
      db.close();
    });
  });
});