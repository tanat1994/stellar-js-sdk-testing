//@title Sending XLM from acc to acc send 10 XLM to another acc
const StellarSDK = require('stellar-sdk');
var privateKey = 'SBVLTURMQ2IUVUV5EBYMT5T7QBC5HTU4TBBDQTFPF7QUUVIMOQR6VP4O';
var publicKey = 'GCJ6RCINGYSDVBIYMEO2U3XATXPB2LTKI5GO7KP36CEB4BNEVYBZVQ36';

StellarSDK.Network.useTestNetwork();
var server = new StellarSDK.Server('https://horizon-testnet.stellar.org');
var sourceKeys = StellarSDK.Keypair.fromSecret(privateKey);
var destinationId = 'GA2C5RFPE6GCKMY3US5PAB6UZLKIGSPIUKSLRB6Q723BM2OARMDUYEJ5';

var transaction;

// First, check to make sure that the destination account exists.
// You could skip this, but if the account does not exist, you will be charged
// the transaction fee when the transaction fails.
server.loadAccount(destinationId)

  // If the account is not found, surface a nicer error message for logging.
  .catch(StellarSDK.NotFoundError, function (error) {
    throw new Error('The destination account does not exists!');
  })

  // If there was no error, load up-to-date information on your account.
  .then(function() {
    return server.loadAccount(sourceKeys.publicKey());
  })

  .then(function(sourceAccount) {
    // Start building the transaction.
    transaction = new StellarSDK.TransactionBuilder(sourceAccount)
    .addOperation(StellarSDK.Operation.payment({
      destination : destinationId,
      // Because Stellar allows transaction in many currencies, you must
      // specify the asset type. The special "native" asset represents Lumens.
      asset : StellarSDK.Asset.native(),
      amount : "10"
    }))
    // A memo allows you to add your own metadata to a transaction. It's
    // optional and does not affect how Stellar treats the transaction.
    .addMemo(StellarSDK.Memo.text('Test Tx fromT94'))
    .build();

    // Sign the transaction to prove you are actually the person sending it.
    transaction.sign(sourceKeys);
    // And finally, send it off to Stellar!
    return server.submitTransaction(transaction);
  })
  .then(function(result) {
    console.log('Success! Results : ', result);
  })
  .catch(function(error) {
    console.error('Something went wrong!', error);
    // If the result is unknown (no response body, timeout etc.) we simply resubmit
    // already built transaction:
    // server.submitTransaction(transaction);
  });
