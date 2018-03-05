"use strict"

let constants = require('./constants.js')

function sendFormatted(res, json){
    res.setHeader('Content-Type', 'application/json')
    res.send(JSON.stringify(json, null, 3))
}

function YMDhms(timestamp){
  let res = []
  let temp = timestamp.split(' ')
  for(let i in temp){
    let split = (i == 0) ? temp[i].split('-') : temp[i].split(':')
      for(let j in split) {
        res.push(split[j])
      }
  }
  return res
}

function groupByTime(res, time){
  if(!res[0]) return res
  let toReturn = {}

  for(let i in res){
    let row = res[i]
    let split = row["time"].split('-')
    let ptr = toReturn
    for(let s in split){
      let ind = split[s]
      if(!ptr[ind]){
        ptr[ind] = {}
      }
      ptr = ptr[ind]
    }
    ptr.sum = row.sum
    ptr.count = row.count
  }
  return toReturn
}


function addFuseCapacity(result, fuse, view) {
  //console.log(result)
  let capacity = {};
  capacity["sum"] = 0 //fuse.yearly_upper
  capacity["count"] = 0
  capacity["values"] = {}

  switch(view) {
    case 'year':
      for(let i = 1; i < 13; i++) {
        capacity["values"][i] = fuse.capacity
      }
      break
    case 'month':
      for(let i = 1; i < 32; i++) {
        capacity["values"][i] = fuse.capacity
      }
      break
  }
  result["Capacity"] = capacity
}

function formatFloat(val){
  if(!val) return 0
  return parseFloat(Math.round(val))
}

/**
*/
function getMaxValuePerMonth(result, fuse) {

  let toReturn = {}
  for(let i in result) {
    let split = YMDhms(result[i].timestamp)
    let year = split[0]
    let month = split[1]

    let ins = toReturn
    if(!ins[year]){
      ins[year] = {}
      ins[year]["sum"] = 0
      ins[year]["count"] = 0
      ins[year]["values"] = {}
    }
    ins = ins[year]

    let curr_val = ins["values"][month] ? formatFloat(ins["values"][month]) : 0
    let new_val = formatFloat(result[i].value)
    let sumSoFar = formatFloat(ins["sum"])
    let countSoFar = parseInt(ins["count"])

    ins["sum"] = new_val + sumSoFar
    ins["count"] = 1 + countSoFar

    if(new_val > curr_val) {
      ins["values"][month] = new_val
    }
  }

  addFuseCapacity(toReturn, fuse, 'year')
  return toReturn
}

function getMaxValuePerDay(result, fuse) {

  let toReturn = {}
  for(let i in result) {
    let split = YMDhms(result[i].timestamp)
    let year = split[0]
    let month = split[1]
    let day = split[2]
    let max = 0

    let ins = toReturn
    if(!ins[month]){
      ins[month] = {}
      ins[month]["sum"] = 0
      ins[month]["count"] = 0
      ins[month]["values"] = {}
    }
    ins = ins[month]

    let curr_val = ins["values"][day] ? formatFloat(ins["values"][day]) : 0
    let new_val = formatFloat(result[i].value)
    let sumSoFar = formatFloat(ins["sum"])
    let countSoFar = parseInt(ins["count"])

    ins["sum"] = formatFloat(new_val + sumSoFar)
    ins["count"] = 1 + countSoFar

    if(new_val > curr_val) {
      ins["values"][day] = new_val
    }
  }
  /* Removed because its kind of crushes the graph */
  //addFuseCapacity(toReturn, fuse, 'month')
  return toReturn

}

module.exports = {
  groupByTime,
  sendFormatted,
  getMaxValuePerMonth,
  getMaxValuePerDay
}
