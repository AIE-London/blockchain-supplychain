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
            "name": config.chaincodeHash
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
        res.send(json);
    });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
