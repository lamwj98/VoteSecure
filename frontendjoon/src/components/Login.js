import './Login.css'
import React, { useState, useContext } from "react"
import Axios from "axios"
import { Link } from 'react-router-dom'
import { Button } from 'react-bootstrap';
import { AuthContext } from './AuthContext';

export default function Login() {

  const [usernameReg, setUsernameReg] = useState('');
  const [passwordReg, setPasswordReg] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { isLoggedIn, login } = useContext(AuthContext);

  const handleloggedin = () => {
    login();
  };


  let [authMode, setAuthMode] = useState("signin")

  const changeAuthMode = () => {
    setAuthMode(authMode === "signin" ? "signup" : "signin")
  }

  const handleRegister = () => {
    Axios.post("http://localhost:3000/register", {
      username: usernameReg,
      password: passwordReg,
    }).then((response) => {
      setMessage(response.data.message)
    });
  };

  const handleLogin = () => {
    Axios.post("http://localhost:3000/login", {
      username: username,
      password: password,
    }).then((response) => {
      const token = response.data.token;
      localStorage.setItem('token', token)
      setMessage(response.data.message)
    });
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     const response = await fetch('http://localhost:3000/register', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({ username, password })
  //     });

  //     const data = await response.json();

  //     if (response.ok) {
  //       setMessage(data);
  //       setUsernameReg('');
  //       setPasswordReg('');
  //     } else {
  //       setMessage(data);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
    
  // }

  // const handleLogin = async () => {
  //   const url = '/login'; // Replace with the actual backend URL

  //   try {
  //     const response = await fetch(url, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ username, password }),
  //     });

  //     if (response.ok) {
  //       const data = await response.json();
  //       const token = data.token;
  //       // Handle successful login and token retrieval
  //       console.log('Login successful. Token:', token);
  //     } else {
  //       // Handle error response
  //       const errorData = await response.json();
  //       setError(errorData.error);
  //     }
  //   } catch (error) {
  //     // Handle network or other errors
  //     console.error('An error occurred during login:', error);
  //   }
  // };
  if (isLoggedIn) {
    return (
    <div>
      <h2>You are logged in</h2>
      <Link as={Link} to ={"/Admin"}>
          <Button  variant="primary">Go to Admin Page</Button>
      </Link>
    </div>
    ) 
  }

  if (authMode === "signin") {
    return (
      <div className="Auth-form-container">
        <form className="Auth-form">
          <div className="Auth-form-content">
            <h3 className="Auth-form-title">Sign In</h3>
            <div className="text-center">
              Not registered yet?{" "}
              <span className="link-primary" onClick={changeAuthMode}>
                Sign Up
              </span>
            </div>
            <div className="form-group mt-3">
              <label>Username</label>
              <input
                type="text"
                className="form-control mt-1"
                placeholder="Enter username"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="form-group mt-3">
              <label>Password</label>
              <input
                type="password"
                className="form-control mt-1"
                placeholder="Enter password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="d-grid gap-2 mt-3">
              <button type="submit" className="btn btn-primary" onClick={()=> {handleLogin(); handleloggedin(); }}>
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="Auth-form-container">
      <form className="Auth-form">
        <div className="Auth-form-content">
          <h3 className="Auth-form-title">Sign Up</h3>
          <div className="text-center">
            Already registered?{" "}
            <span className="link-primary" onClick={changeAuthMode}>
              Sign In
            </span>
          </div>
          <div className="form-group mt-3">
            <label>Username</label>
            <input
              type="text"
              className="form-control mt-1"
              placeholder="Username"
              onChange={(e) => setUsernameReg(e.target.value)}
            />
          </div>
          <div className="form-group mt-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control mt-1"
              placeholder="Password"
              onChange={(e) => setPasswordReg(e.target.value)}
            />
          </div>
          <div className="d-grid gap-2 mt-3">
            <button type="submit" className="btn btn-primary" onClick={handleRegister}> 
              Submit
            </button>
          </div>
        </div>
      </form>
      <h1>{message}</h1>
    </div>
  )
}