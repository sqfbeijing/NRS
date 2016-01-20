function setCookie(request, response, uName) {
	// 先加密
	var encrypt = require("./certify").encrypt;
	// var decrypt = require("./certify").decrypt;
	var COOKIE_USER_NAME_SECRET_KEY = "1101";
	//设置默认30天过期，单位是秒而非ms
	var COOKIE_MAX_AGE = 30 * 24 * 60 * 60 * 1;
	// 密钥是"1101" 
	var encryptedUserName = encrypt(uName, COOKIE_USER_NAME_SECRET_KEY);
	// var jiemihou = decrypt(encryptedUserName, COOKIE_USER_NAME_SECRET_KEY);
	response.writeHead(200, {
		'Set-Cookie': 'uName=' + encryptedUserName + ';Max-Age=' + COOKIE_MAX_AGE + ';path=/;HttpOnly',
		'Content-Type': 'text/plain'
	});
	// console.log("jie密后的：" + jiemihou);
}

exports.setCookie = setCookie;