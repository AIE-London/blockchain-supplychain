let fs = require('fs');
let fetch = require('node-fetch');

const blockchain = require('./utils/blockchain-helpers.js');
const config = require('./config.json');

blockchain.deploy(config.peers[0].endpoint,
    "https://github.com/IBM-Blockchain/learn-chaincode/finished",
    config.peers[0].user,
    ["hi there"]).then(result => console.log(result));

