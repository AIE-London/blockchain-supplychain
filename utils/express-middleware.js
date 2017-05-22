const allowedOrigins = ["blockchain-supplychain-webapp.eu-gb.mybluemix.net",
  "aston-swagger-ui.eu-gb.mybluemix.net"];

let allowedOriginsMiddleware = (req, res, next) => {
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');
  if (req.headers.origin &&
    allowedOrigins.indexOf(
      req.headers.origin.replace("https://", "").replace("http://", "")
    ) >= 0) {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  }
  next();
};

module.exports = {
  allowedOrigins: allowedOriginsMiddleware
}