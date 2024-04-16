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
  