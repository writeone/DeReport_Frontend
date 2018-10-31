const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const oracledb = require('oracledb');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

var datatest = '[{"BRH_ID":"06","MM":"มกราคม    ","TAR_AMT":76219047.61904761,"SALE_AMT":86302400},{"BRH_ID":"06","MM":"กุมภาพันธ์","TAR_AMT":75850000,"SALE_AMT":83134897.5},{"BRH_ID":"06","MM":"มีนาคม    ","TAR_AMT":75772727.27272727,"SALE_AMT":95590972.5},{"BRH_ID":"06","MM":"เมษายน    ","TAR_AMT":83842105.26315789,"SALE_AMT":97311965},{"BRH_ID":"06","MM":"พฤษภาคม   ","TAR_AMT":102950000,"SALE_AMT":114487767.5},{"BRH_ID":"06","MM":"มิถุนายน  ","TAR_AMT":93711904.76190476,"SALE_AMT":109893252.5},{"BRH_ID":"06","MM":"กรกฎาคม   ","TAR_AMT":94549999.99999999,"SALE_AMT":104398212.5},{"BRH_ID":"06","MM":"สิงหาคม   ","TAR_AMT":80149999.99999999,"SALE_AMT":107896565},{"BRH_ID":"06","MM":"กันยายน   ","TAR_AMT":76847500,"SALE_AMT":95570787.5},{"BRH_ID":"06","MM":"ตุลาคม    ","TAR_AMT":0,"SALE_AMT":108065970}]';



//กำหนด config
const config = {
    user: "DE",
    password: "DE",
    connectString: "(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=192.168.1.10)(PORT=1521))(CONNECT_DATA=(SERVER=DEDICATED)(SERVICE_NAME=HPDB)))"
}

app.get('/datatest',function (req, res) {
        res.send(datatest);
    })


//เชื่อมต่อ oracledb
function oracleExecute(sqlstatement, res){
    oracledb.getConnection(config, 
        function(err, connection) {
            if (err) console.error(err);
            else {
                connection.execute(sqlstatement, [], { outFormat: oracledb.OBJECT},
                    function (error, result){
                        if (error) console.error(error);
                        else res.send(result.rows);
                        console.log(result.rows);
                        connection.close();
                    });
            }
        });
}


//สร้าง route
app.get('/data',function (req, res) {
    let sqlstatement = `SELECT * from tab`;
    oracleExecute(sqlstatement, res);
})

// app.post('/brh_sale', function (req, res) {
//     let brh_id = req.body.brh_id;
//     let path_no = req.body.path_no;
//     console.log("brh_id : " + brh_id);
//     console.log("path_no : " + path_no);

//     let sqlstatement =
//         `select brh_id, to_char(mdate,'month') mm, sum(sale_amt) sale_amt ` +
//         `from   sa011v ` +
//         `where  brh_id = '${brh_id}' and mdate > trunc(sysdate,'yy')-1 ` +
//         `group by brh_id, mdate ` +
//         `order by brh_id, mdate `;
//     oracleExecute(sqlstatement, res);

// })


app.get('/brh_sale', function (req, res) {
    let sqlstatement =
        `select brh_id, to_char(mdate,'month') mm, sum(tar_sale_amt) tar_amt, sum(sale_amt) sale_amt ` +
        `from   sa011v ` +
        `where  brh_id = 06 and trunc(mdate,'yy') = trunc(sysdate,'yy') ` +
        `group by brh_id, mdate ` +
        `order by brh_id, mdate `;
    oracleExecute(sqlstatement, res);

})



const server = app.listen(1150, function (err) {
    const port = server.address().port;
    console.log('server is running on port : %s', port);
})

