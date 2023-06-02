import React, { Fragment, useContext } from 'react';
import { Nav, Navbar, Container, NavDropdown, Button } from "react-bootstrap";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from './Home';
import Join from './Join';
import List from './List';
import Learn from './Learn';
import Login from './Login';
import Results from './Results';
import Admin from './Admin';
import Voter from './Voter';
import { AuthContext } from './AuthContext';
import LogoutButton from './Logout';    
import './navbar.css';


export default function NavbarComp() {
    const { isLoggedIn } = useContext(AuthContext);

        return (
            <Router>
            <div>
                <Navbar className='color-nav' variant="light" expand="lg">
                    <Container>
                    <Navbar.Brand href="#home">VoteSecure</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                        <Nav.Link as={Link} to ={"/"}>Home</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                    </Container>
                    <Nav className="justify-content-end me-4">
                        <Nav.Item>
                            {isLoggedIn? (
                                <LogoutButton/>
                            ): (
                                <Nav.Link as={Link} to ={"/Login"}>
                                    <Button variant="primary">Login</Button>
                                </Nav.Link>
                            )}
                        </Nav.Item>
                    </Nav>
                </Navbar>
                <Routes>
                    <Fragment>
                    <Route exact path='/' element={<Home/>}/>
                    <Route exact path='/Join/:sessionId' element={<Join/>}/>
                    <Route exact path='/List' element={<List/>}/>
                    <Route exact path='/Learn' element={<Learn/>}/>
                    <Route exact path='/Login' element={<Login/>}/>
                    <Route exact path='/Admin' element={<Admin/>}/>
                    <Route exact path='/Voter' element={<Voter/>}/>
                    <Route exact path='/Voter/Results/:sessionId' element={<Results/>}/>
                    </Fragment>
                </Routes> 
            </div>
            </Router>
        )
}