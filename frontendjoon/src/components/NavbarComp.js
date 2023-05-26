import React, { Component, Fragment } from 'react';
import { Nav, Navbar, Container, NavDropdown } from "react-bootstrap";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Create from './Create'
import Home from './Home'

export default class NavbarComp extends Component {
    render(){
        return (
            <Router>
            <div>
                <Navbar bg="dark" variant="dark" expand="lg">
                    <Container>
                    <Navbar.Brand href="#home">VoteSecure</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                        <Nav.Link as={Link} to ={"/home"}>Home</Nav.Link>
                        <NavDropdown title="Actions" id="basic-nav-dropdown">
                            <NavDropdown.Item as={Link} to ={"/Create"}>Create New Session</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">
                            Join Session
                            </NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#action/3.4">
                            View Results
                            </NavDropdown.Item>
                        </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                    </Container>
                </Navbar>
                <Routes>
                    <Fragment>
                    <Route exact path='/Create' element={<Create/>}/>
                    <Route exact path='/Home' element={<Home/>}/>
                    </Fragment>
                </Routes>
            </div>
            </Router>
        )
    }
}