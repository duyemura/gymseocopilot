// server.js
const express = require('express');
const cors = require('cors');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID';
const client = new OAuth2Client(CLIENT_ID);
const JWT_SECRET = 'YOUR_JWT_SECRET';

// Middleware to verify JWT
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

// Google Auth endpoint
app.post('/auth/google', async (req, res) => {
  const { token } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const userId = payload['sub'];
    
    // Generate JWT
    const jwtToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });
    
    res.json({ token: jwtToken });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Protected route example
app.get('/api/user', authenticateJWT, (req, res) => {
  res.json({ user: req.user });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});