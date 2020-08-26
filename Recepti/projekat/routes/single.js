var express = require('express');
var router = express.Router();
var mysql = require('mysql');
/* GET home page. */
let logO;
let logI;
let cL;
let user ="";
const con = mysql.createConnection({
    host: 'localhost', user: 'root', database: 'cooking', port:3308

});
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('single');
});

router.get('/:id', function(req, res, next) {

    async function pokreni() {
        if(req.cookies["log"]!=undefined){
            logO='Logout';
            logI='/login/logout';
            user=req.cookies["log"];
    cL=1;
        }else{
            logO='Login';
            logI='/login';
         user ="";
        cL=0;
        }
        let sqlP = `SELECT  count(*)  AS provera from ocenjivanje where idR='${req.params.id}' and usernameWho='${ req.cookies["log"]}';`;
        let sqlOcena = `SELECT rate FROM ocenjivanje where idR='${req.params.id}' and usernameWho='${ req.cookies["log"]}';`;
        let ocenaP= await pokrenisql(sqlP);
        let ocena;
        if(ocenaP[0].provera==0){
            ocena=[{
                rate:1
            }];
        }else{
            ocena= await pokrenisql(sqlOcena);
        }

        console.log(ocena[0].rate);
        let sql = `SELECT * FROM recepti where id='${req.params.id}';`;
        let allR= await pokrenisql(sql);

        res.render('single',{allR:allR,log:{logI:logI,logO:logO},ocena:ocena,checkLog:cL,user:user});

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
function updateOcena(id){
    let sql =`SELECT AVG(rate) as prosek FROM ocenjivanje WHERE idR='${id}'`;
    async function pokreni() {
        let rez= await pokrenisql(sql);

       let uQ= `UPDATE  recepti SET ocena='${rez[0].prosek}' where id='${id}';`;
      await pokrenisql(uQ);
    }
    pokreni();
}
router.post('/oceni/:id', function(req, res, next) {
    let sql1 = "INSERT INTO ocenjivanje (usernameWho,idR,rate)value(";
    sql1 += "'" + req.cookies["log"] + "', ";
    sql1 += "'" + req.params.id + "', ";
    sql1 += "'" + req.body.ocena + "');";

    let sql = `SELECT  count(*)  AS provera from ocenjivanje where idR='${req.params.id}' and usernameWho='${ req.cookies["log"]}';`;
    let sqlU = `UPDATE  ocenjivanje SET rate='${req.body.ocena}' where idR='${req.params.id}' and usernameWho='${ req.cookies["log"]}';`;
    async function pokreni() {


        let provera= await pokrenisql(sql);
        console.log(provera[0].provera);
        if(provera[0].provera==0){
            await pokrenisql(sql1);
            updateOcena(req.params.id);
            res.redirect('/single/'+req.params.id);
        }else{

            await pokrenisql(sqlU);
            updateOcena(req.params.id);
            res.redirect('/single/'+req.params.id);
        }




    }
    pokreni();


});



router.get('/delete/:id', function(req, res, next) {

    async function pokreni() {

let sql=`DELETE FROM recepti WHERE id='${req.params.id}';`;
       await pokrenisql(sql);


res.redirect('/user-upload');


    }
    pokreni();


});

module.exports = router;
