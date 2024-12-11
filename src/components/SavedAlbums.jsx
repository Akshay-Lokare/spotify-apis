import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';

export default function SavedAlbums() {

  const [userData, setUserData] = useState(null);
  const [albumData, setAlbumData] = useState([]);
  const [error, setError] = useState('');

  // Fetch user data
  useEffect(() => {
    axios
      .get('http://localhost:3000/user', { withCredentials: true }) 
      .then((response) => {
        setUserData(response.data);
      })
      .catch((error) => {
        setError('Failed to fetch user data.');
        console.error(error);
      });
  }, []);

  // Fetch saved albums
  useEffect(() => {
    axios
      .get('http://localhost:3000/saved-albums', { withCredentials: true }) 
      .then((response) => {
        setAlbumData(response.data.savedAlbums); 
      })
      .catch((error) => {
        setError('Failed to fetch albums.');
        console.error(error);
      });
  }, []);

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  // Ensure userData is available before rendering
  if (!userData) {
    return <div style={styles.loading}>Loading user data...</div>;
  }

  return (
    <div style={styles.container}>
      <Navbar />
      <h3 style={styles.heading}>{userData.name}'s Saved Albums</h3>
      <ul style={styles.albumList}>
        {albumData.map((album, index) => (
          <li key={index} style={styles.albumItem}>
            {album.image && <img src={album.image} alt={album.name} style={styles.albumImage} />}
            <span style={styles.albumName}>{album.name}</span><br />
            <p>{album.link ? album.link : 'No Link Available'}</p>
          </li> 
        ))}
      </ul>
    </div>
  );
}

const styles = {
  container: {
    padding: '40px', // Increased padding
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f7f7f7',
    minHeight: '100vh',
  },
  heading: {
    textAlign: 'center',
    color: '#333',
    fontSize: '36px', // Increased font size
    marginBottom: '40px', // Increased margin
  },
  albumList: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    listStyleType: 'none',
    padding: '0',
  },
  albumItem: {
    backgroundColor: '#fff',
    marginBottom: '25px', // Increased bottom margin
    padding: '25px', // Increased padding
    borderRadius: '10px', // Slightly larger border-radius
    width: '85%', // Increased width
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)', // Increased shadow
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: '15px', // Increased gap between image and name
  },
  albumImage: {
    width: '80px', // Increased image size
    height: '80px', // Increased image size
    borderRadius: '10px', // Increased border-radius
  },
  albumName: {
    fontSize: '22px', // Increased font size for album name
    color: '#444',
  },
  error: {
    textAlign: 'center',
    color: 'red',
    fontSize: '20px', // Increased font size for error message
  },
  loading: {
    textAlign: 'center',
    color: '#555',
    fontSize: '20px', // Increased font size for loading message
  },
};
