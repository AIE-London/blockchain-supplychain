let express = require('express');
const bodyParser = require('body-parser');
let app = express();

/*
    Grab config
*/
const config = require('./config.json');
const swaggerDefinition = require('./swaggerConfig.json');

/*
    Import utilities
*/
const blockchain = require('./utils/blockchain-helpers.js');
const schema = require('./utils/schema-helpers.js');
const expressMiddleware = require('./utils/express-middleware.js');
const date = require('./utils/date-helpers.js');

/**
 * JSON Schema Validation
 */
const validate = require('express-jsonschema').validate;
let schemas = {};
schemas.orderCreateSchema = require("./schemas/orderCreateSchema.json");
schemas.orderStatusUpdateSchema = require("./schemas/orderStatusUpdateSchema.json");

/**
 * Swagger Configuration
 */

// Import SwaggerJSDoc
let swaggerJSDoc = require('swagger-jsdoc');


// Options for the swagger docs
let options = {
    swaggerDefinition: swaggerDefinition,
    apis: ['app.js'] // Self documenting within code
};

// Initialize Swagger-jsdoc
let swaggerSpec = swaggerJSDoc(options);

// Setup swagger schemas
// Re-use validation-schemas for swagger, but delete unneeded attributes
swaggerSpec.definitions = schema.swaggerise(swaggerSpec.definitions, require("./schemas/orderCreateSchema.json"), "orderCreateSchema");
swaggerSpec.definitions = schema.swaggerise(swaggerSpec.definitions, require("./schemas/orderStatusUpdateSchema.json"), "orderStatusUpdateSchema");

/*
    Define constants
*/
const port = process.env.PORT || 8080;
const stateDescriptions = {
    "CREATED": "Order has been created.",
    "PENDING": "Order is pending picking",
    "PICKED": "Order has been fully picked",
    "PARTIALLY_PICKED": "Order has been partially picked",
    "READY_FOR_TRANSIT": "Order is ready for collection",
    "AWAITING_PICKUP": "Order is awaiting collection for delivery",
    "ENROUTE": "Order has been collected and is enroute",
    "DELAYED": "Order has been delayed",
    "CANCELLED": "Order delivery has been cancelled",
    "DELIVERED": "Order has been fully delivered",
    "PARTIALLY_DELIVERED": "Order has been partially delivered",
    "DELIVERY_CONFIRMED": "Delivery has been confirmed by the recipient",
    "FAILURE": "Delivery failed",
    "REJECTED": "Delivery was rejected by the recipient"
}
const sourceStates = ["CREATED", "PENDING", "PICKED", "PARTIALLY_PICKED", "READY_FOR_TRANSIT"];
const transportStates = ["AWAITING_PICKUP", "ENROUTE", "DELAYED", "CANCELLED", "DELIVERED", "PARTIALLY_DELIVERED", "DELIVERY_CONFIRMED", "FAILURE", "REJECTED"];

/*
    Setup Express Middleware
*/
app.use(bodyParser.json());
app.use(expressMiddleware.allowedOrigins);

app.get('/swagger.json', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

/**
 * @swagger
 * /states :
 *   get:
 *     tags:
 *       - SupplychainBlockchain
 *     description: Returns all possible order states
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successful order retrieval 
 *       503:
 *         description: Error querying chaincode
 */
app.get('/states', function (req, res) {
    console.log("[HTTP] Request inbound: GET /states");
    let allStates = [].concat(sourceStates, transportStates);
    let statesWithMessage = allStates.map(state => ({
        state,
        description: stateDescriptions[state]
    }));
    console.log("[HTTP] Writing response: GET /states");
    res.send(statesWithMessage);
});

/**
 * @swagger
 * /orders :
 *   get:
 *     tags:
 *       - SupplychainBlockchain
 *     description: Returns all orders present on the blockchain
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successful order retrieval 
 *       503:
 *         description: Error querying chaincode
 */
app.get('/orders', function (req, res) {
    console.log("[HTTP] Request inbound: GET /orders");
    console.log("[QUERY] Querying getAllOrders on chaincode");
    blockchain.query(config.peers[0].endpoint, config.chaincodeHash, config.peers[0].user, "getAllOrders", [])
        .then(json => {
            console.log("[QUERY] Completed successfully");
            let orders = JSON.parse(json.result.message).orders
            console.log("[QUERY] Querying getOrderHistory for orders");
            let orderPromises = orders.map((order, index) => {
                return blockchain.query(config.peers[0].endpoint, config.chaincodeHash, config.peers[0].user, "getOrderHistory", [order.id])
                    .then(json => {
                        let history = JSON.parse(json.result.message).orderUpdates.map(update => {
                            update.timestamp = date.parseBlockchainTimestamp(update.timestamp);
                            return update;
                        })
                        orders[index] = Object.assign({}, order, { history: history });
                    });
            });
            return Promise.all(orderPromises).then(() => orders);
        })
        .then(orders => {
            console.log("[QUERY] Querying complete on getOrderHistory for orders");
            res.send(orders);
        })
        .catch(error => {
            console.log(error);
            res.status(503);
            res.send({ error: error.message });
        });
});

/**
 * @swagger
 * /order :
 *   post:
 *     tags:
 *       - SupplychainBlockchain
 *     description: Creates a new order on the blockchain as according to the body of the request
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: Body
 *         description: The JSON body of the request
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/orderCreateSchema'
 *     responses:
 *       200:
 *         description: Successful response
 *       400:
 *         description: Failed schema validation
 *       503:
 *         description: Error invoking chaincode
 */
app.post('/order', validate({ body: schemas.orderCreateSchema }), function (req, res) {
    console.log("[HTTP] Request inbound: POST /order");
    let order = req.body;

    let orderArguments = [order.destination.recipient,
    order.destination.address,
    order.source.location,
    order.transport.company,
    JSON.stringify({ items: order.items })
    ];

    console.log("[INVOKE] Invoked addOrder on chaincode");
    blockchain.invoke(config.peers[0].endpoint, config.chaincodeHash, config.peers[0].user, "addOrder", orderArguments)
        .then(json => {
            console.log("[INVOKE] Completed successfully");
            res.send(json)
        })
        .catch(error => {
            console.log(error);
            res.status(503);
            res.send({ error: error.message });
        });
});

/**
 * @swagger
 * /order/{orderId} :
 *   get:
 *     tags:
 *       - SupplychainBlockchain
 *     description: Returns all orders present on the blockchain
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: orderId
 *         description: The order ID you wish to retrieve details for
 *         in: path
 *         type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Successful order retrieval 
 *       503:
 *         description: Error querying chaincode
 */
app.get('/order/:id', function (req, res) {
    console.log("[HTTP] Request inbound: GET /order/" + req.params.id);
    console.log("[QUERY] Querying getOrder on chaincode");
    let order = {};
    let orderRetrieval = blockchain.query(config.peers[0].endpoint, config.chaincodeHash, config.peers[0].user, "getOrder", [req.params.id])
        .then(json => {
            console.log("[QUERY] Completed getOrder successfully");
            order = Object.assign({}, order, JSON.parse(json.result.message));
        });
    console.log("[QUERY] Querying getOrderHistory on chaincode");
    let orderHistoryRetrieval = blockchain.query(config.peers[0].endpoint, config.chaincodeHash, config.peers[0].user, "getOrderHistory", [req.params.id])
        .then(json => {
            console.log("[QUERY] Completed getOrderHistory successfully");
            let history = JSON.parse(json.result.message).orderUpdates.map(update => {
                update.timestamp = date.parseBlockchainTimestamp(update.timestamp);
                return update;
            })
            order = Object.assign({}, order, { history: history });
        });

    Promise.all([orderRetrieval, orderHistoryRetrieval]).then(() => {
        console.log("[HTTP] Request outbound: GET /order/" + req.params.id);
        res.send(order);
    })
        .catch(error => {
            console.log(error);
            res.status(503);
            res.send({ error: error.message });
        });
});

/**
 * @swagger
 * /order/:orderId/status :
 *   put:
 *     tags:
 *       - SupplychainBlockchain
 *     description: Updates order status for order ID provided
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: Body
 *         description: The JSON body of the request
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/orderStatusUpdateSchema'
 *       - name: orderId
 *         description: The order ID you wish to retrieve details for
 *         in: path
 *         type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Successful response
 *       400:
 *         description: Failed schema validation
 *       503:
 *         description: Error invoking chaincode
 */
app.put('/order/:id/status', validate({ body: schemas.orderStatusUpdateSchema }), function (req, res) {
    console.log("[HTTP] Request inbound: POST /order");
    let stateRequest = req.body;

    let statusType = "SOURCE";
    if (transportStates.indexOf(stateRequest.to) >= 0) {
        statusType = "TRANSPORT";
    }

    let orderArguments = [req.params.id,
        statusType,
    stateRequest.to,
    stateRequest.comment || ""];

    console.log("[INVOKE] Invoked updateOrderStatus on chaincode");
    blockchain.invoke(config.peers[0].endpoint, config.chaincodeHash, config.peers[0].user, "updateOrderStatus", orderArguments)
        .then(json => {
            console.log("[INVOKE] Completed successfully");
            res.send(json)
        })
        .catch(error => {
            console.log(error);
            res.status(503);
            res.send({ error: error.message });
        });
});


// Express Error Handling for Validation
app.use((err, req, res, next) => {
    let responseData;

    if (err.name === 'JsonSchemaValidation') {

        console.log("[HTTP] Request JSON schema validation failed.");

        res.status(400);

        responseData = {
            "error": "Bad Request",
            "validationErrors": err.validations
        };

        res.json(responseData);
    } else {
        next(err);
    }
});

app.listen(port);
console.log("Listening on port ", port);