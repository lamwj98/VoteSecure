import React, { useState } from 'react'
import { Form, Button, Container, Row, Col } from 'react-bootstrap'
import Axios from 'axios'

export default function Join() {

  const [voterId, setVoter] = useState('');
  const [sessionId, setSession] = useState('');
  const [candidateName, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleVote = () => {
    Axios.post("http://localhost:3000/vote", {
      voterId: voterId,
      sessionId: sessionId,
      candidateName: candidateName,
    }).then((response) => {
      setMessage(response.data.message)
    });
  }

  return (
    <Container>
        <Row md={1}>
          <Col md={5}>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Voter ID</Form.Label>
              <Form.Control type="text" placeholder="Enter Voter ID" onChange={(e) => setVoter(e.target.value)}/>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Session ID</Form.Label>
              <Form.Control type="text" placeholder="Enter Session ID" onChange={(e) => setSession(e.target.value)}/>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Candidate Name</Form.Label>
              <Form.Control type="text" placeholder="Enter Candidate Name you are voting for" onChange={(e) => setName(e.target.value)}/>
            </Form.Group>

            <Button className='mt-4' variant="primary" type="submit" onClick={handleVote}>
              Vote!
            </Button>
            <h3>{message}</h3>
          </Form>
        </Col>
      </Row>
    </Container>
  )
}
