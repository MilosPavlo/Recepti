var express = require('express');
var router = express.Router();

var mysql = require('mysql');
/* GET home page. */
let logO;
let logI;
let cL;
let user="";
const con = mysql.createConnection({
    host: 'localhost', user: 'root', database: 'cooking', port:3308

});
router.get('/', function(req, res, next) {

    if(req.cookies["log"]!=undefined){
        logO='Logout';
        logI='/login/logout';
        cL=1;
        user=req.cookies["log"];
        pokreni();
    }else{
        logO='Login';
        logI='/login';
        cL=0;
        res.render('user-upload',{allR:{},log:{logI:logI,logO:logO},checkLog:cL,user:user});
    }

    async function pokreni() {
        let sql = `SELECT * FROM recepti where username='${req.cookies["log"]}';`;
        let allR= await pokrenisql(sql);

        res.render('user-upload',{allR:allR,log:{logI:logI,logO:logO},checkLog:cL,user:user});
    }



});




function pokrenisql(sql){
    return  new Promise((resolve, reject) => {

        con.query(sql, function (err, result) {
            if (err) {
                console.log(err.message);
                reject(err.message);
            }

            resolve(result);

        });

    });

}

module.exports = router;
