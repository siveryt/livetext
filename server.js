const http = require('http');
const fs = require('fs');
const path = require('path');

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

