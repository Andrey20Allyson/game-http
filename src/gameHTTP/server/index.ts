import express from 'express';
import http from 'http';
import io from 'socket.io';

export function warnServerStart(hostname: string, port: number) {
    console.log('>> [Server] Listening http://%s:%s', hostname, port);
}

export function createIOServer(port: number = 80, hostname: string = 'localhost'): io.Server {
    const app = express();
    const httpServer = http.createServer(app);
    const Server = new io.Server(httpServer);

    app.use(express.static('./public'));

    httpServer.listen(port, hostname, () => warnServerStart(hostname, port));

    return Server; 
};

export default createIOServer;