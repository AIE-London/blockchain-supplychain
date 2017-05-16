let fetch = require('node-fetch');

let deployChaincode = (peerEndpoint, chaincodePath, username, args) => {
    return fetch(`https://${peerEndpoint}/chaincode`, {
        method: 'POST',
        body: JSON.stringify({
            "jsonrpc": "2.0",
            "method": "deploy",
            "params": {
                "type": 1,
                "chaincodeID": {
                    "path": chaincodePath
                },
                "ctorMsg": {
                    "function": "init",
                    "args": args
                },
                "secureContext": username
            },
            "id": 1
        }),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(jsonResponse => jsonResponse.result.message);
}

let queryChaincode = (peerEndpoint, chaincodeHash, username, functionName, functionArgs) => {
    return fetch(`https://${peerEndpoint}/chaincode`, {
        method: 'POST',
        body: JSON.stringify({
            "jsonrpc": "2.0",
            "method": "query",
            "params": {
                "type": 1,
                "chaincodeID": {
                    "name": chaincodeHash
                },
                "ctorMsg": {
                    "function": functionName,
                    "args": functionArgs
                },
                "secureContext": username
            },
            "id": 0
        }),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json());
}


module.exports = {
    deploy: deployChaincode,
    query: queryChaincode
};