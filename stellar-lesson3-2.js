// @title Send a payment to Other ("Amy")

const StellarSDK = require('stellar-sdk');
var server = new StellarSDK.Server('https://horizon-testnet.stellar.org');
StellarSDK.Network.useTestNetwork();
var sourceKeys = StellarSDK.Keypair.fromSecret('SBVLTURMQ2IUVUV5EBYMT5T7QBC5HTU4TBBDQTFPF7QUUVIMOQR6VP4O');
var destinationId = 'GAIGZHHWK3REZQPLQX5DNUN4A32CSEONTU6CMDBO7GDWLPSXZDSYA4BU';

server.loadAccount(sourceKeys.publicKey())
  .then(function(sourceAccount) {
    var transaction = new StellarSDK.TransactionBuilder(sourceAccount)
    .addOperation(StellarSDK.Operation.payment({
      destination: destinationId,
      asset: new StellarSDK.Asset('USD', 'GAIUIQNMSXTTR4TGZETSQCGBTIF32G2L5P4AML4LFTMTHKM44UHIN6XQ'),
      amount: '1'
    }))

    // Use the memo to indicate the customer this payment is intended for.
    .addMemo(StellarSDK.Memo.text("To Amy"))
    .build();
    transaction.sign(sourceKeys);
    return server.submitTransaction(transaction);
  })
  .then(function(result) {
    console.log('Success! Results: ', result);
  })
  .catch(function(error) {
    console.error('Something went wrong!', error);
  });
