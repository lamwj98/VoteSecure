import React, { useState, useEffect } from 'react'
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom'
import { pollsMockData } from './MockData';

export default function List() {

  const [data, setData] = useState(pollsMockData);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const result = await fetch("http://localhost:3000/votingSessions");
  //     const jsonResult = await result.json();
  //     setData(jsonResult);
  //   };
  //   fetchData();
  // }, []);

  return (
    <div>
      <h2>List of Polls</h2>
      {data.map(poll =>
        <div key={poll.sessionId} className='poll_ID'>
          <h3>{poll.sessionId}</h3>
          <p>{poll.description}</p>
          <Link to = {`/List/Results/${poll.sessionId}`}>
            <Button variant="outline-primary">View Results</Button>
          </Link>
        </div>
          )}
    </div>
  )
}
