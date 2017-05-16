var express = require('express');
var app = express();
const port = process.env.PORT || 8080;

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

app.listen(port);
console.log("Listening on port ", port);