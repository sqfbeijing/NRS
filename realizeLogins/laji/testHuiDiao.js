function f1 (callback) {
	// body...
	var x = 2 ;
	if (x == 3) {
		setTimeout(function(){
			console.log("我是f1函数;")
		}, 4000);
	}
	else {
		callback();
	}
}

function f2 () {
	// body...
	console.log("我是f2函数;")
}

f1(f2);
// f2();