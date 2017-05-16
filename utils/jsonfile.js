const jsonfile = require('jsonfile');

let readJSON = file => new Promise((resolve, reject) => {
  jsonfile.readFile(file, (err, obj) => {
    if (err) {
      reject(err);
    } else {
      resolve(obj);
    }
  });
});

let writeJSON = (file, data) => new Promise((resolve, reject) => {
  jsonfile.writeFile(file, data, (err, obj) => {
    if (err) {
      reject(err);
    } else {
      resolve(obj);
    }
  });
});

module.exports = {
  read: readJSON,
  write: writeJSON
}