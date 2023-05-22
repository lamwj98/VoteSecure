// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

/** 
 * @title Ballot
 * @dev Implements voting process along with vote delegation
 */
contract Ballot {
    struct Candidate {
        string name;
        uint voteCount;
    }

    struct CandidateSession {
        mapping(uint => Candidate) candidates;
        uint candidatesNextIndex;
    }

    struct Voter {
        bool hasVoted;
        uint voteChoice;
    }

    struct VotingSession {
        uint id;
        mapping(uint => Voter) voters;
        bool onGoing;
    }

    mapping(uint => VotingSession) public sessions;
    mapping(uint => CandidateSession) public candidateSessions;
    uint public sessionCount;
    uint public candidateSessionCount;

    constructor() {
        sessionCount = 0;
        candidateSessionCount = 0;
    }

    function createSession(uint numberOfVoters, string[] memory candidateNames) public returns (uint) {
        sessionCount++;
        candidateSessionCount++;
        VotingSession storage session = sessions[sessionCount];
        CandidateSession storage candidateSession = candidateSessions[candidateSessionCount];
        
        for (uint i = 0; i < candidateNames.length; i++) {
            candidateSession.candidates[i] = Candidate(candidateNames[i], 0);
            candidateSession.candidatesNextIndex++;
        }

        session.id = sessionCount;
        session.onGoing = false;

        for (uint i = 0; i < numberOfVoters; i++) {
            session.voters[i] = Voter(false, 0);
        }

        return sessionCount;
    }

    function startSession(uint sessionId) public {
        VotingSession storage session = sessions[sessionId];
        require(!session.onGoing, "Voting session already started.");
        session.onGoing = true;
    }

    function endSession(uint sessionId) public {
        VotingSession storage session = sessions[sessionId];
        require(session.onGoing, "Voting session is not ongoing.");
        session.onGoing = false;
    }

    function isSessionOngoing(uint sessionId) public view returns (bool) {
        return sessions[sessionId].onGoing;
    }

    function vote(uint sessionId, uint voterId, string memory candidateName) public {
        VotingSession storage session = sessions[sessionId];
        require(session.onGoing, "Voting session has not started.");
        require(candidateSessions[sessionId].candidatesNextIndex > 0, "No candidates available.");
        uint candidateId = getCandidateId(sessionId, candidateName);
        require(candidateId < candidateSessions[sessionId].candidatesNextIndex, "Invalid candidate name.");
        require(!session.voters[voterId].hasVoted, "You have already voted.");

        candidateSessions[sessionId].candidates[candidateId].voteCount++;
        session.voters[voterId] = Voter(true, candidateId);
    }

    function getCandidateId(uint sessionId, string memory candidateName) private view returns (uint) {
        CandidateSession storage candidateSession = candidateSessions[sessionId];
        for (uint i = 0; i < candidateSession.candidatesNextIndex; i++) {
            if (compareStrings(candidateSession.candidates[i].name, candidateName)) {
                return i;
            }
        }
        return candidateSession.candidatesNextIndex;
    }

    function compareStrings(string memory a, string memory b) private pure returns (bool) {
        return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
    }

    function getVoteResults(uint sessionId) public view returns (string[] memory, uint[] memory) {
        string[] memory candidateNames = new string[](candidateSessions[sessionId].candidatesNextIndex);
        uint[] memory voteCounts = new uint[](candidateSessions[sessionId].candidatesNextIndex);

        for (uint i = 0; i < candidateSessions[sessionId].candidatesNextIndex; i++) {
            Candidate storage candidate = candidateSessions[sessionId].candidates[i];
            candidateNames[i] = candidate.name;
            voteCounts[i] = candidate.voteCount;
        }

        return (candidateNames, voteCounts);
    }
}
