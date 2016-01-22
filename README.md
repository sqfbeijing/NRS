##This is a News Release System
realizeLogins文件夹主要是nodejs(无Express)实现登录注册的功能

然后通过nodejs后端加密的方式设置cookie到前端，并通过cookie是否存在来判断用户是否登录，通过cookie解密拿到用户名并与mongodb做通信。

**用到的模块：**

1. mime 模块处理 mime类型辨别；
2. mongodb(原生连接模块)实现nodejs与mongodb做连接；

**将来可能要用的模块：**

* body-parser中间件用于json传输数据到后端；(还没有用到)
* mongodb
* mongoose

1.22日考虑的问题：

1. 新闻首页，未登录和已登录的用户都可以访问，但右上角有区别（用户名 / 登录&注册）
2. 通过cookie给后端,后端传到ejs模板，渲染;
3. 登录的用户可以评论，且可以进入聊天室,未登录的只能看，要想评论或者聊天需要去登录页面;
4. 首页上方布局是否要图片来撑开高度？
5. 以后在考虑增加图片上传功能；
