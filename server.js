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

let accessToken = null; 

app.get('/', (req, res) => {
    res.json({ "msg": `Spotify API server is running on ${PORT}` });
});

app.get('/user', (req, res) => {
    if (!req.session.user) {
        return res.status(401).send('User not logged in');
    }

    res.json(req.session.user);  // Send user data stored in session
});


app.get("/login", (req, res) => {
    const scope = "user-read-private user-read-email user-top-read";  // Defines the level of access your app is requesting from Spotify. In this case, it's requesting access to the user's private info and email.
    const authUrl = `https://accounts.spotify.com/authorize?${querystring.stringify({
        response_type: "code",  // Specifies the type of response you want from Spotify. In this case, you want an authorization code (to exchange it for an access token).
        client_id,
        scope,  // permission you're asking for
        redirect_uri, // This should match your .env value
    })}`; // authUrl builds the URL to send the user to the Spotify login page which includes the params
    
    res.redirect(authUrl);
});

// This is the route Spotify redirects to after the user logs in.
app.get("/callback", async (req, res) => {
    const code = req.query.code || null;  // Extracts the authorization code sent by Spotify

    if (!code) {
        return res.status(400).send("Login failed: Missing authorization code.");
    }

    // Get the API token
    try {
        const tokenUrl = "https://accounts.spotify.com/api/token";
        const tokenResponse = await axios.post(
            tokenUrl,
            querystring.stringify({
                code,   // code from /login
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

        // Save tokens securely for future use
        accessToken = access_token; // Store the access token here

        // Test the token by fetching user profile data
        const userProfileResponse = await axios.get("https://api.spotify.com/v1/me", {
            headers: { Authorization: `Bearer ${access_token}` },
        });

        const user = userProfileResponse.data;

        req.session.user = {
            displayName: user.displayName,
            email: user.email
        }

    //     req.session.user = user;

    //     res.redirect(`http://localhost:3000/?success=true&user=${encodeURIComponent(user.display_name)}`);
    //     } catch (error) {
    //     console.error("Error during login:", error.response?.data || error.message);
    //     res.redirect("http://localhost:3000/?success=false");
    //     }

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


// New route to get the user's playlists
app.get('/playlists', async (req, res) => {
    if (!accessToken) {
        return res.status(401).send("Unauthorized: No access token found. Login to get a new token.");
    }

    try {
        const playlistResponse = await axios.get('https://api.spotify.com/v1/me/playlists', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        const playlists = playlistResponse.data.items;

        res.status(200).send({
            playlists: playlists.map((playlist) => ({
                name: playlist.name,
                id: playlist.id,
                description: playlist.description || 'No description available',
                url: playlist.external_urls.spotify
            })),
        });

    } catch (error) {
        console.error("Error fetching playlists:", error.response?.data || error.message);
        res.status(500).send("Error fetching playlists.");
    }
});

app.get('/top-songs', async (req, res) => {
    if (!accessToken) {
        return res.status(401).send("Unauthorized: No access token found. Login to get the new token.");
    }

    try {
        const topTracksResponse = await axios.get('https://api.spotify.com/v1/me/top/tracks', {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: {
                time_range: 'long_term', // 'short_term', 'medium_term', 'long_term' (last 4 weeks, 6 months, or all time)
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
            }))
        });

    } catch (error) {
        console.error("Error fetching top tracks:", error.response?.data || error.message);
        res.status(500).send("Error fetching top tracks.");
    }
});


app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
