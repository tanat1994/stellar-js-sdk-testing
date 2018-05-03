const StellarSDK = require('stellar-sdk');
// @dev define horizon-testnet
const server = new StellarSDK.Server('https://horizon-testnet.stellar.org');
StellarSDK.Network.useTestNetwork();

// @dev generate keypairs
let pairA = StellarSDK.Keypair.random();
let pairB = StellarSDK.Keypair.random();
let accountA, accountB = null;
console.log("Public Key A : " + pairA.publicKey());
console.log("Private Key A : " + pairA.secret());
console.log("Public Key B : " + pairB.publicKey());
console.log("Private Key B : " + pairB.secret());

const request = require('request');
// @dev get XLM from friendbot
request.get({
  uri : 'https://horizon-testnet.stellar.org/friendbot',
  qs : { addr : pairA.publicKey() },
  json : true
}, function(error, response, body){
    if(error || response.statusCode !== 200){
      console.error("Error : " ,error || body);
    } else {
      // @dev success transfer from friendbot
      console.log("Success to transfer : " + body);
      server.loadAccount(pairA.publicKey())
      .then(function(account){
        console.log("Balance for account : " + pairA.publicKey());
        account.balances.forEach(function(balance) {
          console.log("Account A Type : " , balance.asset_type, " Balance : " , balance);
        });

        // @dev generate transaction
        const transaction = new StellarSDK.TransactionBuilder(account)
          .addOperation(StellarSDK.Operation.payment({
            destination : 'GB6JHU34GXLRJDLBRSYD3D4EATHLUB4SVOPZ6KNYS6PEPPEO77425ELU',
            asset : StellarSDK.Asset.native(),
            amount : "30.123"
          }))
          .addMemo(StellarSDK.Memo.text('AtoB'))
          .build();
          transaction.sign(pairA);
          return server.submitTransaction(transaction);
      })
      .then(function(result){
        console.log("Success:" , result);
      })
      .catch(function(error){
        console.error("ERROR catch !! :" , error);
      });
    }
});
