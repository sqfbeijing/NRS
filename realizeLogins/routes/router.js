var http = require("http");
var fs = require("fs");
var path = require("path");
var mime = require("mime");

// 请求不到资源，则发送404错误
function send404(response) {
	response.writeHead(404, {"Content-type": "text/plain"});
	response.write("Error 404: Oh my god! The resource not found.");
	response.end();
}
//若不是404，则发送文件
function sendFile(response, filePath, fileContents) {
	response.writeHead(
		200,
		{"Content-type": mime.lookup(path.basename(filePath))}
		);
	response.end(fileContents);
}

//静态文件服务，内部包含发送文件和404
function serveStatic(response, cache, absPath) {
	//若缓存中存在，则从缓存中读取
	if (cache[absPath]) {
		sendFile(response, absPath, cache[absPath]);
		console.log("从缓存中取到了" + absPath)
	} else {
		// 检查文件是否存在
		fs.exists(absPath, function(exists){
			if (exists) {	//若存在，则读取
				console.log("成功找到的路径为" + absPath);
				fs.readFile(absPath, function(err, data){
					if (err) {
						send404(response);
					} else {
						cache[absPath] = data;
						//将文件的数据放入到cache里面
						console.log("成功将" + absPath + "的数据放入到了缓存，接下来发送文件到客户端");
						sendFile(response, absPath, data);
					}
				});
			} else {
				console.log("寻径出错，力求寻找的路径为" + absPath);
				send404(response);
			}
		});
	}
}

exports.send404 = send404;
exports.sendFile = sendFile;
exports.serveStatic = serveStatic;

