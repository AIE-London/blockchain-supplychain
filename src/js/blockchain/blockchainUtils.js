var fabricClient = require ('fabric-client');
var fabricCaClient = require('fabric-ca-client');

var client = new fabricClient();
var caClient = new fabricCaClient();

var chain = client.newChain('supply', client);

// TODO some blockchainy stuff
