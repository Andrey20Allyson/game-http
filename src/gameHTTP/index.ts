import { createIOServer } from './server';
import { createGame, Game } from './game/';
import io from 'socket.io';

export function createConnection(game: Game, socket: io.Socket) {
    console.log('>> [Connection] Socket connected with id: %s', socket.id);

    const player = game.addPlayer();
    const playerUpdate = setInterval(() => socket.emit('player-update', player.getPlayerGUIData()), 1000/20);

    player.pos = [20 + 600 * Math.random(), 400];
    player.id = socket.id;

    function clientUpdate(pressedKeys: string[]) {
        player.setWalkDir(pressedKeys);
        player.setAttack(pressedKeys);
    };

    function onDisconnect(reason: string) {
        console.log('>> [Disconnection] Socket with id: %s disconnected because %s', socket.id, reason);

        clearInterval(playerUpdate);
        game.removePlayer(player.id ?? socket.id);
    };

    socket.on('client-update', clientUpdate);
    socket.on('disconnect', onDisconnect);
};

export function startGameServer(port?: number, hostname?: string) {
    const server = createIOServer(port, hostname);
    const game = createGame();
    const gameUpdate = setInterval(
        () => server.emit('game-update', game.renderData),
        1000/40
    );

    // TERRAIN_LOADER.load()
    // .then(data => TERRAIN_LOADER.apply(data))
    // .then(() => {
    //     HTTP_SERVER.listen(PORT, 'localhost', () => {
    //         console.clear();
    //         console.log(">> [SERVER  ] Server now is listening on port %s", PORT);
    //     });
    // });

    game.run();
    server.on('connection', socket => createConnection(game, socket));

    return { game, server };
};