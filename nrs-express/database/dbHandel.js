var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var models = require("./models");

// 生成模型
for(var m in models){ 
	//定义schema
	var tempSchema = new Schema(models[m]);
	//根据schema生成模型,m(user)存到Mongodb里就是users
	mongoose.model(m, tempSchema);
}

var _getModel = function(type){ 
	return mongoose.model(type);
};

module.exports = { 
	getModel: function(type){ 
		return _getModel(type);
	}
};
