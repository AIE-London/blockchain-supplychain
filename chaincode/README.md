# Supplychain Chaincode
## Invoke Functions
### addOrder - Adds an order into the supplychain system
#### Arguments: 
* Recipient - String
* Address - String
* SourceWarehouse - String
* DeliveryCompany - String
* Items - JSON {"items" : [{"code" : "123", "description": "Some item"}]}
* Client - String
* Owner - String
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
                 "Test Owner",
                 "40 Holborn Viaduct",
                 "Woking warehouse",
                 "DHL",
                 "{\"items\": [{\"code\": \"123\", \"description\": \"Dove soap\"}]}",
                 "Tesco",
                 "Tutu"
             ]
         },
         "secureContext": "system",
				 "attributes": ["username","role"]
     },
     "id": 2
 }' http://localhost:7050/chaincode`
 
### updateOrderStatus - Updates the order status
#### Arguments: 
* OrderId - String
* StatusType - String (SOURCE | TRANSPORT)
* StatusValue - String
* Comment - String
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
             "function": "updateOrderStatus",
             "args": [
                 "86643e11-fe3e-4c4a-aef1-f91fafd48580",
                 "SOURCE",
                 "PICKED",
                 "Everything picked ok, no issues"
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
 
### getOrderHistory - Retrieves the history for an order
#### Arguments: 
* Order Id - String
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
              "function": "getOrderHistory",
              "args": [
                 "86643e11-fe3e-4c4a-aef1-f91fafd48580"
              ]
          },
          "secureContext": "system",
 				 "attributes": ["username","role"]
      },
      "id": 3
  }' http://localhost:7050/chaincode`
