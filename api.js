const router = require('express').Router();
const sql = require("mssql");
const config = require("./db");



router.get("/filepath/:account", async (req, res) => {
    try {
        await sql.connect(config);
        const result = await sql.query("SELECT * FROM extracttable where account = '"+[req.params.account]+"'");
        res.send({
            data: result.recordset
        })
    } catch(err)
    {
        res.send(err);
    }
});

router.get("/addhistory/logpass/:account/:cardno/:line/:sequence/:station/:machine/:status/:lastupdate/:lastupdatedby", async (req, res) => {
    try {

        const account = req.params.account;
        const cardno = req.params.cardno;
        const line = req.params.line;
        const sequence = req.params.sequence;
        const station = req.params.station;
        const machine = req.params.machine;
        const status = req.params.status;
        const lastupdate = req.params.lastupdate;
        const lastupdatedby = req.params.lastupdatedby;

        await sql.connect(config);
        const result = await sql.query("INSERT INTO log_pass (account,cardno,line,sequence,station,machine,status,lastupdate,lastupdatedby) VALUES ('"+account+"','"+cardno+"','"+line+"','"+sequence+"','"+station+"','"+machine+"','"+status+"',CONVERT(datetime,'"+lastupdate+"'),'"+lastupdatedby+"')");
        res.send(result);
    } catch(err)
    {
        res.send(err);
    }
});

router.post("/create", (req, res) => {

    const line = req.body.line;
    const station = req.body.station;
    const extractpath = req.body.extractpath;
    const donepath = req.body.donepath;
    const username = req.body.username;

    config.query(
      "INSERT INTO extracttable (account, line, station,extractpath, donepath, lastupdate,lastupdatedby) VALUES ('G1',?,?,?,?,GETDATE(),?)",
      [line,station,extractpath,donepath,username],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send("Values Inserted");
        }
      }
    );
  });


module.exports = router;

