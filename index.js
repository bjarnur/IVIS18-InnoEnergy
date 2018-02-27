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
  let result = await db.consumptionById('735999114007366888')
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

app.get('/map', async function(req,res){
  res.sendFile('geomap.html',{root:path.join(__dirname + '/public' )});
})

app.get('/demo', async function(req,res){
  res.sendFile('demo.html',{root:path.join(__dirname + '/public' )});
})

app.post('/search',async function(req,res){
  console.log(req.body.idx)
  let result = await db.consumptionById(req.body.idx)
  //TODO:later on we can send back building_info at this point
  res.send(result)
})

app.get('/hello', function(req, res) {
  res.send("Hello captain")
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port') + " [" + new Date().toLocaleString() + "]")
})
