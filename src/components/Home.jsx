import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import axios from 'axios';

export default function Home() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3000/user', { withCredentials: true })
      .then((response) => {
        setUserData(response.data);
      })
      .catch((error) => {
        setError("Failed to fetch user data.");
        console.error(error);
      });
  }, []);

  function playlist() {
    window.location.href = 'http://localhost:3001/playlists';
  }

  function topTracks() {
    window.location.href = 'http://localhost:3001/top-tracks';
  }

  function userInfo() {
    window.location.href = 'http://localhost:3001/user-info';
  }

  function savedAlbums() {
    window.location.href = 'http://localhost:3001/saved-albums';
  }

  function likedSongs () {
    window.location.href = 'http://localhost:3001/liked-tracks'
  }


  return (
    <div className='home'>
      <Navbar />

      <h3 style={{ padding: '10px' }}>
        <span style={{ backgroundColor: 'pink', padding: '5px', color: 'white', borderRadius: '12px' }}>
          Home | {userData ? userData.name : 'Guest'}
        </span>
      </h3>

      <button onClick={playlist} className='playlist-btn'>Playlist</button><br />
      <button onClick={topTracks} className='playlist-btn'>Top Tracks</button><br />
      <button onClick={userInfo} className='playlist-btn'>User Info</button><br />
      <button onClick={savedAlbums} className='playlist-btn'>Saved Albums</button><br />
      <button onClick={likedSongs} className='playlist-btn'>Liked Songs</button><br />
    </div>
  );
}
