
let deleteProperties = (object, array) => {
  array.forEach(function (item) {
    delete object[item];
  });
  return object;
}

let swaggerise = (swagger, schema, refName) => {
  if (schema.definitions && schema.definitions !== true) {
    Object.keys(schema.definitions).forEach(function (key) {
      swagger[key] = schema.definitions[key];
    });
    delete schema.definitions;
  }
  schema = module.exports.deleteProperties(schema, ["$schema", "title", "description"]);
  swagger[refName] = schema;
  return swagger;
};

module.exports = {
  deleteProperties,
  swaggerise
}