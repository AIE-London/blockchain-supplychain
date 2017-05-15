let hfc = require('hfc');

var express = require('express');
var app = express();
let fetch = require('node-fetch');

const config = require('./config.json');

app.get('/', function (req, res) {
    let body = {
        "jsonrpc": "2.0",
        "method": "query",
        "params": {
            "type": 1,
            "chaincodeID": {
            "name": "3aeb9793d67968f966f2b093c361c70cdbf7a2813a02f7a5da344386580d3b519899b73003b335c587e3d016d44b54eb7d8030bddddbc3e9abf05db81c20eaef"
            },
            "ctorMsg": {
            "function": "read",
            "args": [
                "hello_world"
            ]
            },
            "secureContext": "admin"
        },
        "id": 2
    };
    // get from HFC
    fetch("https://" + config.peers[0] + "/chaincode", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(response => {
        return response.json();
    }).then(json => {
        res.send(JSON.stringify(json));
    });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
