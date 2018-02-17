"use strict"

/* This path is relative to the root when doing npm start */
//const dataLocation = "secret/el_07_07_2017.csv"
const dataLocation = "secret/sample500.csv"


var LineByLineReader = require('line-by-line')
const fs = require('fs')
const db = require('./db')

const NO_DATA = -1.0
const INSERT_BATCH_SIZE=10e5 /* If you run out of heap memory this is the number to lower */
const startTime = new Date().toLocaleString()

let lineCount = 0
let toInsert = []
let lastStage = false

function exitWithError(msg) {
  console.log("Error: " + msg)
  db.close()
  process.exit(1)
}

function stage(force){
  if(!force && toInsert.length < INSERT_BATCH_SIZE)
    return
  db.massInsert(toInsert);
  toInsert = []
}

function parseConsumptionData() {
  let ids = []
  let lr = new LineByLineReader(dataLocation)

  lr.on('line', function (line) {
    /* We have to pause and unpause otherwise node will kill the subthreads */
    lr.pause()
    if ( lineCount == 0 ) {
      /* This is ID row, the first field is not an id */
      ids = line.split(',')
    } else {
      let fields = line.split(',')
      let date = fields[0]
      for(let i = 1; i < fields.length; i++){
        let value = fields[i] ? fields[i] : NO_DATA;
        //console.log(ids[i], date, value)
        toInsert.push({"id": ids[i], "date": date, "value": value})
      }
      stage()
    }
    lr.on('end', function () {
      /* this method keeps polling when stage is async */
      if(lastStage)
        return
      lastStage = true
      stage(lastStage)
    });
    /* We have to pause and unpause otherwise node will kill the subthreads */
    setTimeout(function () {
  		// ...and continue emitting lines.
  		lr.resume()
  	}, 1)
    if(console.clear){
      console.clear()
    }
    console.log("Finished queueing row: " + lineCount + ". Please wait for the program to finish ")
    console.log("and the webserver to start, some jobs are still running.")
    console.log("Early termination will result in missing data points.");
    console.log("Jobs have been running since ["+ startTime + "]")

    lineCount++
  }).on('error', function(e){
    console.log("error in parsing line data when reading file " + e)
  })
}

async function run() {
  let status = await db.initBackend()
  if (status !== true)
    exitWithError(status)
  let empty = await db.isEmpty()
  if(empty)
    parseConsumptionData()
}
run()
