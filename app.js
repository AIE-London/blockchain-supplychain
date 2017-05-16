var express = require('express');
var app = express();

const blockchain = require('./utils/blockchain-helpers.js');

const config = require('./config.json');

app.get('/', function (req, res) {
    blockchain.query(config.peers[0].endpoint, config.chaincodeHash, config.peers[0].user, "read", ["hello_world"])
        .then(json => res.send(json))
        .catch(error => {
            console.log(error);
            res.send({ error: error.message});
        });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
