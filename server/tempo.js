// Require JS driver
const driver = require('bigchaindb-driver')
// Create an identity key pair
const myIdentity = new driver.Ed25519Keypair()
const conn = new driver.Connection('http://172.16.14.216:9984/api/v1/')

// Create a new CREATE transaction (new output)
// const tx = driver.Transaction.makeCreateTransaction(
//     { name: 'vidDone', deVID: "4f27b4142f233d52212549a8edd924fb344d9062a594f27b4142fd777fe7cba4bf53" },
//     null,
//     [ driver.Transaction.makeOutput(
//     driver.Transaction.makeEd25519Condition(myIdentity.publicKey))],
//     myIdentity.publicKey)
//     //Sign the transaction
//     const txSigned = driver.Transaction.signTransaction(tx, myIdentity.privateKey)
//     //Send it to the network
//     conn.postTransactionCommit(txSigned)

//Search asset
conn.searchAssets('alreadyVoted').then(assets => console.log('Found assets with name My asset:', assets))
//Search metadata
// conn.searchMetadata('here goes').then(metadata => console.log('Found asset metadata with metadata1 here goes:', metadata))