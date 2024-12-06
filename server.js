const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    console.log(`Requested URL: ${req.url}`);

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Serve API data
    if (req.url === '/api' && req.method === 'GET') {
        fs.readFile(path.join('public', 'api', 'index.json'), 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Error reading data' }));
                return;
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(data);
        });
    }
    // Serve static HTML, CSS, JS files
    else {
        // Default to serving index.html if no specific file is requested
        let filePath = req.url === '/' ? '/html/index.html' : req.url;
        
        // Determine the correct content type based on file extension
        const extname = path.extname(filePath);
        let contentType = 'text/html';

        if (extname === '.js') {
            contentType = 'application/javascript';
        } else if (extname === '.css') {
            contentType = 'text/css';
        } else if (extname === '.json') {
            contentType = 'application/json';
        }

        // Serve the requested file
        fs.readFile(path.join('public', filePath), (err, content) => {
            if (err) {
                res.writeHead(404);
                res.end('Not Found');
                return;
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
