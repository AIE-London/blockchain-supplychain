let express = require('express');
const bodyParser = require('body-parser');
let app = express();

/*
    Grab config
*/
const config = require('./config.json');
const swaggerDefinition =  require('./swaggerConfig.json');

/*
    Import utilities
*/
const blockchain = require('./utils/blockchain-helpers.js');
const schema = require('./utils/schema-helpers.js');

/**
 * JSON Schema Validation
 */
const validate = require('express-jsonschema').validate;
let schemas = {};
schemas.orderCreateSchema = require("./schemas/orderCreateSchema.json");

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

/*
    Define constants
*/
const port = process.env.PORT || 8080;

/*
    Setup Express Middleware
*/
app.use(bodyParser.json());


/**
 * @swagger
 * /swagger.json :
 *   get:
 *     tags:
 *       - SupplychainBlockchain
 *     description: Returns swagger documentation
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successful response
 */
app.get('/swagger.json', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
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
            res.send(JSON.parse(json.result.message).orders);
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
app.post('/order', validate({ body : schemas.orderCreateSchema }), function (req, res) {
    console.log("[HTTP] Request inbound: POST /order");
    let order = req.body;

    let orderArguments = [order.destination.recipient,
        order.destination.address,
        order.source.location,
        order.transport.company,
        JSON.stringify({ items: order.items})
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