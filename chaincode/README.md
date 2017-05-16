# Chaincode Invoke Functions
## addOrder - Adds an order into the supplychain system
### Arguments: 
* Recipient - String
* Address - String
* SourceWarehouse - String
* DeliveryCompany - String
* Items - JSON {"items" : [{"code" : "123", "description": "Some item"}]}

# Chaincode Query Functions
## getOrder - Retrieves a single order via order id
### Arguments: 
* Order Id - String

## getAllOrders - Retrieves all the orders in the system
