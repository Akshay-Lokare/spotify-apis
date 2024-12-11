import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const LikedTracks = () => {
  const [tracks, setTracks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLikedTracks = async () => {
      try {
        const response = await axios.get('/liked-tracks');
        setTracks(response.data.savedTracks);
      } catch (err) {
        setError(err.response?.data || 'Error fetching liked tracks');
      }
    };

    fetchLikedTracks();
  }, []);

  if (error) {
    return <div className="liked-tracks-error">{error}</div>;
  }

  return (
    <div className="liked-tracks">
        <Navbar />
      <h1 className="liked-tracks-title">Liked Tracks</h1>
      {tracks.length > 0 ? (
        <table className="liked-tracks-table">
          <thead className="liked-tracks-header">
            <tr>
              <th className="liked-tracks-cell">#</th>
              <th className="liked-tracks-cell">Cover</th>
              <th className="liked-tracks-cell">Track Name</th>
              <th className="liked-tracks-cell">Artist</th>
              <th className="liked-tracks-cell">Album</th>
              <th className="liked-tracks-cell">Link</th>
            </tr>
          </thead>
          <tbody>
            {tracks.map((track, index) => (
                <tr key={index} className="liked-tracks-row">
                <td className="liked-tracks-cell">{index + 1}</td>
                <td className="liked-tracks-cell">
                    <img
                    src={track.image}
                    alt={`Album art for ${track.name}`}
                    className="liked-tracks-image"
                    />
                </td>
                <td className="liked-tracks-cell">{track.name}</td>
                <td className="liked-tracks-cell">{track.artist}</td>
                <td className="liked-tracks-cell">{track.album}</td>
                <td className="liked-tracks-cell">
                    <a
                    href={track.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="liked-tracks-link"
                    >
                    Listen
                    </a>
                </td>
                </tr>
            ))}
            </tbody>

        </table>
      ) : (
        <p className="liked-tracks-loading">Loading tracks...</p>
      )}
    </div>
  );
};

export default LikedTracks;
