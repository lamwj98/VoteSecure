import React, { useState, useEffect } from 'react'
import { useParams } from "react-router-dom"
import { resultsMockData } from './MockData';
import { Table } from 'react-bootstrap';
import VoteData from './voteData';

export default function Results() {
    const [data, setData] = useState(resultsMockData);
    const [ongoing, setStatus] = useState(false);

    let params = useParams();
    console.log(params);

    // useEffect(() => {
    //   const fetchStatus = async () => {
    //     const response = await fetch(`http://localhost:3000/isSessionOngoing/${params.sessionId}`);
    //     const jsonResult = await response.json();
    //     setStatus(jsonResult);
    //   };
    //   fetchStatus();
    // }, []);

    // useEffect(() => {
    //     const fetchStatus = async () => {
    //       const response = await fetch(`http://localhost:3000/getResult/${params.sessionId}`);
    //       const jsonResult = await response.json();
    //       setStatus(jsonResult);
    //     };
    //     fetchStatus();
    //   }, []);


    if (ongoing === true) {
        return (
            <h2>Ongoing poll, check again when it is over.</h2>
        )
    } else {
        return (
            <Table striped bordered hover>
            <thead>
                <tr>
                <th>Candidate</th>
                <th>Votes</th>
                </tr>
            </thead>
            <tbody>
                <VoteData users={data}/>
            </tbody>
            </Table>
        )
    }
}