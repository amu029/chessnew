const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    console.log(`Requested URL: ${req.url}`);

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
// Serve portfolio website at root
if (req.url === '/' || req.url === '/index.html') {
    fs.readFile(path.join('public', 'index.html'), 'utf8', (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error' + err.message);
            return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
    });
}
// Serve API data
else if (req.url === '/api' && req.method === 'GET') {
    fs.readFile(path.join('public', 'index.json'), 'utf8', (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error reading data' }));
            return;
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(data);
    });
}
// Handle static file serving
else {
    const filePath = path.join('public', req.url);
    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404);
            res.end('Not Found');
            return;
        }

        // Set content type based on file extension
        const ext = path.extname(filePath);
        let contentType = 'text/html';

        switch (ext) {
            case '.css':
                contentType = 'text/css';
                break;
            case '.js':
                contentType = 'text/javascript';
                break;
            case '.json':
                contentType = 'application/json';
                break;
            case '.png':
                contentType = 'image/png';
                break;
            case '.jpg':
                contentType = 'image/jpg';
                break;
        }

        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
    });
}
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});