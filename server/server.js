const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
// Parse JSON request body
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

const uri = "mongodb+srv://devs:devs@cluster1.bndl44b.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectToMongoDB() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. Successfully connected to MongoDB Atlas!");
  } catch (error) {
    console.error("Error connecting to MongoDB Atlas:", error);
  }
}

connectToMongoDB();

app.get('/', (req, res) => {
  res.send('Hello from Express and MongoDB!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


// // // Insert a new voter ID into dEVS_DATA collection
// app.post('/addVoter', async (req, res) => {
//   try {
//     const voter_id = req.body.voter_id;

//     if (!voter_id) {
//       return res.status(400).json({ message: 'voter_id is required' });
//     }
//     console.log(voter_id);
//     const result = await client.db("ECL_DATA").collection("ECL_VOTER_DATA").insertOne({
//       voter_id: voter_id
//     });

//     res.status(201).json({ message: 'Voter ID added successfully', data: result.ops[0] });
//   } catch (error) {
//     console.error("Error inserting voter ID:", error);
//     // res.status(500).json({ message: 'Internal Server Error', error: error.message });
//   }
// });

// Check if a user exists by username
app.post('/checkUser', async (req, res) => {
  try {
    const username = req.body.username;

    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }

    const user = await client.db("ECL_DATA").collection("ECL_VOTER_DATA").findOne({ voter_id: username });

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
