"use strict"

const LineByLineReader = require('line-by-line')
const fs = require('fs')
const db = require('./db')
const tables = require('./tableConfigs')
const constants = require('./constants')

const INSERT_BATCH_SIZE=10e5 /* If you run out of heap memory this is the number to lower */
const startTime = new Date().toLocaleString()

let toInsert = []
let ids = []
let lineCount = 0
let lastStage = false

function exitWithError(msg) {
  console.log("Error: " + msg)
  db.close()
  process.exit(1)
}

async function stage(tableConfig, force){
  if(!force && toInsert.length < INSERT_BATCH_SIZE)
    return
  if(constants.DEBUG) console.log("--Mass inserting " + toInsert.length + " elements")
  await db.massInsert(toInsert, tableConfig)
  toInsert = []
  if (force) {
    ids = []
    lineCount = 0
  }
}

async function parseData(tableConfig) {
  if(!tableConfig.onParseLine || !tableConfig.dataLocation){
    console.error("No onParseLine function or dataLocation value in " + tableConfig)
  }
  return new Promise(resolve => {
    let lr = new LineByLineReader(tableConfig.dataLocation)

    lr.on('line', function (line) {
      /* We have to pause and unpause otherwise node will kill the subthreads */
      lr.pause()
      tableConfig.onParseLine(line, lineCount, ids, toInsert, function (newIds) {
        if(constants.DEBUG) console.log("--setIds: " + ids.length + " is replaced by " + newIds.length + " elements")
        ids = newIds
      }, async function(){
         await stage(tableConfig)
      })
      lr.on('end', async function () {
        /* this method keeps polling when stage is async */
        if(lastStage)
          return
        lastStage = true
        if(constants.DEBUG) console.log("--lastStage: was called with " + toInsert.length + " elements to insert")
        await stage(tableConfig, lastStage)
        resolve(true)
      })
      /* We have to pause and unpause otherwise node will kill the subthreads */
      setTimeout(function () {
    		// ...and continue emitting lines.
    		lr.resume()
    	}, 1)
      if(console.clear && !constants.DEBUG){
        console.clear()
      }
      if(!constants.DEBUG){
        console.log("Finished queueing row: " + lineCount + ". Please wait for the program to finish ")
        console.log("and the webserver to start, some jobs are still running.")
        console.log("Early termination will result in missing data points.")
        console.log("Jobs have been running since [" + startTime + "]")
      }

      lineCount++
    }).on('error', function(e){
      console.log("error in parsing line data when reading file " + e)
    })

  })
}

async function run() {
  for(let i in tables){
    let status = await db.initBackend(tables[i])
    if (status !== true)
      exitWithError(status)
    let empty = await db.isEmpty(tables[i])
    if(empty){
      await parseData(tables[i])
    }
    if(constants.DEBUG)
      empty = await db.isEmpty(tables[i])
  }
  db.close()
}
run()
