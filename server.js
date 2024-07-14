const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

// Create a server
const server = http.createServer((req, res) => {

    if (req.url == '/') {
        serve(res, path.join(__dirname, 'public', 'index.html'));
        return;
    }

    // Check if the requested path exists
    const filePath = path.join(__dirname, 'public', req.url);

    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            // Serve index.html if the requested path does not exist
            serve(res, path.join(__dirname, 'public', 'editor.html'));
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

    const roomcode = req.url.replace('/', '').toLowerCase();
    
    console.log('roomcode:', ws.roomcode = roomcode);
    rooms[ws.roomcode] = rooms[ws.roomcode] || [];
    rooms[ws.roomcode].push(ws);

    rooms[ws.roomcode].forEach(client => {
        client.send(JSON.stringify({
            clients: rooms[ws.roomcode].length
        }));
    });

    ws.on('message', function incoming(message) {
        console.log('received: %s', message);

        const payload = JSON.parse(message);

        if (payload.text) {
            rooms[ws.roomcode].forEach(client => {
                if (client !== ws) {
                    client.send(JSON.stringify({
                        text: payload.text
                    }));
                }
            });
        }
        
    });

    ws.on('close', function close() {
        console.log('Client disconnected');

        rooms[ws.roomcode] = rooms[ws.roomcode].filter(client => client !== ws);
        rooms[ws.roomcode].forEach(client => {
            client.send(JSON.stringify({
                clients: rooms[ws.roomcode].length
            }));
        });
    });

});