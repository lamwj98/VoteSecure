const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bodyParser = require("body-parser");
const secretKey = 'eda059d2';

const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = 3000;
const path = require('path');
const Web3 = require('web3');
const providerUrl = '';
const web3 = new Web3(providerUrl);

const authenticateAdmin = require('./authMiddleware');

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


const uri = 'mongodb+srv://tungnd237:deptrai237@cluster0.00jyklj.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let db;

// Contract linkage
const contractAbi = [];
const contractAddress = '0x..';

const contract = new web3.eth.Contract(contractAbi, contractAddress);

// Connect to MongoDB Atlas
async function connectToDB() {
  try {
    await client.connect();
    db = client.db('votingAppDB');
    console.log('Connected to MongoDB Atlas');
  } catch (err) {
    console.error('Error connecting to MongoDB Atlas:', err);
    process.exit(1);
  }
}

// Close the MongoDB connection when the app shuts down
function closeDBConnection() {
  client.close();
  console.log('Closed MongoDB Atlas connection');
}

// Call the connectToDB function to establish the database connection
connectToDB();

// Initialize the database
async function initializeDatabase() {
    try {
      // Create a votingSessions collection if it doesn't exist
      await db.createCollection('votingSessions');
  
      // Create an adminCredentials collection if it doesn't exist
      await db.createCollection('adminCredentials');
  
      console.log('Database initialized');
    } catch (err) {
      console.error('Error initializing database:', err);
    }
  }
  
initializeDatabase();


// Serve the landing page
app.get('/', (req, res) => {
    const indexPath = path.join(__dirname, "..", 'frontend', 'public', 'index.html');
    res.sendFile(indexPath);
  });
  
// Serve the admin landing page
app.get('/admin-landing', (req, res) => {
    const adminLandingPath = path.join(__dirname, "..", 'frontend', 'public', 'admin-landing.html');
    res.sendFile(adminLandingPath);
});

// Serve the create admin page
app.get('/register', (req, res) => {
    const createAdminPath = path.join(__dirname, "..",'frontend', 'public', 'create-admin.html');
    res.sendFile(createAdminPath);
});

// // Serve the login page
// app.get('/login', (req, res) => {
//     const loginPath = path.join(__dirname, '..', 'frontend', 'public', 'login.html');
//     res.sendFile(loginPath);
// });

// Serve the create voting session page
// app.get('/create-voting-session', (req, res) => {
//     const createVotingSessionPath = path.join(__dirname, "..", 'frontend', 'public', 'create-voting-session.html');
//     res.sendFile(createVotingSessionPath);
// }); 

  
app.post('/login', (req, res) => {
    const { username, password } = req.body;
  
    db.collection('adminCredentials')
      .findOne({ username, password })
      .then(admin => {
        if (admin) {
          // Generate JWT token
          const token = jwt.sign({ username }, secretKey);
  
          res.json({ success: true, token });
        } else {
          res.status(401).json({ error: 'Invalid admin credentials' });
        }
      })
      .catch(err => {
        console.error('Error authenticating admin:', err);
        res.sendStatus(500);
      });
});

app.post('/logout', (req, res) => {
    // Clear the JWT token from the client-side (e.g., cookies or local storage)
    res.clearCookie('jwt'); // Assuming the token is stored in a cookie named 'jwt'

    // Send a response indicating successful logout
    res.sendStatus(200);
  });


const authenticateAdmin = (req, res, next) => {
  // Get the JWT token from the request headers, cookies, or any other location
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  // Verify the token
  jwt.verify(token, 'your_secret_key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Store the decoded token in the request object for future use
    req.admin = decoded.admin;
    next();
  });
};

module.exports = authenticateAdmin;
  
// Create a voting session
app.post('/createVotingSession', authenticateAdmin, (req, res) => {
    const { description, candidates, voters } = req.body;
  
    // Create a new Session object
    const session = {
      description,
      candidates,
      sessionId: null, // Initialize the sessionId as null
      voter: {}, // Initialize the key-values object
      votersTableId: null, // Initialize the votersTableId as null
    };
  
    session.description = description;
    session.candidates = candidates;
    // Assign voterIds to voters and update the key-value table
    const voterIds = {};
    const votersTable = [];
  
    for (let i = 0; i < voters.length; i++) {
      const voterId = i; // Assign voterId starting from 0
      const nationalIdentity = voters[i];
      voterIds[nationalIdentity] = voterId;
  
      votersTable.push({
        sessionId: null, // Initialize the sessionId as null
        nationalIdentity,
        voterId,
      });
    }
  
    // Store the voters table in MongoDB
    db.collection('votersTable')
      .insertMany(votersTable)
      .then(result => {
        // Update the votersTableId in the Session object
        session.votersTableId = result.insertedId;
  
        // Update the key-value table in the Session object
        session.voter = voterIds;
  
        // Call Solidity createSession(numVoters, candidateNames) and handle the returned sessionId
        const numVoters = voters.length;
        const candidateNames = candidates.map(candidate => candidate.name);
  
        // Replace the following code with your Solidity contract interaction logic
        // Call the Solidity contract's createSession function and get the sessionId
        const sessionId = contract.methods.createSession(numVoters, candidateNames);
  
        // Update the sessionId in the Session object
        session.sessionId = sessionId;
  
        // Return the session object or appropriate response to the frontend
        res.json({ success: true, session });
      })
      .catch(err => {
        console.error('Error storing voters table:', err);
        res.sendStatus(500);
      });

      // Check for user using the jwt
      // Frontend -> an array of voters, description of voting session, list of candidates
      // Backend -> create a new Session object
      // Session object consists of list candidates, description of session, sessionId (None initialized) a pointer to a table of key-value where key
      // is nationalIdentity(or identifier of voter) and value is assigned voterId (starts from 0) 
      // Call Solidity createSession(numVoters, candidateNames) -> returns sessionId
      // Update the session Id in Session Object.

  });



app.post('/startSession/:sessionId', authenticateAdmin, async (req, res) => {
    // Check user authenticity (only admin can start)
    
    const sessionId = req.params.sessionId
    contract.methods.startSession(sessionId).call((error, result) => {
        if (error) {
            res.send(error)
        } else {
            res.send(result)
        }
    })
}); 

app.post('/endSession/:sessionId', authenticateAdmin, async (req, res) => {
    // Check user authenticity (only admin can start)

    const sessionId = parseInt(req.params.sessionId, 10)
    contract.methods.endSession(sessionId).call((error, result) => {
        if (error) {
            res.send(error)
        } else {
            res.send(result)
        }
    })
})

app.get('/isSessionOngoing/:sessionId', authenticateAdmin, async (req, res) => {
    // Check user authenticity (only admin can start)

    const sessionId = parseInt(req.params.sessionId, 10)
    contract.methods.isSessionOngoing(sessionId).call((error, result) => {
        if (error) {
            res.send(error)
        } else {
            res.send(result)
        }
    })
})

app.post('/vote', async (req, res) => {
    // bodyParser library needed
    // Frontend data -> {voterId: ...., sessionId: ..., candidateName: ...}
    // Using bodyParser library extract using the following format -> req.body.voterId, req.body.sessionId, req.body.candidateName

    // Hash table of voters -> using voter identifier (e.g. National identifier like FIN no.), find the voterId in the backend table
    // e.g. you have sessionId, find the table for this session, access the voterId table and find the voterId
    // with voterId, call Solidity -> vote(sessionId, voterId, candidateName)
    const { voterId, sessionId, candidateName } = req.body;

    try {
        // Retrieve the session table using the session ID
        const session = await db.collection('sessionTable').findOne({ sessionId });
    
        if (!session) {
          return res.status(404).json({ error: 'Session not found' });
        }
    
        // Retrieve the voters table associated with the session
        const votersTable = await db.collection('votersTable').findOne({ sessionId });
    
        if (!votersTable) {
          return res.status(404).json({ error: 'Voters table not found' });
        }
    
        // Find the voterId from the voters table using the provided voterId
        const matchedVoter = votersTable.find(voter => voter.voterId === voterId);
    
        if (!matchedVoter) {
          return res.status(404).json({ error: 'Voter not found' });
        }
    
        // Extract the actual voterId for the Solidity contract call
        const actualVoterId = matchedVoter.voterId;
    
        // Call the Solidity contract's vote function with the actualVoterId and candidateName
        contract.methods.vote(sessionId, actualVoterId, candidateName).call((error, result) => {
          if (error) {
            res.send(error);
          } else {
            res.send(result);
          }
        });
      } catch (err) {
        console.error('Error finding voterId:', err);
        res.sendStatus(500);
      }
    });

  
app.get('/getResult/:sessionId', authenticateAdmin, async (req, res) => {
    // Check user authenticity (only admin can start)

    const sessionId = parseInt(req.params.sessionId, 10)
    contract.methods.getVoteResults(sessionId).call((error, result) => {
        if (error) {
            res.send(error)
        } else {
            res.send(result)
        }
    })
    
})

// Route to create an admin
// app.post('/admin', async (req, res) => {
//     const { username, password } = req.body;
  
//     try {
//       const admin = { username, password };
//       const result = await db.collection('adminCredentials').insertOne(admin);
//       console.log('Admin created:', result.insertedId);
//       res.json({ success: true, adminId: result.insertedId });
//     } catch (err) {
//       console.error('Error creating admin:', err);
//       res.status(500).json({ error: 'Failed to create admin' });
//     }
// });

// app.listen(port, () => {
//     console.log(`Server running on port ${port}`)
// });

/*
const web3 = require('web3');

// Connect to Ethereum network (Assuming you have an Ethereum node running on localhost)
const web3Instance = new web3('http://localhost:8545');

// Get the contract instance (replace 'your_contract_address' and 'your_contract_abi' with actual values)
const contract = new web3Instance.eth.Contract('your_contract_abi', 'your_contract_address');

// Users data - This is just for demo. In real application, use a secure database
const users = [
    { id: 1, username: 'admin', password: 'password', isAdmin: true },
];

const app = express();

app.use(express.json());

// Generate voting ticket number - single and batch
app.post('/generateTickets', authenticateToken, (req, res) => {
    // Your logic here


});

// Create a voting session
app.post('/createVotingSession', authenticateToken, (req, res) => {
    // Your logic here


});

// End a voting session
app.post('/endVotingSession', authenticateToken, (req, res) => {
    // Your logic here


});

// Retrieve voting session details for frontend display
app.get('/getSessionDetails', authenticateToken, async (req, res) => {
    // Your logic here, for example:
    const sessionDetails = await contract.methods.getSessionDetails().call();
    res.json(sessionDetails);
});

// Authentication for administrative login
app.post('/authenticateUser', (req, res) => {
    // Authenticate user
    const user = users.find(user => user.username === req.body.username && user.password === req.body.password);

    if (user) {
        // Create a token
        const accessToken = jwt.sign({ id: user.id, isAdmin: user.isAdmin }, 'your_jwt_secret');
        res.json({ accessToken });
    } else {
        res.sendStatus(401);
    }
});


// Logging out of administrative user
app.post('/logoutUser', (req, res) => {
    // Your logic here



});

// Vote - this part will do the writing into smart contract
app.post('/poll', authenticateToken, async (req, res) => {
    // Your logic here, for example:
    const voteResult = await contract.methods.vote(req.body.candidateId).send({ from: 'your_ethereum_address' });
    res.json(voteResult);


});

// Get voting results
app.get('/getVotingResults', authenticateToken, async (req, res) => {
    // Your logic here, for example:
    const votingResults = await contract.methods.getVotingResults().call();
    res.json(votingResults);


    
});

function authenticateToken(req, res, next) {
    // Check if token exists
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    // Verify token
    jwt.verify(token, 'your_jwt_secret', (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}
*/



