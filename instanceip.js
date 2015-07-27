var os = require('os');
var ifaces = os.networkInterfaces();
var c = require('cidr_match');

// Go through all IP addresses assigned to all interfaces and find the one
// which is in cidr_block. There is hopefully only one.
module.exports = function(cidr_block) {
	return [].concat.apply([],Object.keys(ifaces).map(function(k) { return ifaces[k];})).filter(function(e) { return c.cidr_match(e.address,cidr_block); })[0].address
}
