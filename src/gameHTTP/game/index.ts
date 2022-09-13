import { Attack } from "./entity/ability";
import { GameObject, Vector2 } from "./gameObjects";
import { Player, NPC } from "./entity";

export type RenderData = [...Vector2, ...Vector2, number, string];
export type EntityRenderData = [...RenderData, number, number, number, number];
export type GameRenderData = [RenderData[], EntityRenderData[], RenderData[]]

export class Game{
    private tickRate: number;

    simulateInterval?: NodeJS.Timer;
    gravity: number;
    players: Player[];
    npcs: NPC[];
    follors: GameObject[];
    backGround: GameObject[];
    frontGround: GameObject[];

    constructor() {
        this.gravity = 4.8;
        this.tickRate = 35;

        this.players = [];
        this.npcs = [];

        this.follors = [];
        this.backGround = [];
        this.frontGround = [];
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

    get tickPerSec(): number {
        return 1000 / this.tickRate
    }

    addPlayer(player: Player = new Player()): Player {
        this.players.push(player);
        return player;
    }

    addNPC(npc: NPC = new NPC()): NPC {
        this.npcs.push(npc);
        return npc;
    }

    addFollor(follor: GameObject = new GameObject()): GameObject {
        this.follors.push(follor);
        return follor;
    }

    addFrontGrount(frontGrount: GameObject = new GameObject()): GameObject {
        this.frontGround.push(frontGrount);
        return frontGrount;
    }
    
    removePlayer(playerID: string) {
        this.players = this.players.filter(({ id }) => id !== playerID);
    }

    getColision(gameObject: GameObject) {
        let hCollision: GameObject | null = null;
        let vCollision: GameObject | null = null;

        for (let follor of this.follors) {
            if (!hCollision)
                hCollision = follor.colliding(gameObject.pos[0] + gameObject.velocity[0], gameObject.pos[1], ...gameObject.size)? follor: null;

            if (!vCollision)
                vCollision = follor.colliding(gameObject.pos[0], gameObject.pos[1] + gameObject.velocity[1], ...gameObject.size)? follor: null;

            if (hCollision && vCollision) return { hCollision, vCollision };
        }

        return { hCollision, vCollision };
    }

    run() {
        if (this.simulateInterval)
            this.stop();

        this.simulateInterval = setInterval(
            () => this.simulate(),
            this.tickPerSec
        );
    }

    stop() {
        clearInterval(this.simulateInterval);
        this.simulateInterval = undefined;
    }

    /**
     * 
     * This method simulate the physics of the game
     */
    simulate() {
        for (let entity of this.entities) {
            const { hCollision, vCollision } = this.getColision(entity);

            if (!hCollision){
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

            let attack = Attack.ATTACKS[entity.attack ?? ''];
            if (entity.delayer.isTimeOut("attack") && attack) 
                attack.useAttack(entity, this.entities, this.tickRate);

            if (entity.blocking && entity.delayer.isTimeOutReset("blockingEnergyUsage")) 
                entity.useEnergy(1, this.tickRate);
                
            if (entity.delayer.isTimeOutReset("heal")) 
                entity.heal();

            let { walk } = entity.animations;

            if (entity.walkDir[0]) {
                if (walk.animDir !== entity.faceTo)
                    walk.delayer.setTime('next-frame', 0);

                if (walk.delayer.isTimeOutReset('next-frame'))
                    walk.next();
            } else {
                walk.delayer.setTime('next-frame', 0);
                walk.reset()
            }
        }
    }
}

export function createGame() {
    const game = new Game();

    let fol1 = game.addFollor();
    let fol2 = game.addFollor();

    fol1.size = [500, 200];
    fol2.size = [200, 260];

    fol2.pos[0] = 500;

    return game;
}

export default createGame;