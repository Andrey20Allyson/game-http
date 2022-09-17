import { createGameServer, GameServerOptions } from './gameHTTP';

let GSopts: GameServerOptions = {
    appRoot: './public',
    startOnCreate: true
};

const gameServer = createGameServer(GSopts);