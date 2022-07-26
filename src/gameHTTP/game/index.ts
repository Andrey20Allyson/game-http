import { GameObject, Vector2 } from "./gameObjects";
import { Player, NPC } from "./entity";
import { TerrainLoader } from "./loader/terrain";
import EventEmitter from "events";

export type RenderData = [...Vector2, ...Vector2, number, string];
export type EntityRenderData = [...RenderData, number, number, number, number];
export type GameRenderData = [RenderData[], EntityRenderData[], RenderData[]]

export interface GameOptions {
    tickRate?: number,
}

abstract class GameEventEmitter extends EventEmitter {
    on(eventName: string | symbol, listener: (...args: any[]) => void): this;
    on(eventName: 'tick', listener: () => void): this;
    on(eventName: 'player-added', listener: (player: Player) => void): this;
    on(eventName: 'player-removed', listener: (player: Player) => void): this;
    on(eventName: string, listener: (...args: any[]) => void): this {
        return super.on(eventName, listener)
    }

    once(eventName: string | symbol, listener: (...args: any[]) => void): this;
    once(eventName: 'tick', listener: () => void): this;
    once(eventName: 'player-added', listener: (player: Player) => void): this;
    once(eventName: 'player-removed', listener: (player: Player) => void): this;
    once(eventName: string | symbol, listener: (...args: any[]) => void): this {
        return super.once(eventName, listener);
    }

    emit(eventName: 'tick'): boolean;
    emit(eventName: 'player-added', player: Player): boolean;
    emit(eventName: 'player-removed', player: Player): boolean;
    emit(eventName: string | symbol, ...args: any[]): boolean {
        return super.emit(eventName, ...args);
    }
}

export class Game extends GameEventEmitter {
    private tickRate: number;
    private running: boolean;
    private simulateInterval?: NodeJS.Timer;

    gravity: number;
    players: Player[];
    npcs: NPC[];
    follors: GameObject[];
    backGround: GameObject[];
    frontGround: GameObject[];
    terrainLoader: TerrainLoader;

    constructor(options: GameOptions = {}) {
        super();
        this.gravity = 4.8;
        this.tickRate = options.tickRate ?? 35;

        this.players = [];
        this.npcs = [];

        this.follors = [];
        this.backGround = [];
        this.frontGround = [];

        this.terrainLoader = new TerrainLoader(this);

        this.running = false;
    };

    get renderData(): GameRenderData {
        return [
            [
                ...this.backGround.map(object => object.getRenderData()),
                ...this.follors.map(object => object.getRenderData())
            ],

            [
                ...this.players.map(entity => entity.getEntityRenderData()),
                ...this.npcs.map(entity => entity.getEntityRenderData())
            ],

            [
                ...this.frontGround.map(object => object.getRenderData())
            ]
        ];
    }

    get entities(): (Player | NPC)[] {
        return [
            ...this.players,
            ...this.npcs
        ];
    }

    get msPerTick(): number {
        return this.tickRate;
    }

    get tickPerSec(): number {
        return 1000 / this.tickRate;
    }

    get isRunning() {
        return this.running;
    }

    createPlayer(): Player {
        const player = new Player({ game: this });

        this.players.push(player);
        this.emit('player-added', player);

        return player;
    }

    createNPC(): NPC {
        const npc = new NPC({ game: this });

        this.npcs.push(npc);

        return npc;
    }

    createFollor(): GameObject {
        const follor = new GameObject({ game: this });

        this.follors.push(follor);
        return follor;
    }

    createFrontGround(): GameObject {
        const frontGround = new GameObject({ game: this });

        this.frontGround.push(frontGround);

        return frontGround;
    }

    removePlayer(playerID: string): Player | undefined {
        let playerIndex = this.players.findIndex(({ id }) => id === playerID);

        if (playerIndex != -1) {
            let player = this.players[playerIndex];

            this.players.splice(playerIndex);
            this.emit('player-removed', player);

            return player;
        }
    }

    async loadTerrain(terrainName?: string) {

    }

    getColision(gameObject: GameObject) {
        let hCollision: GameObject | null = null;
        let vCollision: GameObject | null = null;

        for (let follor of this.follors) {
            if (!hCollision)
                hCollision = follor.colliding(gameObject.pos[0] + gameObject.velocity[0], gameObject.pos[1], ...gameObject.size) ? follor : null;

            if (!vCollision)
                vCollision = follor.colliding(gameObject.pos[0], gameObject.pos[1] + gameObject.velocity[1], ...gameObject.size) ? follor : null;

            if (hCollision && vCollision) return { hCollision, vCollision };
        }

        return { hCollision, vCollision };
    }

    run() {
        if (this.simulateInterval)
            this.stop();

        this.simulateInterval = setInterval(
            this.tick.bind(this),
            this.tickPerSec
        );
    }

    stop() {
        clearInterval(this.simulateInterval);
        this.simulateInterval = undefined;
    }

    tick() {
        this.simulate();
        this.emit('tick');
    }

    /**
     * 
     * This method simulate the physics of the game
     */
    simulate() {
        for (let entity of this.entities) {
            const { hCollision, vCollision } = this.getColision(entity);

            if (!hCollision) {
                if (entity.delayer.isTimeOut("attack") || !vCollision)
                    entity.pos[0] += entity.velocity[0];

            } else if (entity.pos[0] > hCollision.pos[0]) {
                entity.pos[0] = hCollision.pos[0] + hCollision.size[0];
                entity.velocity[0] = 0;

            } else {
                entity.pos[0] = hCollision.pos[0] - entity.size[0];
                entity.velocity[0] = 0;
            }

            if (!vCollision) {
                entity.pos[1] += entity.velocity[1];
                entity.velocity[1] -= this.gravity;

            } else if (entity.pos[1] > vCollision.pos[1]) {
                entity.pos[1] = vCollision.pos[1] + vCollision.size[1];
                entity.velocity[0] = entity.walkDir[0] * entity.walkSpeed;

                let isJumping = 0;

                if (entity.hasEnergy(5) && entity.walkDir[1] == 1) {
                    entity.useEnergy(5, this.tickRate);
                    isJumping = 1;
                }

                entity.velocity[1] = 25 * isJumping;
                entity.walkDir[1] = 0;

            } else {
                entity.pos[1] = vCollision.pos[1] - entity.size[1];
                entity.velocity[1] = 0;

            }
        }
    }
}

export function createGame() {
    const game = new Game({ tickRate: 35 });

    let fol1 = game.createFollor();
    let fol2 = game.createFollor();

    fol1.size = [500, 200];
    fol2.size = [200, 260];

    fol2.pos[0] = 500;

    return game;
}

export default createGame;