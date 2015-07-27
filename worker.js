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


var registry = process.env.REGISTRY || "http://localhost:5000"

var state = {}

// We arbitrarily decide that our workers will all listen on 5001.
app.set('port', (5001));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
	res.render('pages/index');
});

app.get('/keys/:key', function(req,res) {
	console.log(state)
	res.send(state[req.params.key])
});

app.put('/keys/:key', function(req,res) {
	console.log(req.body.value)
	state[req.params.key] = req.body.value
	console.log(state)
	res.send(state[req.params.key])
});

// primitive registration. Only trying once and putting in a 1 sec delay hoping it's enough for
// web process to come up first if they're racing.
setTimeout(function() {
	request.post(registry+'/register', {form:{ip: ip}})
},1000)

app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});
