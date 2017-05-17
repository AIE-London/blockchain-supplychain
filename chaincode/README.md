# Supplychain Chaincode
## Invoke Functions
### addOrder - Adds an order into the supplychain system
#### Arguments: 
* Recipient - String
* Address - String
* SourceWarehouse - String
* DeliveryCompany - String
* Items - JSON {"items" : [{"code" : "123", "description": "Some item"}]}
#### Sample Curl Command
`curl -H "Content-Type: application/json" -X POST -d '{
     "jsonrpc": "2.0",
     "method": "invoke",
     "params": {
         "type": 1,
         "chaincodeID": {
             "name": "supplychain"
         },
         "ctorMsg": {
             "function": "addOrder",
             "args": [
                 "Joe Bloggs",
                 "10 Downing Street",
                 "Cardiff",
                 "DPD",
                 "{\"items\": [{\"code\": \"123\", \"description\": \"Hydrochloric Acid\"}]}"
             ]
         },
         "secureContext": "system",
				 "attributes": ["username","role"]
     },
     "id": 2
 }' http://localhost:7050/chaincode`

## Chaincode Query Functions
### getOrder - Retrieves a single order via order id
#### Arguments: 
* Order Id - String
#### Sample Curl Command
` curl -H "Content-Type: application/json" -X POST -d '{
      "jsonrpc": "2.0",
      "method": "query",
      "params": {
          "type": 1,
          "chaincodeID": {
              "name": "supplychain"
          },
          "ctorMsg": {
              "function": "getOrder",
              "args": [
                 "ce72eacc-cd97-441a-89a5-40ea18629c8b"
              ]
          },
          "secureContext": "system",
 				 "attributes": ["username","role"]
      },
      "id": 3
  }' http://localhost:7050/chaincode`

### getAllOrders - Retrieves all the orders in the system
#### Sample Curl Command
`curl -H "Content-Type: application/json" -X POST -d '{
      "jsonrpc": "2.0",
      "method": "query",
      "params": {
          "type": 1,
          "chaincodeID": {
              "name": "supplychain"
          },
          "ctorMsg": {
              "function": "getAllOrders"
          },
          "secureContext": "system",
 				 "attributes": ["username","role"]
      },
      "id": 3
  }' http://localhost:7050/chaincode`
