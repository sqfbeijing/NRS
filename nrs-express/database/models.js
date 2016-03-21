// 每个表都有model
// 现在有users表, admins表
module.exports = { 
	user:{ 
		name:{type:String,required:true},
		password:{type:String,required:true}
	},
	admin:{ 
		name:{type:String,required:true},
		password:{type:String,required:true}
	},
	news:{
		newsType:{type:String,required:true},
		items: [
		{
			title:{type:String,required:true},
			author:{type:String,required:true},
			content:{type:String,required:true},
			images: [
			{
				name:{type:String,required:true},
				dir:{type:String,required:true},
				renderURL:{type:String,required:true}
			}
			],
			videos:[
			{
				name:{type:String,required:true},
				dir:{type:String,required:true},
				renderURL:{type:String,required:true}	
			}
			],
			publishTime:{type:String,required:true},
			publishTimeValue:{type:Number,required:true},
			hot: {type:Boolean,required:true}
		}
		] 
	}
};


// Person = {
// 	age: 20,
// 	getAge: function(){}
// }

// news: 

// typeName: "国内",
// items: [
// {
// 	title: "国内title",
// 	author: "sqf",
// 	publishTime: "2016年3月4日12时20分12秒",
// 	publishTimeValue: 2131291361821,
// 	content: "sasqweqqe撒气",
// 	hot: false,
// images: [],
// videos: []
// }
// ]