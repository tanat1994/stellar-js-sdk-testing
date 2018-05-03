const StellarSDK = require('stellar-sdk');
const server = new StellarSDK.Server('https://horizon-testnet.stellar.org');
StellarSDK.Network.useTestNetwork();

let pairA = StellarSDK.Keypair.random();
let pairB = StellarSDK.Keypair.random();

console.log("Public Key(A) : " + pairA.publicKey());
console.log("Private Key(A) : " + pairA.secret());
console.log("Public Key(B) : " + pairB.publicKey());
console.log("Private Key(B) : " + pairB.secret());

const request = require('request');
request.get({
  uri: 'https://horizon-testnet.stellar.org/friendbot',
  qs: { addr: pairA.publicKey() },
  json: true
}, function(error, response, body) {
    if(error || response.statusCode !== 200){
      console.error("ERROR if!", error || body);
    } else {
      console.log("SUCCESS to Transfer", body);
      // let accountA = server.loadAccount(pairA.publicKey());
      //ACCOUNT A
      server.loadAccount(pairA.publicKey()).then(function(account) {
        console.log("Balance for account : " + pairA.publicKey());
        account.balances.forEach(function(balance){
          console.log("Account A Type: ", balance.asset_type, " Balance: ", balance.balance);
        });
      });
    }
});

server.loadAccount(pairA.publicKey())
  .catch(StellarSDK.NotFoundError, function(error){
    throw new Error('The destination acc does not exist');
  })
  .then(function() {
    return server.loadAccount(pairA.publicKey());
  })
  .then(function(account) {
    const transaction = new StellarSDK.TransactionBuilder(account)
      .addOperation(StellarSDK.Operation.payment({
        destination: 'GDZ2N7U7VLHZYLJDW4YW36NU5UBXA2PLHLPALYXJO2TIHIGLQYXFPTSZ',
        asset: StellarSDK.Asset.native(),
        amount: "30.123"
      }))
      .addMemo(StellarSDK.Memo.text('AtoB'))
      .build();
      transaction.sign(pairA);
      return server.submitTransaction(transaction);
  })
  .then(function(result){
    console.log("SUCCESS : ", result);
  })
  .catch(function(error){
    console.error("ERROR catch ! : ", error);
  })
;
// const transaction = new StellarSDK.TransactionBuilder(pairA)
//     .addOperation(StellarSDK.Operation.payment({
//       destination: pairB.publicKey(),
//       asset: StellarSDK.Asset.native(),
//       amount: "30.002"
//     }))
//     .addMemo(StellarSDK.Memo.text('AtoB'))
//     .build();
//     transaction.sign(pairA);
//     return server.submitTransaction(transaction);
// })
// .then(function(result){
//   console.log("Success : ", result);
// })
// .catch(function(error){
//   console.error("ERROR catch! : ", error);
// });
// }

// accountA = server.loadAccount(pairA.publicKey());
// accountB = server.loadAccount(pairB.publicKey());

// accountA.balances.forEach((balance) => {
//   console.log('account(A) Type:', balance.asset_type, ' Balance : ', balance.balance)
// });
//
// accountB.balances.forEach((balance) => {
//   console.log('account(B) Type:', balance.asset_type, ' Balance : ' , balance.balance)
// });

// const transaction = new StellarSDK.TransactionBuilder(accountA)
//   .addOperation(StellarSDK.Operation.payment({
//     destination: pairB.publicKey(),
//     asset: StellarSDK.Asset.native(),
//     amount: "30.123"
//   }))
//   .addMemo(StellarSDK.Memo.Text("A to B"))
//   .build();
//
// transaction.sign(pairA);
// const transactionResult = server.submitTransaction(transaction);
