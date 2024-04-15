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

  const PORT = process.env.PORT || 5000;

  const uri = "mongodb+srv://devs:devs@cluster1.bndl44b.mongodb.net/?retryWrites=true&w=majority";

  // const client = new MongoClient(uri, {
  //   serverApi: {
  //     version: ServerApiVersion.v1,
  //     strict: true,
  //     deprecationErrors: true,
  //   }
  // });

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
    const { combinedString, passward } = req.body;
    const id_pass = combinedString+ passward;

    try {
      const myIdentity = new driver.Ed25519Keypair();
      const myIdentity1 = new driver.Ed25519Keypair();
      const conn = new driver.Connection('http://localhost:9984/api/v1/');
      const hash = crypto.createHash('sha256').update(combinedString).digest('hex');
      const hash1 = crypto.createHash('sha256').update(id_pass).digest('hex');


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
        } 
        else {
          
          console.log(`Hash ${hashToCheck} does not exist in BigchainDB assets.`);

          // string hash of voter id
          const tx = driver.Transaction.makeCreateTransaction(
            { name: 'votes', deVID: hash, party:"0001", },
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
          res.json({ success: true, hash });



          // storing hash of passward and id          
          const tx1 = driver.Transaction.makeCreateTransaction(
            { name: 'hashedVidPin', deVID: hash1, party:"0001", },
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
      res.status(500).json({ success: false, message: "Error hashing and storing data." });
    }
  });


  
  


  // async function connectToMongoDB() {
  //   try {
  //     await client.connect();
  //     await client.db("ECL_DATA").command({ ping: 1 });
  //     console.log("Pinged your deployment. Successfully connected to MongoDB Atlas!");
  //   } catch (error) {
  //     console.error("Error connecting to MongoDB Atlas:", error);
  //   }
  // }

  // connectToMongoDB();

  app.get('/', (req, res) => {
    res.send('Hello from Express and MongoDB!');
  });

  app.get('/getAllData', async (req, res) => {
    
      // Connect to the MongoDB collection
      // const collection = client.db("ECL_DATA").collection("ECL_VOTER_DATA");

      
      // Find all documents in the collection
      // const data = await collection.find({}).toArray();

      allVid.find({})
        .then(users=>{
          console.log(users);
          res.json(users);
        })
        .catch(err=>{
          console.log("Error feching the users",err);
          res.status(500).json({ message: "Error fetching data" });
        })

      // Log the data to the console

  });



  app.get('/getDataByVoterId/:voterId', async (req, res) => {

      
      const voterId = req.params.voterId;
      allVid.find({vid: voterId })
        .then(data=>{
          // console.log(users)
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
      // console.log(`Retrieved data for voter_id ${voterId}:`, data);
      

      // Send the data as response
      // res.status(200).json(data);
    
  });


  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });


  // Check if a user exists by username
  app.post('/checkUser', async (req, res) => {
    try {
      const username = req.body.username;

      if (!username) {
        return res.status(400).json({ message: 'Username is required' });
      }

      const user = await allVid.find({ voter_id: username });

      if (user) {
        return res.status(200).json({ message: 'User exists' });
      } else {
        return res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      console.error("Error checking user:", error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
}
catch(err){
  mongoose.connection.close();
};


