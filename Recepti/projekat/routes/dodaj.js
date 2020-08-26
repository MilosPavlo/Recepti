var express = require('express');
var router = express.Router();
var cookiParser = require('cookie-parser');
var mysql = require('mysql');
/* GET home page. */
let logO;
let logI;
let cL;
let user ="";
router.get('/', function(req, res, next) {

if(req.cookies["log"]!=undefined){
    logO='Logout';
    logI='/login/logout';
    cL=1;
    user=req.cookies["log"];
}else{
     logO='Login';
     logI='/login';
     user ="";
     cL=0;
}
    res.render('dodaj',{data:data,log:{logI:logI,logO:logO},checkLog:cL,user:user});
});

let data = {
    warning:'Ime slike treba biti kombinacija imena slike i ',
    warning2:'vaseg username-a, npr: palacinkeadmin1',
    imeR:'',
    opisR:'',
    sastojciR:'',

};

const con = mysql.createConnection({
    host: 'localhost', user: 'root', database: 'cooking', port:3308

});

router.post('/novirecept', function(req, res, next) {

  let sqlQChImage=`SELECT count(*)  AS provera FROM recepti WHERE slika='${ req.files.slikaR.name }';`;
    let sql = "INSERT INTO recepti (username, imeRecepta, opis, sastojci, slika) VALUES (";
    sql += "'" + req.cookies['log'] + "', ";
    sql += "'" + req.body.imeR + "', ";
    sql += "'" + req.body.opisR + "', ";
    sql += "'" +  req.body.sastojciR + "', ";
    sql += "'" +  req.files.slikaR.name + "' ";

    sql += ");";

    async function pokreni() {
       let ch=await  pokrenisql(sqlQChImage);
       console.log(ch[0]);
        if(ch[0].provera == 0){
        await pokrenisql(sql);

        req.files.slikaR.mv('C:\\Users\\Choky\\Desktop\\Recepti\\public\\Recepti_Images\\'+req.files.slikaR.name,function (err) {

        });

        res.redirect('/dodaj');
    }else {
            let data1={};
             data1.warning="Ovo ime vec postoji,molimo vas da unesete drugo ime slike";
            data1.opisR=req.body.opisR;
            data1.imeR=req.body.imeR;
            data1.sastojciR=req.body.sastojciR;

            res.render('dodaj',{data:data1,log:{logI:logI,logO:logO},checkLog:cL,user:user});
        }

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
