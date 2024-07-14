const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

// Create a server
const server = http.createServer((req, res) => {

    if (req.url == '/') {
        res.writeHead(302, { 'Location': `/${Math.random().toString(36).substring(2)}` });
        res.end();
        return;
    }

    // Check if the requested path exists
    const filePath = path.join(__dirname, req.url);

    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            // Serve index.html if the requested path does not exist
            serve(res, path.join(__dirname, 'index.html'));
        } else {
            // Serve the requested file if it exists
            serve(res, filePath);
        }
    });
});

function serve(res, path) {
    fs.readFile(path, (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        }
    });
}

// Start the server
server.listen(3000, () => {
    console.log('Server is running on port 3000');
});

// Create Websocket Server
const wss = new WebSocket.Server({ server });

const rooms = {};

wss.on('connection', function connection(ws, req) {
    console.log('A new client connected');

    const roomcode = req.url.replace('/', '');
    
    console.log('roomcode:', ws.roomcode = roomcode);
    rooms[ws.roomcode] = rooms[ws.roomcode] || [];
    rooms[ws.roomcode].push(ws);

    ws.on('message', function incoming(message) {
        console.log('received: %s', message);

        rooms[ws.roomcode].forEach(client => {
            if (client !== ws) {
                client.send(message.toString());
            }
        });
    });

    ws.on('close', function close() {
        console.log('Client disconnected');

        rooms[ws.roomcode] = rooms[ws.roomcode].filter(client => client !== ws);
    });

    // Step 6: Send a welcome message to the client
    ws.send('Welcome to the WebSocket server!');
});