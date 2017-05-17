
var hfc = require('hfc');
let fs = require('fs');

const config = require('./config.json');

// Create a client chain.
// The name can be anything as it is only used internally.
var chain = hfc.newChain("targetChain");

var certFile = 'us.blockchain.ibm.com.cert';

// Configure the KeyValStore which is used to store sensitive keys
// as so it is important to secure this storage.
// The FileKeyValStore is a simple file-based KeyValStore, but you
// can easily implement your own to store whereever you want.
chain.setKeyValStore( hfc.newFileKeyValStore('./keyValStore-4a780ee6') );

var cert = fs.readFileSync(certFile);

// Set the URL for member services
chain.setMemberServicesUrl(config.memberService, {
  pem: cert 
});

// Enroll "WebAppAdmin" which is already registered because it is
// listed in fabric/membersrvc/membersrvc.yaml with its one time password.
// If "WebAppAdmin" has already been registered, this will still succeed
// because it stores the state in the KeyValStore
// (i.e. in '/tmp/keyValStore' in this sample).
chain.enroll(config.admin.name, config.admin.secret, function(err, admin) {
   if (err) return console.log("ERROR: failed to register %s: %s",err);
   // Successfully enrolled WebAppAdmin during initialization.
   // Set this user as the chain's registrar which is authorized to register other users.
   chain.setRegistrar(admin);
   // Now begin listening for web app requests
   var registrationRequest = config.newUser;
   chain.register( registrationRequest, function(err, user) {
      if (err) return console.log("ERROR: %s",err);
      // Issue an invoke request
      // Console.log secret
      console.log(user);
   });
});