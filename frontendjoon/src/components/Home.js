import React, { Component } from 'react';
import { Button, Card, Row, Col, Container, Image,  } from "react-bootstrap";

export default class Home extends Component {
    render(){
        return (
            <div className="Home">
                <main>
                    <Container>
                    <Row className="px-4 my-5">
                        <Col sm={7}>
                        <Image
                        src = "https://dummyimage.com/700x250/000/fff.jpg&text=LOGO"
                        fluid
                        rounded
                        />
                        </Col>
                        <Col sm={5}>
                        <h1 class="display-5"> VoteSecure</h1>
                        <p class="mt-4">
                            VoteSecure is a blockchain based decentralized voting application that
                            allows users to create voting sessions online and conduct them in a secure
                            manner by storing votes and sessions on the Ethereum blockchain network
                        </p>
                        <Button variant = "outline-primary"> Learn More</Button>
                        </Col>
                    </Row>
                    <Row>
                        <Card className="text-center bg-secondary text-white py-2">
                        <Card.Body>
                            Select one of the options below to do something
                        </Card.Body>
                        </Card>
                    </Row>
                    <Row className="my-5">
                        <Col>
                        <Card style={{ width: '25rem' }}>
                            <Card.Img variant="top" src="https://dummyimage.com/500x300/000/fff.jpg&text=IMAGE" />
                            <Card.Body>
                            <Card.Title>Start Session</Card.Title>
                            <Card.Text>
                                Create a new secure voting session for whatever purpose 
                            </Card.Text>
                            <Button  variant="outline-primary">Create New Session</Button>
                            </Card.Body>
                        </Card>
                        </Col>
                        <Col>
                        <Card style={{ width: '25rem' }}>
                            <Card.Img variant="top" src="https://dummyimage.com/500x300/000/fff.jpg&text=IMAGE" />
                            <Card.Body>
                            <Card.Title>Participate</Card.Title>
                            <Card.Text>
                                Participate in an active session and make your vote!
                            </Card.Text>
                            <Button variant="outline-primary">Join Session</Button>
                            </Card.Body>
                        </Card>
                        </Col>
                        <Col>
                        <Card style={{ width: '25rem' }}>
                            <Card.Img variant="top" src="https://dummyimage.com/500x300/000/fff.jpg&text=IMAGE" />
                            <Card.Body>
                            <Card.Title>Vote Results</Card.Title>
                            <Card.Text>
                                Track vote counts for all active voting sessions live and check
                                results for all previous sessions
                            </Card.Text>
                            <Button variant="outline-primary">View Results</Button>
                            </Card.Body>
                        </Card>
                        </Col>
                    </Row>
                    </Container>
                </main>
            </div>
        );
    }
}