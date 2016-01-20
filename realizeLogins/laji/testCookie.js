var http = require('http'); 
http.createServer(function (req, res) {
    // 获得客户端的Cookie
    var Cookies = {};
    req.headers.cookie && req.headers.cookie.split(';').forEach(function( Cookie ) {
        var parts = Cookie.split('=');
        Cookies[ parts[ 0 ].trim() ] = ( parts[ 1 ] || '' ).trim();
    });
    console.log(Cookies)
    // 向客户端设置一个Cookie
    res.writeHead(200, {
        'Set-Cookie': 'SSID=Ap4GTEq; Expires=Wed, 13-Jan-2021 22:23:01 GMT;HttpOnly ',
        'Content-Type': 'text/html'
    });
    res.end('Hello World\n<script>console.log(document.Cookie)</script>');
}).listen(8000);
 
console.log('Server running at http://127.0.0.1:8001/');