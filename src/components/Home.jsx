import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import axios from 'axios';

export default function Home() {
  const [username, setUsername] = useState('');

  // Fetch the username from the backend
  useEffect(() => {
    fetch("http://localhost:3000/user", {
      credentials: "include", // Ensures cookies are sent with the request
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        return response.json();
      })
      .then((data) => setUsername(data.displayName))
      .catch((error) => console.error("Error fetching username:", error));
  }, []);

  // Get username from URL parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const user = params.get("user");
    if (user) setUsername(user);
  }, []);
  
  // Navigate to playlist page
  function playlist() {
    window.location.href = 'http://localhost:3001/playlists';
  }

  // Navigate to top tracks page
  function topTracks() {
    window.location.href = 'http://localhost:3001/top-tracks';
  }

  return (
    <div className='home'>
      <Navbar />
      <h3>Home | {username}</h3>
      <p>Home Component</p>
      <button onClick={playlist} className='playlist-btn'>Playlist</button><br />
      <button onClick={topTracks} className='playlist-btn'>Top Tracks</button>
    </div>
  );
}
