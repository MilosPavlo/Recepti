
var express = require('express');


var passwordHash = require('password-hash');
var router = express.Router();
var mysql = require('mysql');
const parser=require('body-parser');


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('register',{warning:''});
});


const con = mysql.createConnection({
    host: 'localhost', user: 'root', database: 'cooking', port:3308

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




router.post('/reg', function(req, res){
let warning="";
    let sqlCheckUsername = `SELECT count(*)  AS provera FROM users WHERE username='${req.body.username }';`;
    let sqlCheckEmail = `SELECT count(*)  AS provera FROM users WHERE email='${req.body.email }';`;
    async function pokreni() {
        var checkU = await pokrenisql(sqlCheckUsername);
        var checkE = await pokrenisql(sqlCheckEmail);
        if(checkE[0].provera==0&&checkU[0].provera==0){



            let sql = "INSERT INTO users (username, email, password) VALUES (";
            sql += "'" + req.body.username.toLowerCase() + "', ";
            sql += "'" + req.body.email + "', ";
            sql += "'" + passwordHash.generate(req.body.password )+ "' ";
            sql += ");";
             await pokrenisql(sql);
            warning="Uspešna registracija!";

        }else if(checkE[0].provera==1&&checkU[0].provera==0){
            warning="Email koji ste uneli vec postoji";
        }else if(checkE[0].provera==0&&checkU[0].provera==1){
            warning="Username koji ste uneli vec postoji";
        }
        res.render('register',{warning:warning});
    }

        pokreni();


});


module.exports = router;
