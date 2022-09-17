import { createIOServer, IOServerOptions } from './server';
import { createGame, Game } from './game/';
import io from 'socket.io';
import { Player } from './game/entity';

export interface GameServerOptions extends IOServerOptions {
    startOnCreate?: boolean;
    clientUpdateRate?: number;
    playerGUIUpdateRate?: number;
}

export interface IGameServer {
    start(): Promise<void>;
    pause(): void;
    resume(): void;
    createConnection(game: Game, socket: io.Socket): void;
    updateClients(): void;
    updatePlayersGUI(socket: io.Socket, player: Player): void;
}

export class GameServer implements IGameServer {
    private game: Game;
    private server: io.Server;
    private clientUpdateRate: number;
    private playerGUIUpdateRate: number;
    private clientUpdateInterval?: NodeJS.Timer;
    private playerGUIUpdateInterval?: NodeJS.Timer;

    constructor(options: GameServerOptions) {
        this.clientUpdateRate = options.clientUpdateRate ?? 40;
        this.playerGUIUpdateRate = options.playerGUIUpdateRate ?? 20;

        this.game = createGame();
        this.server = createIOServer(options);
    }

    updateClients() {
        this.server.emit('game-update', this.game.renderData)
    }

    updatePlayersGUI(socket: io.Socket, player: Player) {
        socket.emit('player-update', player.getPlayerGUIData());
    }

    async start() {
        await this.game.loadTerrain('green-plains');
        this.game.run();
        this.server.on('connection', socket => this.createConnection(this.game, socket));
        this.clientUpdateInterval = setInterval(() => this.updateClients(), this.clientUpdateRate);
    }

    pause() {
        this.game.stop();
        clearInterval(this.clientUpdateInterval);
    }

    resume() {
        this.game.run();
        this.clientUpdateInterval = setInterval(() => this.updateClients(), this.clientUpdateRate);
    }

    createConnection(game: Game, socket: io.Socket) {
        console.log('>> [Connection] Socket connected with id: %s', socket.id);

        const player = game.addPlayer();
        const playerUpdate = setInterval(() => this.updatePlayersGUI(socket, player), 1000/20);

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
    }
}

export function createGameServer(options: GameServerOptions): IGameServer {
    const gameServer = new GameServer(options);

    if (options.startOnCreate)
        gameServer.start();

    return gameServer;
};