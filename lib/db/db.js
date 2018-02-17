"use strict"

let sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./secret/db.sqlite');

const tableName = "consumption"

const createStatement = "CREATE TABLE " + tableName + " (id, timestamp DATETIME, value)"
/*
* If you want to add your own queries,
* dont forget to add their names to the bottom of this file.
*/
async function queryById(id){
  return await generalSelect("SELECT * FROM " + tableName + " WHERE id='" + id + "';")
}
/*
* Use this helper function by specifying a SQL query.
* Notice the use of async/await. Other sources of errors are invalid SQL statements.
*/
function generalSelect(sql){
  return new Promise(resolve => {
  db.serialize(function() {
    var result = []
    db.each(sql, function(err, row) {
      if(err){
        console.log(err)
      }
      result.push(row)
    }, function(){
      resolve(result)
    })
  });
  })
}

function createTable() {
  return new Promise(resolve => {
    console.log("Fresh run, building tables")
    db.serialize(function() {
      db.run(createStatement);
    }, function(err){
      console.log("Table creation error " + err)
    });
  });
}

function isEmpty() {
  return new Promise(resolve => {
  db.serialize(function() {
    db.each("SELECT count(*) AS n FROM "+ tableName, function(err, row) {
      if(err){
        console.log(err)
        reject(err);
      } else if (row.n == "0"){
        resolve(true);
      }
      console.log("Table has " + row.n + " entries")
      resolve(false);
    })
  });
  })
}
/**
* Initializes the database by inspecting if a table exists.
* If it doesn't, it creates it.
* Returns true if successful, otherwise the error message.
*/
function initBackend() {
  return new Promise(resolve => {
      let freshRun = true
    db.serialize(function() {
      db.each("SELECT count(*) AS n FROM sqlite_master WHERE type='table' AND name='" + tableName + "'", function(err, row) {
          if (err) {
            return err
          } else if(row.n == "1") {
            freshRun = false
          }
          if (freshRun){
            createTable();
          }
          resolve(true);
      });
    });
  })

}

function massInsert(fields){
  return new Promise(resolve => {
    db.run("begin transaction")
    for(var i in fields){
      var stmt = db.prepare("INSERT INTO " + tableName + " VALUES (?,?,?)")
      stmt.run(fields[i].id, fields[i].date, fields[i].value)
      stmt.finalize()
    }
    db.run("commit")
      resolve();
  })
}

function insert(id, date, value){
  return new Promise(resolve => {
    db.serialize(function() {
      db.run("INSERT INTO " + tableName + " VALUES (?,?,?)", id, date, value, function(err){
        if (err) reject(err)
        resolve();
      })
    })
  })
}

function close() {
  db.close()
}

module.exports = {
  queryById,
  initBackend,
  isEmpty,
  insert,
  massInsert,
  close
}
