import React, { useState, useEffect } from 'react'
import { useParams } from "react-router-dom"
import { Form, Button, Container, Row, Col, Dropdown, DropdownButton } from 'react-bootstrap'
import Axios from 'axios'
import { pollsMockData } from './MockData';

export default function Join() {

  let params = useParams();
  let pollID = parseInt(params.sessionId)
  console.log(params);


  const [voterId, setVoter] = useState('');
  const [data, setData] = useState(pollsMockData/*replace with []*/)
  const sessionId = params.sessionId
  const [message, setMessage] = useState('');
  const [selectedName, setSelectedName] = useState('')

  const session = data.find((session) => session.sessionId === pollID)
  const candidates = session ? session.candidates : [];

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const result = await fetch("http://localhost:3000/votingSessions");
  //     const jsonResult = await result.json();
  //     setData(jsonResult);
  //   };
  //   fetchData();
  // }, []);

  const handleVote = () => {
    Axios.post("http://localhost:3000/vote", {
      voterId: voterId,
      sessionId: pollID,
      candidateName: selectedName,
    }).then((response) => {
      setMessage(response.data.message)
    });
  }

  const handleSelect = (value) => {
    setSelectedName(value);
  };

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
              <Form.Label>Select a Candidate</Form.Label>
              {/* <Form.Control type="text" placeholder="Enter Candidate Name you are voting for" onChange={(e) => setName(e.target.value)}/> */}
              <Dropdown onSelect={handleSelect}>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  {selectedName ? selectedName : 'Select a Value'}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {candidates.map(candidate=>
                    <Dropdown.Item key={candidate} eventKey={candidate}>{candidate}</Dropdown.Item>
                    )}
                </Dropdown.Menu>
              </Dropdown>
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
