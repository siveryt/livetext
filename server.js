const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');
const dotenv = require('dotenv');

dotenv.config();

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
            const contentType = getContentType(path);
            res.writeHead(200, { 'Content-Type': contentType });
            
            function getContentType(filePath) {
                const extension = filePath.split('.').pop();
                switch (extension) {
                    case 'html':
                        return 'text/html';
                    case 'css':
                        return 'text/css';
                    case 'js':
                        return 'text/javascript';
                    case 'json':
                        return 'application/json';
                    case 'png':
                        return 'image/png';
                    case 'jpg':
                    case 'jpeg':
                        return 'image/jpeg';
                    default:
                        return 'application/octet-stream';
                }
            }
            res.end(data);
        }
    });
}

// Start the server
server.listen(process.env.PORT || 3000, () => {
    console.log('Server is running on port', Number(process.env.PORT) || 3000);
});

// Create Websocket Server
const wss = new WebSocket.Server({ server });

const rooms = {};

wss.on('connection', function connection(ws, req) {
    
    const roomcode = req.url.replace('/', '').toLowerCase();
    console.log('A new client connected to room', roomcode);
    
    console.log('roomcode:', ws.roomcode = roomcode);
    rooms[ws.roomcode] = rooms[ws.roomcode] || [];
    rooms[ws.roomcode].push(ws);

    rooms[ws.roomcode].forEach(client => {
        client.send(JSON.stringify({
            clients: rooms[ws.roomcode].length
        }));
    });

    rooms[ws.roomcode][0].send(JSON.stringify({
        sendProgress: true
    }));

    ws.on('message', function incoming(message) {

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