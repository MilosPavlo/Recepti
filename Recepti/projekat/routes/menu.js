var express = require('express');
var router = express.Router();
var mysql = require('mysql');
const parser=require('body-parser');



const con = mysql.createConnection({
    host: 'localhost', user: 'root', database: 'cooking', port:3308

});

/* GET home page. */
let logO,logI;
let user="";
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
    async function pokreni() {
        let sql = `SELECT * FROM recepti `
        let allR= await pokrenisql(sql);

        res.render('menu',{allR:allR,log:{logI:logI,logO:logO},user:user});
    }

    pokreni();

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
