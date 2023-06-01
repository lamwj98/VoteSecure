import React, { useState, useContext } from 'react'
import { Form, Button, Container, Row, Col } from 'react-bootstrap'
import Axios from "axios"
import { AuthContext } from './AuthContext';

export default function Create() {

  const { isLoggedIn } = useContext(AuthContext);
  // const [token, setToken] = useState('');
  const [description, setDescription] = useState('');
  const [candidateinput, setinput] = useState('');
  const [voterinput, setinputvoter] = useState('');
  const [message, setMessage] = useState('');
  var candidatelist = [];
  var voterlist = [];

  const addUserName = () => {
    if(candidateinput !== ""){
     candidatelist.push(candidateinput);
     setinput("")
     return;
    }
    alert("Empty Field")
   }

  const addvoter = () => {
    if(voterinput !== ""){
     voterlist.push(voterinput);
     setinputvoter("")
     return;
    }
    alert("Empty Field")
   }

  const handleCreate = () => {
    Axios.post("http://localhost:3000/createVotingSession", {
      token: localStorage.getItem('token'),
      description: description,
      candidates: candidatelist,
      voters: voterlist,
    }).then((response) => {
      setMessage(response.data.message)
    });
  }

  return (
    <div>
    {isLoggedIn? (
      <Container>
        <Row md={1}>
          <Col md={15}>
          <Form>
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
                placeholder="Enter a Candidate Name and Click 'Add Candidate'"
                onChange={(e) => setinput(e.target.value)} />
              <Button className='mt-2' onClick={addUserName}>Add Candidate</Button>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Voters</Form.Label>
              <Form.Control
                type="text"
                className="form-control mt-1"
                placeholder="Enter a Voter Name and Click 'Add Voter'"
                onChange={(e) => setinputvoter(e.target.value)} />
              <Button className='mt-2' onClick={addvoter}>Add Voter</Button>
            </Form.Group>
            <Button className='mt-4' variant="primary" type="submit" onClick={handleCreate}>
              Create
            </Button>
            <h2>{message}</h2>
          </Form>
          </Col>
        </Row>
      </Container>
    ): (
      <h2> Please Log In </h2>
    )}
    </div>
  )
}