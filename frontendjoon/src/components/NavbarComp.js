import React, { Component, Fragment } from 'react';
import { Nav, Navbar, Container, NavDropdown, Button } from "react-bootstrap";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Create from './Create';
import Home from './Home';
import Join from './Join';
import Results from './Results';
import Learn from './Learn';
import Login from './Login';


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
                        <Nav.Link as={Link} to ={"/"}>Home</Nav.Link>
                        <NavDropdown title="Actions" id="basic-nav-dropdown">
                            <NavDropdown.Item as={Link} to ={"/Create"}>Create New Session</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to ={"/Join"}>
                            Join Session
                            </NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item as={Link} to ={"/Results"}>
                            View Results
                            </NavDropdown.Item>
                        </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                    </Container>
                    <Nav className="justify-content-end me-4">
                        <Nav.Item>
                            <Nav.Link as={Link} to ={"/Login"}>
                                <Button  variant="outline-primary">Login</Button>
                            </Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Navbar>
                <Routes>
                    <Fragment>
                    <Route exact path='/Create' element={<Create/>}/>
                    <Route exact path='/' element={<Home/>}/>
                    <Route exact path='/Join' element={<Join/>}/>
                    <Route exact path='/Results' element={<Results/>}/>
                    <Route exact path='/Learn' element={<Learn/>}/>
                    <Route exact path='/Login' element={<Login/>}/>
                    </Fragment>
                </Routes> 
            </div>
            </Router>
        )
    }
}