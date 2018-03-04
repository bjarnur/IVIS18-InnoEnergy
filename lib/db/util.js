"use strict"

function sendFormatted(res, json){
    res.setHeader('Content-Type', 'application/json')
    res.send(JSON.stringify(json, null, 3))
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

module.exports = {
  groupByTime,
  sendFormatted
}
