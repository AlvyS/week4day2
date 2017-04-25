const pg = require("pg");
const settings = require("./settings"); // settings.json

//----------------------------------------- Connects to default PSQL Vagrant DB -------------------------------------------// 
const client = new pg.Client({
  user     : settings.user,
  password : settings.password,
  database : settings.database,
  host     : settings.hostname,
  port     : settings.port,
  ssl      : settings.ssl
});


const input = process.argv[2];


//-------------------------------------------- Connects to DB and Queries ------------------------------------------------//
function findName(name, callback) {
  client.connect((err) => {
  if (err) {
    return console.error("Connection Error", err);
  }
  console.log("Searching...")
  client.query("SELECT * from famous_people WHERE first_name = $1::text OR last_name = $1::text", [input], (err, result) => {
    if (err) {
      return console.error("error running query", err);
    }
    callback(result.rows);
    client.end();
    });
  });
}


//------------------------------ Used as callback, logs results of queries to required format ----------------------------//
function printName(resultList) {
  console.log(`Found ${resultList.length} resultList(s) by the name '${input}'`);
  for (let i = 0; i < resultList.length; i++) { //  for in loop results in logging 01, 11, 21, 31
    console.log(`- ${[i + 1]}: ${resultList[i].first_name} ${resultList[i].last_name}, born '${resultList[i].birthdate}'`);
  }
}


//----- call function + cb
findName(input, printName);