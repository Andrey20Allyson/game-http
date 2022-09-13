import express from 'express';
import http from 'http';
import io from 'socket.io';

export function createIOServer(port?: number, hostname?: string): io.Server {
    const app = express();
    const httpServer = http.createServer(app);
    const Server = new io.Server(httpServer);

    app.use(express.static('./public'));

    httpServer.listen(port ?? 80, hostname ?? 'localhost');

    return Server; 
};

export default createIOServer;