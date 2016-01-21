var url = "baidu";

function a() {
	setTimeout(function() {
		console.log(url);
	}, 3000);
	setTimeout(function() {
		console.log(333);
	}, 1000);
	// console.log(url);
	var r = 0;
	for (var i = 0; i < 10000000; i++) {
		r += 1;
	}
	console.log(r)
}
exports.a = a;