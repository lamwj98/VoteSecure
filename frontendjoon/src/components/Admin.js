import React, { useState, useContext } from 'react'
import { Form, Button, Container, Row, Col } from 'react-bootstrap'
import Axios from 'axios'
import { AuthContext } from './AuthContext';

export default function Admin() {

    const { isLoggedIn } = useContext(AuthContext);
    
    const [startid, setStart] = useState('');
    const [endid, setEnd] = useState('');
    const [message, setMessage] = useState('');

    const [description, setDescription] = useState('');
    const [candidateinput, setinput] = useState('');
    const [voterinput, setinputvoter] = useState('');

    const handleCreate = () => {
        const candidatelist = candidateinput.split(", ");
        const voterlist = voterinput.split(", ");
        Axios.post("http://localhost:3000/createVotingSession", {
        token: localStorage.getItem('token'),
        description: description,
        candidates: candidatelist,
        voters: voterlist,
        }).then((response) => {
        setMessage(response.data.message)
        });
    }
    
    const handleStart = () => {
        Axios.post(`http://localhost:3000/startSession${startid}`, {
        }).then((response) => {
          setMessage(response.data.message)
        });
      }
    
      const handleEnd = () => {
        Axios.post(`http://localhost:3000/endSession${endid}`, {
        }).then((response) => {
          setMessage(response.data.message)
        });
      }

      return (
      <div>
        {isLoggedIn? (
            <Container>
                <Row md={1}>
                    <Col md={10}>
                    <Form>
                        <h3>Create a Voting Session</h3>
                        <Form.Group >
                            <Form.Label>Description</Form.Label>
                            <Form.Control 
                            className="w-60"
                            as="textarea" rows={3}
                            type="text" placeholder="Enter Description" onChange={(e) => setDescription(e.target.value)}/>
                            </Form.Group>
                            <Form.Group className="mb-3">
                            <Form.Label>Candidates</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter the names of Candidates in the following format: 'Candidate1, Candidate2, etc..'"
                                onChange={(e) => setinput(e.target.value)} />
                            {/* <Button className='mt-2' onClick={addUserName}>Add Candidate</Button> */}
                            </Form.Group>
                            <Form.Group className="mb-3">
                            <Form.Label>Voters</Form.Label>
                            <Form.Control
                                type="text"
                                className="form-control mt-1"
                                placeholder="Enter the names of Voters in the following format: 'Voter1, Voter2, etc..'"
                                onChange={(e) => setinputvoter(e.target.value)} />
                            {/* <Button className='mt-2' onClick={addvoter}>Add Voter</Button> */}
                            </Form.Group>
                            <Button className='mt-4' variant="primary" type="submit" onClick={handleCreate}>
                            Create
                            </Button>
                            <h2>{message}</h2>
                        <h3>Start a Voting Session</h3>
                        <Form.Group className="mt-1">
                            <Form.Label>ID of session to start</Form.Label>
                            <Form.Control type="text" placeholder="Enter Session ID" onChange={(e) => setStart(e.target.value)}/>
                        </Form.Group>
                        <Button className="mt-2" onClick={handleStart}>Start Session</Button>
                        <h3>End a Voting Session</h3>
                        <Form.Group className="mt-4">
                            <Form.Label>ID of session to end</Form.Label>
                            <Form.Control type="text" placeholder="Enter Session ID" onChange={(e) => setEnd(e.target.value)}/>
                        </Form.Group>
                        <Button className="mt-2" onClick={handleEnd}>End Session</Button>
                        <h3>{message}</h3>
                    </Form>
                    </Col>
                </Row>
            </Container>
        ) : (
            <h2>Please Log in</h2>
        )}
        </div>
      )
}
