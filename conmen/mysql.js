var mysql = require('mysql');
var pool = mysql.createPool({//创建数据池
    host: 'localhost',
    user: 'root',
    password: 'WANGZIQIANG@0520',
    database: 'intmall'
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