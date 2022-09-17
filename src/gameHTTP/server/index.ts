import express from 'express';
import http from 'http';
import io from 'socket.io';

export interface IOServerOptions {
    hostname?: string;
    port?: number;
    appRoot?: string;
}

export function warnServerStart(hostname: string, port: number) {
    console.log('>> [Server] Listening http://%s:%s', hostname, port);
};

export function createIOServer({ port = 80, hostname = 'localhost', appRoot = './' }: IOServerOptions): io.Server {
    const app = express();
    const httpServer = http.createServer(app);
    const server = new io.Server(httpServer);

    app.use(express.static(appRoot));

    httpServer.listen(port, hostname, () => warnServerStart(hostname, port));

    return server; 
};

export default createIOServer;