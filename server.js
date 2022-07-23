import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { networkInterfaces } from 'os';

const app = express();
const HTTPServer = createServer(app);
const Sockets = new Server(HTTPServer);

const hostname = Object.entries(networkInterfaces())[0][1][1]['address'];
const port = 3000;

app.use(express.static('public'));

HTTPServer.listen(port, hostname,
    // listen callback
    () => {
        console.log(">> [SERVER  ] Server now is listening\n>> [LINK    ] %s:%s", hostname, port);
    }
);