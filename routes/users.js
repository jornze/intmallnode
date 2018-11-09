var express = require('express');
var router = express.Router();
var jwt=require('jsonwebtoken');
//引入mysql数据包及mysql方法
var sql=require('../conmen/mysql');
/* GET users listing. */

//获取M币总数
var allnm={
	"status":'200',
	"message":"success"
}
router.get('/mcoin', function(req, res, next) {
  sql.query('select * from totalcoin',function(err,rows){
  	if(err){
  		throw err;
  	}else{
  		allnm.data=rows;
  		res.json(allnm);
  	}
  })
});

//返回收件地址列表
var addresslists={
	"state":true,
	"messages":"success"
}
router.get('/addresslists', function(req, res, next) {
  sql.query('select * from addresslists',function(err,rows){
  	if(err){
  		throw err;
  	}else{
  		//将默认地址放在第一个 
  		var list=[];
  		for(var i=0;i<rows.length;i++){
  			if(rows[i].isdefault=='1'){
  				list.unshift(rows[i])
  			}else{
  				list.push(rows[i]);
  			}
  		};
  		addresslists.lists=list;
  		res.json(addresslists);
  	}
  })
});

//保证有且只有一个默认地址
function onlyoneDefaultDress(){
	let sqlIsdefaut='UPDATE addresslists SET isdefault = 0';
    	sql.query(sqlIsdefaut,function(err,result){
    		if(err){
    			console.log('修改isdefault 失败')
    		}else{
    			console.log('修改成功');
    		}
    	});
    	
}

//增加新地址
function addAddressF(res,...arg){//arg地址字段传参
	sql.query("insert into addresslists(isdefault,name,phone,address) values('" + arg[0] + "','" + arg[1] + "','" + arg[2] + "','" + arg[3] + "')", function(err, rows){
	        if (err) {
	            res.end('新增失败：' + err);
	        } else {
	            //res.redirect('/persons');
	            let result={
	            	"state":true,
	            	"message":"新增地址成功"
	            }
	            console.log('新增成功');
	            res.json(result);
	        }
		});
}

//编辑更新地址
function updateAddress(updatesql,res){
	sql.query(updatesql,function(err,rows){
		if(err){
			res.json({"state":false,"message":"更新失败"})
		}else{
			res.json({
				"state":true,
				"message":"编辑成功"
			})
		}
	})
}
//增加收件地址
router.post('/addAddress',function(req,res,next){
     var isdefault = req.body.isdefault;
    var name = req.body.name;
    var phone = req.body.phone;
    var address = req.body.address;
    if(isdefault==1){
    	onlyoneDefaultDress();
    	addAddressF(res,isdefault,name,phone,address);
    	
    }else{
    	addAddressF(res,isdefault,name,phone,address);
    }
	
    
    

});

//更新收件地址
router.post('/updateAdd',function(req,res,next){
	let id=req.body.aid;
	let isdefault=req.body.isdefault;
	let name=req.body.name;
	let phone=req.body.phone;
	let address=req.body.address;
	let updateSql="UPDATE addresslists SET isdefault = '"+isdefault+"' ,name='"+name+"', phone='"+phone+"', address='"+address+"'where id='"+id+"' ";
	if(isdefault==1){
		onlyoneDefaultDress();
		updateAddress(updateSql,res)
	}else{
		updateAddress(updateSql,res)
	}
	
})


//用户注册
router.post('/regist',function(req,res,next){
	var username=req.body.name;
	var userpsd=req.body.password;
	var userInfo="insert into userInfo(name,password) values('"+username+"', '"+userpsd+"')";
	sql.query(userInfo,function(err,rows){
		if(err){
			res.json({
				"state":false,
				"msg":"注册用户失败"
			})
			console.log(err)
		}else{
			res.json({
				"state":true,
				"msg":"注册成功"
			})
			console.log('注册成功')
		}
	})
})

//用户登录
router.post('/login',function(req,res,next){
	let username=req.body.name;
	let userpsd=req.body.password;
	//查询指定字段为指定值得所有行（数据）
	var sqlnameRow="select * from userInfo where FIND_IN_SET('"+username+"',name)"
	sql.query(sqlnameRow,function(err,user){
		if(err){
			console.log(user);
			console.log('登录错误');
		}else{
			if(!user.length){//验证用户名
			res.json({"state":false,"msg":"用户名错误"})
			
			}else if(user){
				let psd=user[0].password;
				let name=user[0].name;
				let secret='WANGZIQIANG@0520'//Token加密的key
				if(psd!=userpsd){//验证该用户的密码
					return res.json({"state":false,"msg":"密码错误"})
				}else{
					//创建token
					const token=jwt.sign({name},secret.toString(),{
						expiresIn:60*60*12,
					});
					
					return res.json({
						"state":true,
						"user":name,
						"psd":psd,
						"msg":"登录成功",
						"token":token
					})
				}
			}
		}
		
	})
	
})


//token验证
router.post('/checkToken',function(req,res,next){
	let token=req.body.auth;
	let secret='WANGZIQIANG@0520';
	if(!token){
		return res.json({
			"state":false,
			"msg":"token为空"
		})
		//console.log('没有token');
	}else{
		jwt.verify(token,secret,(err,result)=>{
			if(err){
				
				return res.json({
					"state":false
				});
				
				//console.log('验证失败')
			}else{
				//console.log('验证ok')
				return res.json({
					"state":true,
					"msg":result
				})
				
			}
		})
	}
	
})
module.exports = router;
