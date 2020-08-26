var express = require('express');
var router = express.Router();
let logO;
let logI;
let user="";
/* GET home page. */
router.get('/', function(req, res, next) {

    if(req.cookies["log"]!=undefined){
        logO='Logout';
        logI='/login/logout';
        user=req.cookies["log"];
    }else{
        logO='Login';
        logI='/login';
         user ="";
    }


    res.render('about',{log:{logI:logI,logO:logO},user:user});
});

module.exports = router;
