import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';

import { Game } from './public/src/game/game.js';
import { Player } from './public/src/game/entity/player.js';

const APP = express();
const HTTPServer = createServer(APP);
const IO = new Server(HTTPServer);

const port = 80;

APP.use(express.static('public'));

HTTPServer.listen(port, 'localhost', () => {
    console.clear();
    console.log(">> [SERVER  ] Server now is listening on port %s", port);
});

const GAME = new Game();
GAME.run();

IO.on('connection', (socket) => {
    console.log('>> [Connection] Socket connected with id: %s', socket.id);
    var player = new Player();
    player.pos = [40, 400];
    player.id = socket.id;

    GAME.addPlayer(player);

    socket.on('r-ping', /**@type {(_: () => void) => void} */ (callback) => {
        callback();
    });

    socket.on('client-update',
    (keyboardInfo) => {
        player.walkDir = [
            -keyboardInfo['a'] + keyboardInfo['d'],
            -keyboardInfo['s'] + keyboardInfo['w']
        ];
    });

    socket.on('disconnect', (reason) => {
        console.log('>> [Disconnection] Socket with id: %s disconnected because %s', socket.id, reason);

        GAME.removePlayer(socket.id);
        player = undefined;
    });
});

var interval = setInterval(() => {
    IO.emit('game-update', GAME.renderData);
}, 1000/30);

function stopUpdate() {
    clearInterval(interval);
}