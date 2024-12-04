import React from 'react';
import Navbar from './Navbar';

const UserInfo = ({ user }) => {
  return (
    <div>
      <Navbar />
      <h2>Welcome, {user.display_name}</h2>
      <p>Email: {user.email}</p>
    </div>
  );
};

export default UserInfo;
