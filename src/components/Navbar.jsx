import React from 'react';

export default function Navbar() {
    const handleLogin = () => {
      window.location.href = 'http://localhost:3000/login';
    };

    return (
        <div className="navbar">
            <h3 className="navbar-h3">
                <a href="/">Home</a>
            </h3>
            <button onClick={handleLogin} className="navbar-btn">Login to Spotify</button>
        </div>
    );
}
