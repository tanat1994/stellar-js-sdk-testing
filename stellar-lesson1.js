//@title Create Stellar Acc -> Get XLM from friendbot -> Check Balance
const StellarSDK = require('stellar-sdk');

var pair = StellarSDK.Keypair.random();

console.log("Secret Key : " + pair.secret());
console.log("Public Key : " + pair.publicKey());

// The SDK does not have tools for creating test accounts, so you'll have to
// make your own HTTP request.
// @dev Get XLM from friend bot
const request = require('request');
  request.get({
    url: 'https://friendbot.stellar.org',
    qs: { addr: pair.publicKey() },
    json: true
  }, function(error, response, body){
    if (error || response.statusCode !== 200){
      console.error("ERROR!", error || body);
    }else {
      console.log("SUCCESS!, You have a new account", body);

      // @dev Check account balance
      var server = new StellarSDK.Server('https://horizon-testnet.stellar.org');
      // the JS SDK uses promises for most actions, such as retrieving an account
      server.loadAccount(pair.publicKey()).then(function(account) {
        console.log('Balances for account: ' + pair.publicKey());
        account.balances.forEach(function(balance) {
          console.log('Type : ', balance.asset_type, ', Balance : ', balance.balance);
        });
      });
    }
});
