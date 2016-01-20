// 原生node的crypto模块
var crypto = require('crypto');
// 加密算法 str是需要加密的str,secret是密钥，两个参数均是string类型,而且参数2貌似必须2进制 0101这样,但是最后发现不是2进制也可以 = =
function encrypt(str, secret) {
    // 参数1是算法，参数2 是密钥吧。算法有aes192,bf等等
    // 返回一个cipher对象
    var cipher = crypto.createCipher('aes192', secret);
    var enc = "";
    // 可以多次update
    // 输入utf8格式,输出16进制
    enc += cipher.update(str, 'utf8', 'hex');
    enc += cipher.final('hex');
    return enc;
}
// 解密算法 str是需要解密的str,secret是密钥
function decrypt(str, secret) {
    // 返回一个decipher对象
    var decipher = crypto.createDecipher('aes192', secret);
    // console.log(decipher)
    // 输入16进制,输出utf8格式
    var dec = decipher.update(str, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
}

exports.encrypt = encrypt;
exports.decrypt = decrypt;
