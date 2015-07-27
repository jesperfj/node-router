var express = require('express');
var app = express();
var request = require('request');
var instanceip = require('./instanceip');

var bodyParser = require('body-parser')

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

// An instance will have many network interfaces and IP addresses assigned.
// For now, we determine the correct IP address by matching against a CIDR block

var ip = instanceip(process.env.CIDR_BLOCK || "127.0.0.0/8")

console.log("Local IP: "+ip)

var nodes = []

app.set('port', (process.env.PORT || 5000));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.post('/register', function(req,res) {
	nodes.push(req.body.ip)
	console.log("%j", nodes)
});

app.get('/node/:node/:key', function(req,res) {
	var proxy = "http://"+nodes[parseInt(req.params.node)]+":5001/keys/"+req.params.key
	console.log("Proxying to "+proxy)
	request.get(proxy).pipe(res)
});

app.put('/node/:node/:key', function(req,res) {
	var proxy = "http://"+nodes[parseInt(req.params.node)]+":5001/keys/"+req.params.key
	console.log("Proxying to "+proxy)
	request.put(proxy).form(req.body).pipe(res)
});

app.get('/node/:node', function(req, res) {
	var proxy = "http://"+nodes[parseInt(req.params.node)]+":5001"
	console.log("Proxying to "+proxy)
	request.get(proxy).pipe(res)
});

app.get('/', function(req, res) {
  res.send("PUT /node/:number/:key {value: 'value'}\nGET /node/:number/:key");
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


