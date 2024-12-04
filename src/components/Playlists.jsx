import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import axios from 'axios';

const Playlists = () => {
  const [playlists, setPlaylists] = useState([]);

  // Fetch playlists after component mounts
  useEffect(() => {
    axios.get('/playlists')  // No need to mention localhost:3000, as it's handled by the proxy
      .then(response => {
        setPlaylists(response.data.playlists);
      })
      .catch(error => {
        console.error('Error fetching playlists:', error);
      });
  }, []);

  return (
    <div className="playlists-container">
      <Navbar />
      <h3>Your Playlists:</h3>
      {playlists.length > 0 ? (
        <ul>
          {playlists.map((playlist) => (
            <li key={playlist.id}>
              <strong>{playlist.name}</strong><br />
              {playlist.description ? playlist.description : <span className="no-description">No description</span>}<br /><br />
              <a href={playlist.url} target="_blank" rel="noopener noreferrer">Open Playlist</a>
            </li>
          ))}
        </ul>
      ) : (
        <p>No playlists found.</p>
      )}
    </div>
  );
};

export default Playlists;
