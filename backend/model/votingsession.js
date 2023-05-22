const mongoose = require("mongoose");

const votingSessionSchema = new mongoose.Schema({
  description: { type: String },
  candidates: [{ name: String }],
  sessionId: { type: String },
  votersTableId: { type: String },
});

module.exports = mongoose.model("VotingSession", votingSessionSchema);