
let moment = require('moment');

let parseBlockchainTimestamp = timestamp => {
  let seconds = timestamp.split(' ')[0].split(':')[1];
  return moment.unix(seconds).toISOString();
};

module.exports = {
  parseBlockchainTimestamp
};