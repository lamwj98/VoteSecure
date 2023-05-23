const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const TOKEN_KEY = 'eda059d2';
const mongoose = require("mongoose");
require('dotenv').config();



const User = require("./model/user");
const VotingSession = require("./model/votingsession");
const VotersTable = require("./model/votersTable");


const http = require("http");

const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = 3000;
const Web3 = require('web3');
// const providerUrl = '';
// const web3 = new Web3(providerUrl);

const auth = require("./middleware/auth");

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// index.js
const { connect } = require('./config/database');

connect();



// // Serve the create admin page
// app.get('/register', (req, res) => {
//     const createAdminPath = path.join(__dirname, "..",'frontend', 'public', 'create-admin.html');
//     res.sendFile(createAdminPath);
// });

app.post("/register", async (req, res) => {

  // Our register logic starts here
  try {
    // Get user input
    const { username, password } = req.body;

    // Validate user input
    if (!(username && password)) {
      res.status(400).send("All input is required");
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ username });
    
    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }


    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await User.create({
      username, 
      password: encryptedPassword,
    });

    // Create token
    const token = jwt.sign(
      { user_id: user._id, username },
      TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );
    // save user token
    user.token = token;

    // return new user
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
});
  
app.post("/login", async (req, res) => {
  // Our login logic starts here
  try {
    // Get user input
    const { username, password } = req.body;

    // Validate user input
    if (!(username && password)) {
      return res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await User.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, username },
        TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      // save user token
      user.token = token;

      // user
      return res.status(200).json(user);
    } else {
      return res.status(400).send("Invalid Credentials");
    }
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
});


app.post('/logout', (req, res) => {
    // Clear the JWT token from the client-side (e.g., cookies or local storage)
    res.clearCookie('jwt'); // Assuming the token is stored in a cookie named 'jwt'

    // Send a response indicating successful logout
    res.sendStatus(200);
  });
  
// Create a voting session
app.post('/createVotingSession', auth, (req, res) => {
  const { description, candidates, voters } = req.body;

  const session = new VotingSession({
    description,
    candidates,
    sessionId: null,
    voter: {},
    votersTableId: null,
  });

  session.description = description;
  session.candidates = candidates;

  const voterIds = {};
  const votersTable = [];

  for (let i = 0; i < voters.length; i++) {
    const voterId = i;
    const nationalIdentity = voters[i];
    voterIds[nationalIdentity] = voterId;

    votersTable.push({
      sessionId: null, // Set it as null for now
      nationalIdentity,
      voterId,
    });
  }

  VotersTable.insertMany(votersTable)
    .then(result => {
      const votersTableIds = result.map(voter => voter._id);
      session.votersTableId = votersTableIds;
      session.voter = voterIds;

      const numVoters = voters.length;
      const candidateNames = candidates.map(candidate => candidate.name);
      
      contract.methods.createSession(numVoters, candidateNames).call((error, sessionId) => {
        if (error) {
          console.error('Error creating session:', error);
          res.sendStatus(500);
        } else {
          session.sessionId = sessionId;

          session.save()
            .then(savedSession => {
              res.json({ success: true, session: savedSession });
            })
            .catch(error => {
              console.error('Error saving session:', error);
              res.sendStatus(500);
            });
        }
      });
    })
    .catch(err => {
      console.error('Error storing voters table:', err);
      res.sendStatus(500);
    });
});


app.post('/startSession/:sessionId', auth, async (req, res) => {
    const sessionId = req.params.sessionId
    // contract.methods.startSession(sessionId).call((error, result) => {
    //     if (error) {
    //         res.send(error)
    //     } else {
    //         res.send(result)
    //     }
    // })
    console.log(sessionId)
    res.sendStatus(200)
}); 

app.post('/endSession/:sessionId', auth, async (req, res) => {
    const sessionId = parseInt(req.params.sessionId, 10)
    // contract.methods.endSession(sessionId).call((error, result) => {
    //     if (error) {
    //         res.send(error)
    //     } else {
    //         res.send(result)
    //     }
    // })
    console.log(sessionId)
    res.sendStatus(200)
})

app.get('/isSessionOngoing/:sessionId', auth, async (req, res) => {
    const sessionId = parseInt(req.params.sessionId, 10)
    // contract.methods.isSessionOngoing(sessionId).call((error, result) => {
    //     if (error) {
    //         res.send(error)
    //     } else {
    //         res.send(result)
    //     }
    // })
    console.log(sessionId)
    res.sendStatus(200)
})

app.post('/vote', async (req, res) => {
  const { voterId, sessionId, candidateName } = req.body;

  try {
    const session = await VotingSession.findOne({ sessionId });

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const votersTable = await VotersTable.findOne({ sessionId });

    if (!votersTable) {
      return res.status(404).json({ error: 'Voters table not found' });
    }

    const matchedVoter = votersTable.find(voter => voter.voterId === voterId);

    if (!matchedVoter) {
      return res.status(404).json({ error: 'Voter not found' });
    }

    const actualVoterId = matchedVoter.voterId;
    /*
    contract.methods.vote(sessionId, actualVoterId, candidateName).call((error, result) => {
      if (error) {
        res.send(error);
      } else {
        res.send(result);
      }
    });
    */
  } catch (err) {
    console.error('Error finding voterId:', err);
    res.sendStatus(500);
  }
});

  
app.get('/getResult/:sessionId', auth, async (req, res) => {
    const sessionId = parseInt(req.params.sessionId, 10)
    // contract.methods.getVoteResults(sessionId).call((error, result) => {
    //     if (error) {
    //         res.send(error)
    //     } else {
    //         res.send(result)
    //     }
    // })
    res.sendStatus(200)
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
});
