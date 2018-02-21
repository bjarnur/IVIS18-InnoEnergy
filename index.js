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
  let result = await db.infoById('735999114006906917')
  res.send(result)
})

app.get('/map', async function(req,res){
  // need to do some interaction between front-end and back-end
  res.sendFile('geomap.html',{root:path.join(__dirname + '/public' )});
})

app.post('/map',async function(req,res){
  let result = await db.consumptionById(req.body.idx)
  console.log(result) // need to pass this to d3 frontend
})

app.get('/hello', function(req, res) {
  res.send("Hello captain")
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port') + " [" + new Date().toLocaleString() + "]")
})
