const fetch = require('node-fetch');

const jsonfile = require('./utils/jsonfile.js');
const blockchain = require('./utils/blockchain-helpers.js');
const configLocation = './config.json';
const config = require(configLocation);

const deployMainChaincode = crudHash => {
  console.log("[DEPLOY] Deploying Main chaincode");
  return blockchain.deploy(config.peers[0].endpoint,
    "https://github.com/Capgemini-AIE/blockchain-supplychain/chaincode/supplychain_main",
    config.peers[0].user,
    [crudHash])
    .then(result => {
      console.log("[DEPLOY] Chaincode Deployed Successfully");
      // Read existing config return in and object along with api call result
      return jsonfile.read(configLocation).then(json => ({
        file: json,
        hash: result
      }));
    })
    .then(result => {
      let newConfigData = Object.assign({}, result.file, { chaincodeHash: result.hash, crudHash: crudHash });
      return jsonfile.write(configLocation, newConfigData);
    }).catch(error => {
      console.error("[DEPLOY] Chaincode deployment failed with error:");
      console.error(error);
    });
}

if (process.env.CRUD_HASH) {
  deployMainChaincode(process.env.CRUD_HASH);
} else {
  console.log("[DEPLOY] Deploying CRUD chaincode");
  blockchain.deploy(config.peers[0].endpoint,
    "https://github.com/Capgemini-AIE/blockchain-supplychain/chaincode/supplychain_crud",
    config.peers[0].user,
    [])
    .then(deployMainChaincode)
    .catch(error => {
      console.error("[DEPLOY] Deploy of CRUD chaincode failed with error:");
      console.error(error);
    });
}