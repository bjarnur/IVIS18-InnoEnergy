"use strict"

const express = require('express')
const path = require("path")
const app = express()

app.set('port', (process.env.PORT || 5000))
/* This servers public/ as static, it will work
for now until we want to pass dynamic content */
app.use(express.static(path.join(__dirname + '/public')))

app.get('/hello', function(req, res) {
  res.send("Hello captain")
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
