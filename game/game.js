import { Attack } from "./entity/attack.js";
import { Entity } from "./entity/entity.js";
import { NPC } from "./entity/npc.js";
import { GameObject } from "./gameObjects/gameObject.js";
import { Player } from "./entity/player.js";

/**
 * @typedef {import('game').RenderData} RenderData
 * @typedef {import('game').GameRenderData} GameRenderData 
 */

class Game{
    constructor() {
        /**@type {NodeJS.Timer?} */
        this.simulateInterval = null;

        /**@type {number} */
        this.gravity = 4.8;

        /**@private @type {number} */
        this.tickRate = 35;

        /**@type {Player[]} */
        this.players = [];

        /**@type {NPC[]} */
        this.npcs = [];

        /**@type {GameObject[]} */
        this.follors = [];

        /**@type {GameObject[]} */
        this.backGround = [];
        
        /**@type {GameObject[]} */
        this.frontGrount = [];
    };

    /**
     * 
     * @param {Game} newState 
     * @param {Array<any>?} dontChange 
     */
    setState(newState, dontChange) {
        if(!(newState instanceof Game)){
            console.log(newState);
            console.log('dont is instance of game');
            return 1;
        }
            
        for(let [key, value] of Object.entries(newState)) if((typeof value != 'function') && (dontChange.includes(value))) {
            this[key] = value;
        }

        return 0;
    }

    /**
     * 
     * @returns {GameRenderData}
     */
    getRenderData() {
        return [
            [
                ...this.backGround.map((value) => value.getRenderData()),
                ...this.follors.map((value) => value.getRenderData())
            ],   

            [
                ...this.npcs.map((value) => value.getRenderData()),
                ...this.players.map((value) => value.getRenderData())
            ],

            [
                ...this.frontGrount.map((value) => value.getRenderData())
            ]
        ];
    }

    get entities(){
        return [
                ...this.players,
                ...this.npcs
            ];
    }

    /**
     * 
     * @param {Player} player 
     */
    addPlayer(player) {
        this.players.push(player);
    }

    /**
     * 
     * @param {string} playerID 
     */
    removePlayer(playerID) {
        this.players = this.players.filter(({id}) => id !== playerID);
    }

    /**
     * 
     * @param {NPC} npc 
     */
    addNPC(npc) {
        this.npcs.push(npc);
    }

    /**
     * 
     * @param {GameObject} follor 
     */
    addFollor(follor) {
        this.follors.push(follor);
    }

    /**
     * 
     * @param {GameObject} frontGrount 
     */
    addFrontGrount(frontGrount) {
        this.frontGrount.push(frontGrount);
    }

    /**
     * 
     * @param {GameObject} gameObject 
     */
    getColision(gameObject) {
        /**@type {[GameObject | null, GameObject | null]} */
        let [hCollision, vCollision] = [null, null];

        for(let follor of this.follors) {
            if(!hCollision)
                hCollision = follor.colliding(gameObject.pos[0] + gameObject.velocity[0], gameObject.pos[1], ...gameObject.size)? follor: null;

            if(!vCollision)
                vCollision = follor.colliding(gameObject.pos[0], gameObject.pos[1] + gameObject.velocity[1], ...gameObject.size)? follor: null;

            if(hCollision && vCollision) return { hCollision, vCollision };
        }

        return { hCollision, vCollision };
    }

    run() {
        if(this.simulateInterval)
            this.stop();

        this.simulateInterval = setInterval(() => this.simulate(), 1000 / this.tickRate);
    }

    stop() {
        clearInterval(this.simulateInterval);
        this.simulateInterval = null;
    }

    /**
     * 
     * This method simulate the physics of the game
     */
    simulate() {
        for(let entity of this.entities) {
            let {hCollision, vCollision} = this.getColision(entity);

            if(!hCollision){
                if(entity.delayer.isTimeOut("attack") || !vCollision) 
                    entity.pos[0] += entity.velocity[0];

            } else if(entity.pos[0] > hCollision.pos[0]) {
                entity.pos[0] = hCollision.pos[0] + hCollision.size[0];
                entity.velocity[0] = 0;
                
            } else {
                entity.pos[0] = hCollision.pos[0] - entity.size[0];
                entity.velocity[0] = 0;
            }

            if(!vCollision) {
                entity.pos[1] += entity.velocity[1];
                entity.velocity[1] -= this.gravity;

            } else if(entity.pos[1] > vCollision.pos[1]) {
                entity.pos[1] = vCollision.pos[1] + vCollision.size[1];
                entity.velocity[0] = entity.walkDir[0] * entity.walkSpeed;

                let isJumping = 0;

                if(entity.hasEnergy(5) && entity.walkDir[1] == 1) {
                    entity.useEnergy(5);
                    isJumping = 1;
                }

                entity.velocity[1] = 25 * isJumping;
                entity.walkDir[1] = 0;

            } else {
                entity.pos[1] = vCollision.pos[1] - entity.size[1];
                entity.velocity[1] = 0;

            }

            var attack = Attack.ATTACKS[entity.attack];
            if(entity.delayer.isTimeOut("attack") && attack) 
                attack.useAttack(entity, this.entities, this.tickRate);

            if(entity.blocking && entity.delayer.isTimeOutReset("blockingEnergyUsage")) 
                entity.useEnergy(1);
                
            if(entity.delayer.isTimeOutReset("heal")) 
                entity.heal();

            let { walk } = entity.animations;

            if(entity.walkDir[0]) {
                if(walk.animDir != entity.faceTo)
                    walk.delayer.setTime('next-frame', 0);

                if(walk.delayer.isTimeOutReset('next-frame'))
                    walk.next();
            } else {
                walk.delayer.setTime('next-frame', 0);
                walk.reset()
            }
        }
    }
}

export { Game };