"use strict"
const db = require('./lib/db/db.js')

const express = require('express')
const path = require("path")
var bodyParser = require('body-parser');
const app = express()

app.use(bodyParser.json());

app.set('port', (process.env.PORT || 5000))
/* This servers public/ as static, it will work
for now until we want to pass dynamic content */
app.use(express.static(path.join(__dirname + '/public')))

app.get('/example', async function(req, res) {
  let result = await db.consumptionById('735999114000793384')
  res.send(result)
})

app.get('/example2', async function(req, res) {
  let result = await db.infoById('735999114000793384')
  res.send(result)
})

app.get('/buildings', async function(req, res) {
  let result = await db.getAllBuildings()
  res.send(result)
})

app.get('/buildingsByAddress/:addr', async function(req, res) {
  let result = await db.getBuildingsByAddress(req.params.addr)  
  res.send(result)
})

app.get('/buildingsByFuse/:fuse',async function(req,res){
  let result = await db.getBuildingsByFuse(req.params.fuse)
  res.send(result)
})

app.get('/consumptionById/:id',async function(req,res){
  let result = await db.getConsumptionById(req.params.id)
  res.send(result)
})

/**
example usage:
http://localhost:5000/consumptionOnIntervalById/735999114007366888/2012-01-01/2012-01-01 */
app.get('/consumptionOnIntervalById/:id/:from/:to', async function(req, res) {
  let result = await db.getConsumptionByDate(req.params.id, req.params.from, req.params.to)
  res.send(result)
})


//for DEBUG
app.get('/ttest',async function(req,res){
  let result = await db.getConsumptionById('735999114006654405');
})

//app.post('/search',async function(req,res){
  ////console.log(req.body.idx)
  //let result = await db.consumptionById(req.body.idx)
  ////TODO:later on we can send back building_info at this point
  //res.send(result)
//})

app.get('/hello', function(req, res) {
  res.send("Hello captain")
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port') + " [" + new Date().toLocaleString() + "]")
})
