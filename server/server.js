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

const PORT = process.env.PORT || 5001;

const uri = "mongodb+srv://devs:devs@cluster1.bndl44b.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
const big_uri="http://172.16.14.216:9984/api/v1/";
async function connectToMongoDB() {
  try {
    await client.connect();
    await client.db("ECL_DATA").command({ ping: 1 });
    console.log("Pinged your deployment. Successfully connected to MongoDB Atlas!");
  } catch (error) {
    console.error("Error connecting to MongoDB Atlas:", error);
  }
}

connectToMongoDB();






  app.post('/signup', async (req, res) => {
    // res.status(200).json({msg:"h"});
    console.log("signup");
    const { vid, pin } = req.body;
    console.log(vid,pin);
    const id_pass = vid + pin;

    try {

      const result = await client.db("ECL_DATA").collection("ECL_VOTER_DATA").findOne({
        voter_id: vid
      });
      console.log(result);
      if (result) {
        const myIdentity = new driver.Ed25519Keypair();
        const myIdentity1 = new driver.Ed25519Keypair();
        const conn = new driver.Connection(big_uri);
        const hash1 = crypto.createHash('sha256').update(id_pass).digest('hex');
        const hash = crypto.createHash('sha256').update(vid).digest('hex');


        // Search asset
        conn.searchAssets('vidDone').then(async assets => {

          const hashToCheck = hash; // Replace with the hash you want to check

          // Iterate over the returned assets to find the hash
          const hashExists = assets.some(asset => {
            return asset.data.deVID === hashToCheck; // Assuming 'deVID' is the attribute storing the hash
          });

          if (hashExists) {
            res.status(401).json({ msg: `Account already made` });
          } 
          else {
            
            // console.log(`Hash ${hashToCheck} does not exist in BigchainDB assets.`);

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
            
            // storing hash of passward and id          
            const tx1 = driver.Transaction.makeCreateTransaction(
              { name: 'hashedVidPin', deVID: hash1,},
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
            res.status(200).json({msg:"Account created successfully"})
          }

        }).catch(err => {
          res.status(500).json({ msg: 'Internal error'});
        });
      }
      else{
        res.status(400).json({ msg: 'Invalid VID'});
        console.log("Invalid VID");
      }
      
      
    } catch (error) {
      res.status(500).json({ msg: 'Internal error'});

    }

  });



  app.post('/signin', async (req, res) => {

    const { vid, pin } = req.body;
    const id_pass = vid+pin;
    const hashVidPin = crypto.createHash('sha256').update(id_pass).digest('hex');
    const hashVid = crypto.createHash('sha256').update(vid).digest('hex');
    console.log(id_pass);

    let flag1=0;
    let flag2=0;
  
    try {
      const conn = new driver.Connection(big_uri);
  
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
          res.status(200).json({msg: "Login successful"});
        }
        else if(flag1){
          res.status(401).json({msg: "Wrong PIN"});
        }
        else{
          res.status(404).json({msg: "Please create a decentralised VID first!"});
        } 
      });
  
      
    } catch (error) {
      console.error("Error hashing and storing data:", error);
      res.status(500).json({ msg:"Error hashing and storing data." });
    }
  
  });
  
  
  
  app.post('/vote', async (req, res) => {
    // res.status(200).json({msg: "Vote successful"});
    const { vid, pin, party } = req.body;
    const id_pass = vid + pin ;
    const validate_user = vid;
    console.log(vid, pin, party);
    try {
      const myIdentity = new driver.Ed25519Keypair();
      const myIdentity1 = new driver.Ed25519Keypair();
      const conn = new driver.Connection(big_uri);
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
          res.status(1000).json({msg: "alreadyVoted"});
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
          res.status(200).json({msg: "success"});
  
  
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
    res.status('Hello from Express and MongoDB!');
  });


  app.get('/getDataByVoterId/:voterId', async (req, res) => {

      
      const voterId = req.params.voterId;
      allVid.find({vid: voterId })
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
          res.status(500).json({ message: "Error fetching data" });
        })

      // Log the data to the console
      // console.log(`Retrieved data for vid ${voterId}:`, data);
      

      // Send the data as response
      // res.status(200).json(data);
    
  });


  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });


  



