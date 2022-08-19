import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';

import { Game } from './game/game.js';
import { Player } from './game/entity/player.js';
import { TerrainLoader } from './game/terrain/terrainLoader.js';

const APP = express();

const HTTP_SERVER = createServer(APP);
const PORT = 80;

const IO = new Server(HTTP_SERVER);

const GAME = new Game();

const TERRAIN_LOADER = new TerrainLoader(GAME)

APP.use(express.static('public'));

TERRAIN_LOADER.load()
.then(data => TERRAIN_LOADER.apply(data))
.then(() => {
    HTTP_SERVER.listen(PORT, 'localhost', () => {
        console.clear();
        console.log(">> [SERVER  ] Server now is listening on port %s", PORT);
    });
});

IO.on('connection', socket => {
    console.log('>> [Connection] Socket connected with id: %s', socket.id);

    let player = new Player();
    player.pos = [20 + 600 * Math.random(), 400];
    player.id = socket.id;

    GAME.addPlayer(player);

    let playerUpdate = setInterval(() => socket.emit('player-update', player.getPlayerGUIData()), 1000/20);

    socket.on('client-update',
    /**
     * @param {string[]} pressedKeys
     */
    (pressedKeys) => {
        player.setWalkDir(pressedKeys);

        player.setAttack(pressedKeys);
    });

    socket.on('disconnect', (reason) => {
        console.log('>> [Disconnection] Socket with id: %s disconnected because %s', socket.id, reason);

        clearInterval(playerUpdate);
        GAME.removePlayer(socket.id);
    });
});

GAME.run();

var gameUpdate = setInterval(() => IO.emit('game-update', GAME.getRenderData()), 1000/40);