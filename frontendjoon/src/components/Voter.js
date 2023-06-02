import React, { useState, useEffect } from 'react';
import { Button, Card, Row, Col, Container, ListGroup, ListGroupItem } from "react-bootstrap";
import { pollsMockData } from './MockData';
import { Link } from 'react-router-dom'
import Axios from 'axios'

export default function Voter() {
    const [data, setData] = useState(pollsMockData);
    const ongoing = false
    const activesessions = [];
    const inactivesessions = [];

    activesessions.push(data[0])

    // useEffect(() => {
    //   const fetchData = async () => {
    //     const result = await fetch("http://localhost:3000/votingSessions");
    //     const jsonResult = await result.json();
    //     setData(jsonResult);
    //   };
    //   fetchData();
    // }, []);

    // useEffect(() => {
    //     if (sessionID) {
    //         const fetchStatus = async () => {
    //         const response = await fetch(`http://localhost:3000/getResult/${sessionID}`);
    //         const jsonResult = await response.json();
    //         setStatus(jsonResult);
    //         };
    //         fetchStatus();
    //     }
    //   }, [sessionID]);

    // useEffect(() => {
    //     const fetchStatus = async () => {
    //         for (const poll of data) {
    //             try {
    //                 const response = await Axios.get(`http://localhost:3000/getResult/${poll.sessionId}`)
    //                 if (response.data) {
    //                     activesessions.push(poll)
    //                 } else {
    //                     inactivesessions.push(poll)
    //                 }
    //             } catch (error) {
    //                 console.error(`Error fetching data`, error)
    //             }
    //         }
    //     };
    //     fetchStatus();
    // }, [data])

    for (const poll of data) {
        if (ongoing) {
            activesessions.push(poll)
        } else {
            inactivesessions.push(poll)
        }
    }

    return (
        <div>
            <Container>
                <Row className='my-4'>
                    <Col>
                    <Card border="primary" >
                        <Card.Body>
                            <Card.Title>Active Sessions</Card.Title>
                        </Card.Body>
                    </Card>
                        <ListGroup className='mt-4'>
                            {activesessions.map((poll) =>
                                <Link to = {`/Join/${poll.sessionId}`}>
                                <ListGroupItem>{poll.description}</ListGroupItem>
                                </Link>
                            )}
                        </ListGroup>
                    </Col>
                    <Col>
                    <Card border="primary">
                        <Card.Body>
                            <Card.Title>Inactive Sessions</Card.Title>
                        </Card.Body>
                    </Card>
                        <ListGroup className='mt-4'>
                            {inactivesessions.map((poll) =>
                                <Link to = {`/Voter/Results/${poll.sessionId}`}>
                                <ListGroupItem action >{poll.description}</ListGroupItem>
                                </Link>
                            )}
                        </ListGroup>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}