"use strict"

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

function sumj(json){
    let sum = 0.0
    let count = 0
    Object.keys(json).forEach(function(key){
      //console.log(json)
      sum = sum + parseFloat(json[key].value)
      count++
    })
    return {sum, count}
}
/**
* We look for the timestamp in the children's children:
* if they occur, we overwrite the children with a sum
* of the children's children.
*/
function subSum(json){
  let keys = Object.keys(json)
  for(let i in keys){
    let key = keys[i]
    let deepKeys = Object.keys(json[key])
    let deepJ = json[key]

    for(let j in deepKeys){
      let deepKey = deepKeys[j]

      if(!deepJ[deepKey].hasOwnProperty('timestamp')){
        subSum(deepJ)
      } else {
        json[key] = sumj(deepJ)
      }
    }
  }
}

function groupBy(result, depth){
  let toReturn = {}
  /* First we split the original data into subcategories without changing the content,
  down to the required depth */
  for(let i in result) {
    let split = YMDhms(result[i].timestamp)
    let ins = toReturn
    for(let j = 0; j <= depth; j++){
      let key = split[j]
      if(!ins[key]){
        ins[key] = {}
      }
      ins = ins[key]
    }
    let timestamp = result[i].timestamp
    let value = result[i].value
    ins[timestamp] = {timestamp, value}
    }
  /* Then we pass the structure to recursively sum where a timestamp occurs */
  subSum(toReturn)

  return toReturn
}
/*
* This method requires a "timestamp" and a "value" key pair in the data.
* Note that the keys are not ordered chronologically.
*/
function groupByTime(result, time){
    let depth = 0
    switch(time){
      case 'year':
        depth = 0
        break
      case 'month':
        depth = 1
        break
      case 'day':
        depth = 2
        break
      default:
        return result
    }

    let toReturn = {}
    return groupBy(result, depth)
}

/**
*/
function getMaxValuePerMonth(result) {
  
  let toReturn = {}
  //console.log(result)

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

    let curr_val = ins["values"][month] ? parseInt(ins["values"][month]) : 0
    let new_val = parseInt(result[i].value)    
    let sumSoFar = parseInt(ins["sum"])
    let countSoFar = parseInt(ins["count"])
    
    ins["sum"] = new_val + sumSoFar    
    ins["count"] = 1 + countSoFar

    if(new_val > curr_val) {    
      ins["values"][month] = new_val
    }
  }
  //console.log(toReturn)
  return toReturn
}

function getMaxValuePerDay(result) {
  
  let toReturn = {}
  //console.log(result)
  
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
    
    let curr_val = ins["values"][day] ? parseInt(ins["values"][day]) : 0
    let new_val = parseInt(result[i].value)
    let sumSoFar = parseInt(ins["sum"])
    let countSoFar = parseInt(ins["count"])
    
    ins["sum"] = new_val + sumSoFar    
    ins["count"] = 1 + countSoFar

    if(new_val > curr_val) {    
      ins["values"][day] = new_val
    }
  }
  //console.log(toReturn)
  return toReturn

}

module.exports = {
  groupByTime,
  sendFormatted,
  getMaxValuePerMonth,
  getMaxValuePerDay
}
