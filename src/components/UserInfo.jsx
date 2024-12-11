import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import axios from 'axios';

const UserInfo = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get('http://localhost:3000/user', { withCredentials: true }) // Include credentials for sessions
      .then((response) => {
        setUserData(response.data);
      })
      .catch((error) => {
        setError('Failed to fetch user data.');
        console.error(error);
      });
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="userinfo">
        <h2 className="userinfo-h2">Welcome, {userData.name}</h2>
        <p>Email: {userData.email}</p>
        <p>Country: {userData.country}</p>
        <p>Followers: {userData.followers}</p>
        <p>Id: {userData.id}</p>
      </div>
    </div>
  );
};

export default UserInfo;
