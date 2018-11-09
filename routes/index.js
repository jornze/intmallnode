var express = require('express');
var router = express.Router();
var app=express();
var cookieParser = require('cookie-parser');
app.use(cookieParser());
/* GET home page. */
router.get('/', function(req, res, next) {
	res.cookie('name', 'test', {expires: new Date(Date.now() -200000000000)});
  res.render('index', { title: 'Express' });
  //console.log(new Date(Date.now()));
});

module.exports = router;
