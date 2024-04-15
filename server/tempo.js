// Require JS driver
const driver = require('bigchaindb-driver')
// Create an identity key pair
const myIdentity = new driver.Ed25519Keypair()
const conn = new driver.Connection('http://localhost:9984/api/v1/')

// Create a new CREATE transaction (new output)
const tx = driver.Transaction.makeCreateTransaction(
    { name: 'My Asset', immutable_attr1: "bla bla" },
    { metadata1: "here goes", metadata2: "my metadata attributes"},
    [ driver.Transaction.makeOutput(
    driver.Transaction.makeEd25519Condition(myIdentity.publicKey))],
    myIdentity.publicKey)
    //Sign the transaction
    const txSigned = driver.Transaction.signTransaction(tx, myIdentity.privateKey)
    //Send it to the network
    conn.postTransactionCommit(txSigned)

//Search asset
conn.searchAssets('My Asset').then(assets => console.log('Found assets with name My asset:', assets))
//Search metadata
// conn.searchMetadata('here goes').then(metadata => console.log('Found asset metadata with metadata1 here goes:', metadata))