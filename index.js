const express = require('express');
const sql = require("mssql");
const app = express();
const bodyParser = require('body-parser');
const csv = require('csv-parser');
const { parse } = require('csv-parse');
const fs = require('fs');
const axios = require('axios');
const path = require('path');
const { response } = require('express');
const result = [];
const cors = require("cors");
var router = express.Router();
var lineReader = require('line-reader');
var account1 = 'G1';

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

var Secondside = "C:/Users/roncharles.penaranda/Desktop/2ndSide/";

var routesPath = require("./api");
const { text } = require('body-parser');

app.use("/api", routesPath);

var timer = 1, timer = timer * 1000;

setInterval(function(){

    getPath(account1);

},timer);



async function getPath(account){
    const data = await axios
    .get('http://localhost:4000/api/filepath/' + account)
    .then(response =>{

      try{
        var convert_data = JSON.stringify(response.data);
        var unitdata = JSON.parse(convert_data);

        readFiles(unitdata.data[0].extractpath,unitdata.data[0].donepath);

      }catch{

      }
});
}


async function postValueHistory(account,cardno,line,sequence,station,machine,statuss,lastupdate,lastupdatedby){
  const data = await axios
  .get('http://localhost:4000/api/addhistory/logpass/' + account +'/'+cardno+'/'+line+'/'+sequence+'/'+station+'/'+machine+'/'+statuss+'/' + lastupdate + '/' + lastupdatedby)
  .then(response =>{
  console.log('History registered');

});
}


async function readFiles(main,dirpath){

fs.readdir(main, (err, files) => {
  process.on('uncaughtException', function (exception) {
  });
      fs.readdir(main,(err,files)=>{
          for(var i = 0; i < files.length; i++){

            readData(main+files[i],dirpath+files[i],Secondside+files[i]);
            console.log(files[i]);
            
        } 

      })
});
}


async function readData(filesdata,filesmove,secondSide){

      fs.createReadStream(filesdata)
      .pipe(parse({ delimiter: ",", from_line: 2 }))
      .on("data", function (row) {

        var date = row[2] + "/" + row[4];
        var dateconv = date.split("/")
        var dateconverted = dateconv[2] + "-" + dateconv[0] + "-" + dateconv[1] + " " + dateconv[3];

        var side = row[6].split("_")

        if(side[1] == "1STSIDE"){

          postValueHistory(account1,row[0],"15","1","AOI2","LANE2",row[7],dateconverted,"Ron");
          console.log(row);
          
          if(row[0] != ''){
            movedFiles(filesdata,filesmove);  
          }

        }
        if(side[1] == "2NDSIDE"){

          movedFiles(filesdata,secondSide); 

        }

      });

  }

  async function movedFiles(mainpath,donepath){

          fs.rename(mainpath, donepath,function (err) {
          process.on('uncaughtException', function (exception) {
          });
              console.log(item);
          })
}



app.post("/create", (req, res) => {

  const line = req.body.line;
  const station = req.body.station;
  const extractpath = req.body.extractpath;
  const donepath = req.body.donepath;
  const username = req.body.username;

  db.query(
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


app.listen(4000, () =>{
    console.log("Server is Listening to Port 4000")
});