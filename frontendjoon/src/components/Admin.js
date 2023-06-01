import React, { useState, useContext } from 'react'
import { Form, Button } from 'react-bootstrap'
import Axios from 'axios'
import { AuthContext } from './AuthContext';

export default function Admin() {

    const { isLoggedIn } = useContext(AuthContext);
    
    const [startid, setStart] = useState('');
    const [endid, setEnd] = useState('');
    const [message, setMessage] = useState('');
    
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
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>ID of session to start</Form.Label>
                    <Form.Control type="text" placeholder="Enter Session ID" onChange={(e) => setStart(e.target.value)}/>
                </Form.Group>
                <Button onClick={handleStart}>Start Session</Button>
                <Form.Group className="mb-3">
                    <Form.Label>ID of session to end</Form.Label>
                    <Form.Control type="text" placeholder="Enter Session ID" onChange={(e) => setEnd(e.target.value)}/>
                </Form.Group>
                <Button onClick={handleEnd}>End Session</Button>
                <h3>{message}</h3>
            </Form>
        ) : (
            <h2>Please Log in</h2>
        )}
        </div>
      )
}
