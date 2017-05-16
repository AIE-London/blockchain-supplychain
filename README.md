# Blockchain-Supplychain

## Setup

This node project contains chaincode and a node app for a supply-chain blockchain demo.

To get setup - just....

Install node dependencies:

```
  npm install
```

Add the array of peers to config.json - in the following format

```
{
 "peers": [{"user": "username_to_connect_with", "endpoint": "host.app.com:5004"}]
}
```

## Usage

Deploy your chaincode to your peers

```
npm run deploy
```

Start server to query chaincode

```
npm start
```

## Querying

A GET request to localhost:3000/ will query the chaincode using the details in config.json