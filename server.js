const http = require('http');
const fs = require('fs');
const url = require('url');

const PORT = 3000;
// helper to read file
function readData(path) {
    return JSON.parse(fs.readFileSync(path));
}

// helper to write file
function writeData(path, data) {
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const id = parsedUrl.query.id;

    // GET USERS
    if (pathname === '/users' && req.method === 'GET') {
        const users = readData('./data/users.json');
        res.end(JSON.stringify(users));
    }

    // CREATE USER
    else if (pathname === '/users' && req.method === 'POST') {
        let body = '';

        req.on('data', chunk => body += chunk);

        req.on('end', () => {
            const newUser = JSON.parse(body);
            const users = readData('./data/users.json');

            users.push(newUser);
            writeData('./data/users.json', users);

            res.end(JSON.stringify({ message: "User created" }));
        });
    }

    // DELETE USER
    else if (pathname === '/users' && req.method === 'DELETE') {
        let users = readData('./data/users.json');

        users = users.filter(user => user.id != id);
        writeData('./data/users.json', users);

        res.end(JSON.stringify({ message: "User deleted" }));
    }

    else {
        res.statusCode = 404;
        res.end("Not Found");
    }
});

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
