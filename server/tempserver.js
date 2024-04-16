const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const driver = require('bigchaindb-driver');
const crypto = require('crypto');
const mongoose = require("mongoose");


const app = express();
app.use(cors());
// Parse JSON request body
app.use(bodyParser.json());

const PORT = process.env.PORT || 5002;

const uri = "mongodb+srv://devs:devs@cluster1.bndl44b.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(uri, {})
  .then(()=>{
    console.log("Connected to the database");
  })
  .catch(err=>{
    console.log(err)});

  
const allVidSchema=new mongoose.Schema({
  vid : String
});

const allVid=mongoose.model("allVid",allVidSchema);

try{

app.post('/hashAndStore', async (req, res) => {
  const { vid, pin } = req.body;
  const id_pass = vid + pin;

  try {
    const myIdentity = new driver.Ed25519Keypair();
    const myIdentity1 = new driver.Ed25519Keypair();
    const conn = new driver.Connection('http://localhost:9984/api/v1/');
    const hash = crypto.createHash('sha256').update(id_pass).digest('hex');
    const hashVid = crypto.createHash('sha256').update(vid).digest('hex');


    // Search asset
    conn.searchAssets('vidDone').then(async assets => {
      console.log('Found assets with name votes:', assets);

      const hashToCheck = hash; // Replace with the hash you want to check

      // Iterate over the returned assets to find the hash
      const hashExists = assets.some(asset => {
        return asset.data.deVID === hashToCheck; // Assuming 'deVID' is the attribute storing the hash
      });

      if (hashExists) {
        console.log(`Hash ${hashToCheck} exists in BigchainDB assets.`);
        console.log(hashVid);
      } 
      else {
        
        console.log(`Hash ${hashToCheck} does not exist in BigchainDB assets.`);

        // string hash of voter id
        const tx = driver.Transaction.makeCreateTransaction(
          { name: 'vidDone', deVID: hash,},
          null,
          [ driver.Transaction.makeOutput(
            driver.Transaction.makeEd25519Condition(myIdentity.publicKey)
          )],
          myIdentity.publicKey
        );
        // Sign the transaction
        const txSigned = driver.Transaction.signTransaction(tx, myIdentity.privateKey);
        // Send it to the network
        await conn.postTransactionCommit(txSigned);
        // Return success response
        // res.json({ success: true, hash });

        // storing hash of pin and id          
        const tx1 = driver.Transaction.makeCreateTransaction(
          { name: 'hashedVidPin', deVID: hashVid,},
          null,
          [ driver.Transaction.makeOutput(
            driver.Transaction.makeEd25519Condition(myIdentity1.publicKey)
          )],
          myIdentity1.publicKey
        );
        // Sign the transaction
        const txSigned1 = driver.Transaction.signTransaction(tx1, myIdentity1.privateKey);
        // Send it to the network
        await conn.postTransactionCommit(txSigned1);

      }

    }).catch(err => {
      console.log('Error searching assets:', err);
    });
    
    
  } catch (error) {
    console.error("Error hashing and storing data:", error);
    res.status(500).json({ success: false, msg: "Error hashing and storing data." });
  }
});


app.post('/signin', async (req, res) => {

  const { vid, pin } = req.body;
  const id_pass = vid+pin;
  const hashVidPin = crypto.createHash('sha256').update(id_pass).digest('hex');
  const hashVid = crypto.createHash('sha256').update(vid).digest('hex');
  let flag1=0;
  let flag2=0;

  try {
    const conn = new driver.Connection('http://localhost:9984/api/v1/');

    // Search asset
    await conn.searchAssets('vidDone').then(async assets => {

      let hashToCheck = hashVid; // Replace with the hash you want to check

      // Iterate over the returned assets to find the hash
      let hashExists = assets.some(asset => {
        return asset.data.deVID == hashToCheck; // Assuming 'deVID' is the attribute storing the hash
      });

      if (hashExists) {
        flag1=1;
      } 

    });

    await conn.searchAssets('hashedVidPin').then(async assets => {
      let hashToCheck = hashVidPin; // Replace with the hash you want to check

      // Iterate over the returned assets to find the hash
      let hashExists = assets.some(asset => {
        return asset.data.deVID == hashToCheck; // Assuming 'deVID' is the attribute storing the hash
      });

      if (hashExists) {
        flag2=1;
      }
      

      if(flag1 && flag2){
        res.send(200).json({msg: "Login successful"});
      }
      else if(flag1){
        res.send(401).json({msg: "Wrong PIN"});
      }
      else{
        res.send(404).json({msg: "Please create a decentralised VID first!"});
      } 
    });

    
  } catch (error) {
    console.error("Error hashing and storing data:", error);
    res.status(500).json({ msg:"Error hashing and storing data." });
  }

});



app.post('/vote', async (req, res) => {
  const { vid, pin, party } = req.body;
  const id_pass = vid + pin ;
  const validate_user = vid;

  try {
    const myIdentity = new driver.Ed25519Keypair();
    const myIdentity1 = new driver.Ed25519Keypair();
    const conn = new driver.Connection('http://localhost:9984/api/v1/');
    const hashVidPin = crypto.createHash('sha256').update(id_pass).digest('hex');
    const hashVid = crypto.createHash('sha256').update(validate_user).digest('hex');


    // Search asset
    conn.searchAssets('alreadyVoted').then(async assets => {

      const hashToCheck = hashVid; // Replace with the hash you want to check
      // Iterate over the returned assets to find the hash
      const hashExists = assets.some(asset => {
        return asset.data.deVID === hashToCheck; // Assuming 'deVID' is the attribute storing the hash
      });
      if (hashExists) {
        res.send(1000).json({msg: "alreadyVoted"});
      } 
      else {

        // string hash of voter id
        const tx = driver.Transaction.makeCreateTransaction(
          { name: 'alreadyVoted', deVID: hashVid,},
          null,
          [ driver.Transaction.makeOutput(
            driver.Transaction.makeEd25519Condition(myIdentity.publicKey)
          )],
          myIdentity.publicKey
        );
        // Sign the transaction
        const txSigned = driver.Transaction.signTransaction(tx, myIdentity.privateKey);
        // Send it to the network
        await conn.postTransactionCommit(txSigned);
        // Return success response
        // res.json({ success: true, hash });

        // storing hash of pin and id          
        const tx1 = driver.Transaction.makeCreateTransaction(
          { name: 'votes', deVID: hashVidPin, party : party,},
          null,
          [ driver.Transaction.makeOutput(
            driver.Transaction.makeEd25519Condition(myIdentity1.publicKey)
          )],
          myIdentity1.publicKey
        );
        // Sign the transaction
        const txSigned1 = driver.Transaction.signTransaction(tx1, myIdentity1.privateKey);
        // Send it to the network
        await conn.postTransactionCommit(txSigned1);
        res.send(200).json({msg: "success"});


      }

    }).catch(err => {
    res.status(500).json({  msg: "Error hashing and storing data." });
      
    });
    
    
  } catch (error) {
    console.error("Error hashing and storing data:", error);
    res.status(500).json({  msg: "Error hashing and storing data." });
  }
});



app.get('/', (req, res) => {
  res.send('Hello from Express and MongoDB!');
});


app.get('/getDataByvid/:vid', async (req, res) => {

    
    const vid = req.params.vid;
    allVid.find({vid: vid })
      .then(data=>{
        if(data.length!=0){
          res.status(200).json({msg:"Valid VID"});
        }
        else{
          res.status(1062).json({msg:"Invalid VID"});
        }

      })
      .catch(err=>{
        console.error("Error fetching data:", err);
        res.status(500).json({ msg: "Error fetching data" });
      })


  
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



}
catch(err){
mongoose.connection.close();
};


