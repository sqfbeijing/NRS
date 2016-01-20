##This is a News Release System
realizeLogins文件夹主要是nodejs(无Express)实现登录注册的功能
然后通过nodejs后端加密的方式设置cookie到前端，并通过cookie是否存在来判断用户是否登录，通过cookie解密拿到用户名并与mongodb做通信。

用到的模块：
mime 模块处理 mime类型辨别；

将来可能要用的模块：
body-parser中间件用于json传输数据到后端；(还没有用到)
mongodb
mongoose
