const express = require('express');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');
const crypto = require('crypto');

const app = express();
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Load user data
const users = JSON.parse(fs.readFileSync(path.join(__dirname, 'db/user.json'))).users;

// Room keys storage
const roomKeys = {};

// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

// Enter room endpoint
app.post('/enter-room', (req, res) => {
  const { roomNumber } = req.body;
  if (!roomKeys[roomNumber]) {
    roomKeys[roomNumber] = crypto.randomBytes(32).toString('hex');
  }
  res.json({ key: roomKeys[roomNumber] });
});

// HTTP server setup
const server = http.createServer(app);

// WebSocket server setup
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    console.log('received: %s', message);
    // Broadcast the message to all connected clients
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.send('WebSocket connected');
});

server.listen(8081, '0.0.0.0', () => {
  console.log('Server running at http://localhost:8081/');
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'main.html'));
});

app.get('/1', function (req, res) {
  res.sendFile(__dirname + '/public/main1.html');
});