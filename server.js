const express = require("express");
const cors = require("cors");
const axios = require("axios");
const querystring = require("querystring");
require("dotenv").config();
const session = require("express-session");

const app = express();
const PORT = 3000;

app.use(cors({ origin: "http://localhost:3001", credentials: true }));
app.use(session({ secret: 'spotify_auth', resave: false, saveUninitialized: true }));

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;

app.get('/', (req, res) => {
    res.json({ "msg": `Spotify API server is running on ${PORT}` });
});

app.get("/login", (req, res) => {
    const scope = "user-read-private user-read-email user-top-read";  // Permissions for user info
    const authUrl = `https://accounts.spotify.com/authorize?${querystring.stringify({
        response_type: "code",
        client_id,
        scope,
        redirect_uri,
    })}`;

    res.redirect(authUrl);
});

// Callback from Spotify after successful authentication
app.get("/callback", async (req, res) => {
    const code = req.query.code || null;

    if (!code) {
        return res.status(400).send("Login failed: Missing authorization code.");
    }

    try {
        const tokenUrl = "https://accounts.spotify.com/api/token";
        const tokenResponse = await axios.post(
            tokenUrl,
            querystring.stringify({
                code,
                redirect_uri,
                grant_type: "authorization_code",
            }),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: `Basic ${Buffer.from(`${client_id}:${client_secret}`).toString("base64")}`,
                },
            }
        );

        const { access_token, refresh_token } = tokenResponse.data;

        // Save tokens securely in session
        req.session.accessToken = access_token;
        req.session.refreshToken = refresh_token;

        // Fetch user profile
        const userProfileResponse = await axios.get("https://api.spotify.com/v1/me", {
            headers: { Authorization: `Bearer ${access_token}` },
        });

        const user = userProfileResponse.data;
        req.session.user = {
            displayName: user.display_name,
            email: user.email,
        };

        res.status(200).send(`
            <h1>Login Successful</h1>
            <p>Welcome, ${user.display_name}</p>
            <p>Email: ${user.email}</p>
        `);
    } catch (error) {
        console.error("Error during login:", error.response?.data || error.message);
        res.status(400).send("Login failed: Unable to retrieve access token.");
    }
});

app.get('/user', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).send('User not logged in');
    }

    try {
        const accessToken = req.session.accessToken;
        const userDetailsResponse = await axios.get('https://api.spotify.com/v1/me', {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        const user = userDetailsResponse.data;

        res.status(200).json({
            name: user.display_name,
            country: user.country,
            email: user.email,
            id: user.id,
        });
    } catch (error) {
        console.error(`Error fetching user data: ${error}`);
        res.status(500).send(`Error fetching user data: ${error.message}`);
    }
});

// Route to get user's playlists
app.get('/playlists', async (req, res) => {
    if (!req.session.accessToken) {
        return res.status(401).send("Unauthorized: No access token found. Login to get a new token.");
    }

    try {
        const playlistResponse = await axios.get('https://api.spotify.com/v1/me/playlists', {
            headers: { Authorization: `Bearer ${req.session.accessToken}` },
        });

        const playlists = playlistResponse.data.items;

        res.status(200).send({
            playlists: playlists.map((playlist) => ({
                name: playlist.name,
                id: playlist.id,
                description: playlist.description || 'No description available',
                url: playlist.external_urls.spotify,
            })),
        });
    } catch (error) {
        console.error("Error fetching playlists:", error.response?.data || error.message);
        res.status(500).send("Error fetching playlists.");
    }
});

// Route to get user's top tracks
app.get('/top-songs', async (req, res) => {
    if (!req.session.accessToken) {
        return res.status(401).send("Unauthorized: No access token found. Login to get the new token.");
    }

    try {
        const topTracksResponse = await axios.get('https://api.spotify.com/v1/me/top/tracks', {
            headers: { Authorization: `Bearer ${req.session.accessToken}` },
            params: {
                time_range: 'long_term',
                limit: 30,
            }
        });

        const topTracks = topTracksResponse.data.items;

        res.status(200).send({
            topTracks: topTracks.map((track) => ({
                name: track.name,
                artist: track.artists.map((artist) => artist.name).join(', '),
                album: track.album.name,
                href: track.external_urls.spotify,
                imageUrl: track.album.images[0].url,
            })),
        });
    } catch (error) {
        console.error("Error fetching top tracks:", error.response?.data || error.message);
        res.status(500).send("Error fetching top tracks.");
    }
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
