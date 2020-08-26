var express = require('express');
var router = express.Router();
var passwordHash = require('password-hash');
var router = express.Router();
var cookiParser = require('cookie-parser');
var mysql = require('mysql');
const parser=require('body-parser');



const con = mysql.createConnection({
    host: 'localhost', user: 'root', database: 'cooking', port:3308

});

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('login',{war:''});
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

router.get('/logout', function(req, res, next){
    res.clearCookie("log");
    res.redirect('/index');
});

router.post('/log', function(req, res, next) {

    let sqlCheckUsername = `SELECT count(*)  AS provera FROM users WHERE username='${req.body.username.toLocaleLowerCase() }';`;
    let checkQ = `SELECT *  FROM users WHERE username='${req.body.username}';`;
    async function pokreni() {
        var checkU = await pokrenisql(sqlCheckUsername);

        if(checkU[0].provera==1){
            var check = await pokrenisql(checkQ);

             if(passwordHash.verify(req.body.password, check[0].password)){

                res.cookie('log',req.body.username);
                 res.redirect('/index');
             }else{
                 warning="Unesena lozinka nije tacna";
                 res.render('login',{war:warning});
             }



        }else if(checkU[0].provera==0){
            warning="Ovo korisnicko ime nije registrovano";
            res.render('login',{war:warning});
        }
        res.redirect('/index');
    }

    pokreni();





});


module.exports = router;
