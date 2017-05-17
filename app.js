let express = require('express');
const bodyParser = require('body-parser');
let app = express();

/**
 * JSON Schema Validation
 */
const validate = require('express-jsonschema').validate;

// Define schemas object
let schemas = {};
schemas.orderCreateSchema = require("./schemas/orderCreateSchema.json");

const blockchain = require('./utils/blockchain-helpers.js');
const config = require('./config.json');

const port = process.env.PORT || 8080;

app.use(bodyParser.json());

app.get('/', function (req, res) {
    blockchain.query(config.peers[0].endpoint, config.chaincodeHash, config.peers[0].user, "read", ["hello_world"])
        .then(json => res.send(json))
        .catch(error => {
            console.log(error);
            res.send({ error: error.message });
        });
});

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