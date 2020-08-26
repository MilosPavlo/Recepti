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

    async function pokreni() {
        if(req.cookies["log"]!=undefined){
            logO='Logout';
            logI='/login/logout';
            cL=1;
            user=req.cookies["log"];
        }else{
            logO='Login';
            logI='/login';
            cL=0;
            user="";
        }

        let sql = `SELECT * FROM recepti order by id DESC;`;
        let allR= await pokrenisql(sql);
        res.render('index',{allR:allR,log:{logI:logI,logO:logO},user:user});
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
router.get('/404', function(req, res, next) {
    res.render('err');
});
module.exports = router;
