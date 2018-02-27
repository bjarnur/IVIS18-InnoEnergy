"use strict"

let tables = require('./tableConfigs')

let sqlite3 = require('sqlite3').verbose()
let db = new sqlite3.Database('./secret/db.sqlite')


// const tableName = "consumption"

// const createStatement = "CREATE TABLE " + tableName + " (id, timestamp DATETIME, value)"
/*
* If you want to add your own queries,
* dont forget to add their names to the bottom of this file.
*/
async function consumptionById(id){
  return await generalSelect("SELECT * FROM " + tables["consumption"].tableName + " WHERE id='" + id + "';")
}

async function infoById(id){
  return await generalSelect("SELECT * FROM " + tables["building_info"].tableName + " WHERE id='" + id + "';")
}

async function getAllBuildings() {
 return await generalSelect("SELECT * FROM " + tables["building_info"].tableName + ";") 
}

async function getBuildingsByAddress(address) {
 return await generalSelect("SELECT * FROM " + tables["building_info"].tableName + 
                            " WHERE address like '%" + address + "%';");
}

async function getConsumptionByDate(id, fromDate, toDate) {
 return await generalSelect("SELECT * FROM " + tables["consumption"].tableName + 
                            " WHERE id == '" + id + "'"  + 
                            " AND timestamp >= '" + fromDate + "'" +
                            " AND timestamp <= '" + toDate + "';"); 
}

/*
* Use this helper function by specifying a SQL query.
* Notice the use of async/await. Other sources of errors are invalid SQL statements.
*/
function generalSelect(sql){
  console.log(sql)
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
  })
  })
}

function createTable(tableConfig) {
  if(!tableConfig.createStatement)[
    console.error("No createStatement in " + tableConfig)
  ]

  return new Promise(resolve => {
    console.log("Fresh run, building tables")
    db.serialize(function() {
      db.run(tableConfig.createStatement)
    }, function(err){
      console.log("Table creation error " + err)
    })
  })
}

function isEmpty(tableConfig) {
  if(!tableConfig.tableName){
    console.error("No tableName in " + tableConfig)
  }

  return new Promise(resolve => {
  db.serialize(function() {
    db.each("SELECT count(*) AS n FROM "+ tableConfig.tableName, function(err, row) {
      if(err){
        console.log(err)
        reject(err)
      } else if (row.n == "0"){
        resolve(true)
      }
      console.log(tableConfig.tableName + " has " + row.n + " entries")
      resolve(false)
    })
  })
  })
}

function countDistinct(tableConfig, columnName) {
  if(!tableConfig.tableName){
    console.error("No tableName in " + tableConfig)
  }

  return new Promise(resolve => {
  db.serialize(function() {    
    db.each(
      "SELECT count(distinct(" + columnName + ")) AS n FROM "+ tableConfig.tableName + "", 
      function(err, row) {
        if(err){
            console.log(err)
            reject(err)
        } else if (row.n == "0"){
        resolve(true)
      }
      console.log(tableConfig.tableName + " has " + row.n + " distinct building IDs")
      resolve(false)
    })
  })
  })
}

/**
* Initializes the database by inspecting if a table exists.
* If it doesn't, it creates it.
* Returns true if successful, otherwise the error message.
*/
function initBackend(tableConfig) {
  if(!tableConfig.tableName){
    console.error("No tableName in " + tableConfig)
  }

  return new Promise(resolve => {
      let freshRun = true
    db.serialize(function() {
      db.each("SELECT count(*) AS n FROM sqlite_master WHERE type='table' AND name='" + tableConfig.tableName + "'", function(err, row) {
          if (err) {
            return err
          } else if(row.n == "1") {
            freshRun = false
          }
          if (freshRun){
            createTable(tableConfig)
          }
          resolve(true)
      })
    })
  })

}

function massInsert(fields, tableConfig){
  if(!tableConfig.insertStatement || !tableConfig.insertRunStatement){
    console.error("No insertStatement or insertRunStatement in " + tableConfig)
  }

  return new Promise(resolve => {
    db.serialize(function() {
      db.run("begin transaction")
      for(var i in fields){
        var stmt = db.prepare(tableConfig.insertStatement)
        tableConfig.insertRunStatement(stmt, fields, i)
        stmt.finalize()
      }
      db.run("commit")
    })
      resolve();
  })
}

/**
  Returns true if the provided table has a colum with the provided name */
function containsColumn(tableConfig, columnName) {  
  if(!tableConfig.createStatement){
    console.error("No createStatement in " + tableConfig)
  }

  var stmt = tableConfig.createStatement
  var idx_start = stmt.indexOf("(");
  var args_string = stmt.substring(idx_start + 1, stmt.length - 1)
  var args = args_string.split(",")
  for(var i = 0; i < args.length; i++) {
      if(args[i] == columnName) {
        return true;
      }
  }
  return false;
}

function close() {
  db.close()
}

module.exports = {
  consumptionById,
  infoById, 
  getAllBuildings, 
  getBuildingsByAddress,
  getConsumptionByDate,
  initBackend,
  isEmpty,
  countDistinct,
  massInsert,
  containsColumn,
  close
}
