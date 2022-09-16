import { Socket } from 'socket.io';

declare function io(): Socket;

const REQUEST_TIMEOUT = 5000

export function connectWithServer(): Promise<Socket> {
    return new Promise((resolve) => {
        var socket = io();

        socket.on('connect', () => {
            console.log('>> Connected with id: %s', socket.id);
            resolve(socket)
        });
    });
};