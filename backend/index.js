const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const TOKEN_KEY = 'eda059d2';
require('dotenv').config();

const User = require("./model/user");
const VotingSession = require("./model/votingsession");
const VotersTable = require("./model/votersTable");

const app = express();
const port = 3000;
const Web3 = require('web3');
// const providerUrl = '';
// const web3 = new Web3(providerUrl);

const auth = require("./middleware/auth");

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const { connect } = require('./config/database');

connect();

app.post("/register", async (req, res) => {

  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).send("Missing inputs!");
    }
    const oldUser = await User.findOne({ username });
    
    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    encryptedPassword = await bcrypt.hash(password, 10);
    await User.create({
      username, 
      password: encryptedPassword,
    });

    res.status(201).send("User successfully created!")
  } catch (err) {
    console.log(err);
  }
});
  
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!(username && password)) {
      return res.status(400).send("All input is required");
    }

    const user = await User.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { user_id: user._id, username },
        TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      return res.status(200).json({token: token});
    } else {
      return res.status(400).send("Invalid Credentials");
    }
  } catch (err) {
    console.log(err);
  }
});

app.post('/logout', (req, res) => {
    res.clearCookie('jwt'); 
    res.sendStatus(200);
  });
  
app.post('/createVotingSession', auth, (req, res) => {
  const { description, candidates, voters } = req.body;

  if (!description || !candidates || !voters) {
    res.status(400).send("Missing inputs");
  }

  contract.methods.createSession(voters.length, candidates).call((error, result) => {
    if (error) {
        res.status(400).send(error)
    } else {
      try {
        const session = new VotingSession({
          description: description,
          candidates: candidates,
          sessionId: result
        })

        for (var i = 0; i< voters.length; i++) {
          const voter = new VotersTable({nationalIdentity: voters[i], voterId: i, sessionId: session})
          voter.save()
        }

        res.status(200).send(session.json())

      } catch (err) {
        res.status(400).send(err)
      }
    }
  })
});

app.post('/vote', async (req, res) => {
  const { voterId, sessionId, candidateName } = req.body;

  try {
    const session = await VotingSession.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const matchedVoter = VotersTable.find({sessionId: session._id, nationalIdentity: voterId});
    if (!matchedVoter) {
      return res.status(404).json({ error: 'Voter not registered for voting' });
    }
    const actualVoterId = matchedVoter.voterId;

    // contract.methods.vote(sessionId, actualVoterId, candidateName).call((error, result) => {
    //   if (error) {
    //     res.status(400).send(error);
    //   } else {
    //     res.status(200).send(result);
    //   }
    // });
  } catch (err) {
    res.status(400).send(err);
  }
});

app.get('/isSessionOngoing/:sessionId', auth, async (req, res) => {
  const sessionId = parseInt(req.params.sessionId, 10)
  // contract.methods.isSessionOngoing(sessionId).call((error, result) => {
  //     if (error) {
  //         res.status(400).send(error)
  //     } else {
  //         res.status(200).send(result)
  //     }
  // })
  console.log(sessionId)
  res.sendStatus(200)
})
  
app.get('/getResult/:sessionId', auth, async (req, res) => {
    const sessionId = parseInt(req.params.sessionId, 10)
    // contract.methods.getVoteResults(sessionId).call((error, result) => {
    //     if (error) {
    //         res.status(400).send(error)
    //     } else {
    //         res.status(200).send(result)
    //     }
    // })
})

app.post('/endSession/:sessionId', auth, async (req, res) => {
  const sessionId = parseInt(req.params.sessionId, 10)
  // contract.methods.endSession(sessionId).call((error, result) => {
  //     if (error) {
  //         res.status(400).end(error)
  //     } else {
  //         res.status(200).send(result)
  //     }
  // })
})

app.post('/startSession/:sessionId', auth, async (req, res) => {
  const sessionId = req.params.sessionId
  // contract.methods.startSession(sessionId).call((error, result) => {
  //     if (error) {
  //         res.status(400).send(error)
  //     } else {
  //         res.status(200).send(result)
  //     }
  // })
}); 

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
});
