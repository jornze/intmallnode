
1.全局安装express项目应用生成器 （脚手架）    
npm install express-generator -g    
初始化项目 express projectName     
项目依赖安装 cd projectName    
cnpm i    
运行项目    
set debug=projectName & npm start                                                                                      
2.开发阶段，为方便开发 代码保存后项目重启--热更新 cnpm i nodemon -D 此时需要修改项目的启动脚本 工程目录package.json里的      
```
script "start": "node ./bin/www"=>>"start": "nodemon ./bin/www"
```
3.启动项目 会发现文件修改保存后 nodejs会自动重启

接下来我们引入mysql模块，连接mysql数据库为前台数据调用提供接口 （我这里用本地的mysql，首先电脑上下载mysql数据库，也可以安装mysql图形工具navicat 或者命令操作）       
4.创建连接mysql文件 创建数据池 并对外暴露连接查询方法 
 ```var mysql = require('mysql');     
 var pool = mysql.createPool({//创建数据池     
        host: 'localhost', //数据库所在服务器ip     
	user: 'root', //数据库登录名       
	password: 'WANGZIQIANG@0520',       
	//数据库连接密码 database: 'intmall' //使用的数据库名     
	});

function query(sql, callback) {//定义数据查询方法
    pool.getConnection(function (err, connection) {//获取链接
        // Use the connection
        connection.query(sql, function (err, rows) {//连接并查询
            callback(err, rows);
            connection.release();//释放链接
        });
    });
}
exports.query = query;//对外暴露接口方法
```
5.在对应router文件中调用数据库查询方法 将数据库数据以json的格式返回给前台使用 首先引入连接数据库js文件

``` var sql=require('../conmen/mysql');
router.get('/api', function(req, res, next) {      
       sql.query('select * from totalcoin',function(err,rows){    
	          if(err){       
	            throw err;      
	         }else{     
	         res.json(rows);       
	         } 
			 })      
 });
```
报错及解决办法： 1.Can't set headers after they are sent.（不能发送headers因为已经发送过一次了） 重复做出响应！    
在处理HTTP请求时，服务器会先输出响应头，然后再输出主体内容， 而一旦输出过一次响应头（比如执行过 res.writeHead() 或 res.write() 或 res.end()），     
你再尝试通过 res.setHeader() 或 res.writeHead() 来设置响应头时 （有些方法比如 res.redirect() 会调用 res.writeHead()），就会报这个错误。       
解决办法：在处理完请求后 在每一个res的前加 return

数据库表结构截图： 看public中的images里
