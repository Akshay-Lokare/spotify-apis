import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import axios from 'axios';

export default function TopTracks() {
    const [topTracks, setTopTracks] = useState([]);

    useEffect(() => {
        axios.get('/top-songs')
            .then(response => {
                setTopTracks(response.data.topTracks);
            })
            .catch(error => {
                console.error('Error fetching top tracks:', error);
            });
    }, []);

    return (
        <div className='top-tracks'>
            <Navbar />
            <h3>Top Tracks: </h3>
            {topTracks.length > 0 ? (
                <ul>
                    {topTracks.map((track, index) => (
                        <li key={index}>
                            <img src={track.imageUrl} alt={`${track.name} album cover`} width="100" />
                            <div>
                                <h4>{track.name}</h4>
                                <p className="artist">{track.artist}</p>
                                <p>{track.album}</p>
                                <a href={track.href} target="_blank" rel="noopener noreferrer">Open on Spotify</a>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No top tracks available.</p>
            )}
        </div>
    );
}
