import { Attack } from "./entity/attack.js";
import { Entity } from "./entity/entity.js";
import { NPC } from "./entity/npc.js";
import { GameObject } from "./gameObjects/gameObject.js";
import { sleep } from "./bases/sleep.js";
import { Player } from "./entity/player.js";


class Game{
    static TICK_RATE = 35;

    constructor() {
        this.running = false;
        this.gravity = 4.8;

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

        var fol1 = new GameObject();
        fol1.pos = [0, 0]
        fol1.size[0] = 900;

        var fol2 = new GameObject();
        fol2.pos = [500, 60];
        fol2.size = [200, 90];

        this.addFollor(fol1);
        this.addFollor(fol2);
    };

    /**
     * 
     * @param {Game} newState 
     * @param {Array<any>?} dontChange 
     */
    setState(newState, dontChange) {
        if(!(newState instanceof Game)){
            console.log(newState);
            return console.log('dont is instance of game');
        }
            
        for(let [key, value] of Object.entries(newState)) if((typeof value != 'function') && (dontChange.includes(value))) {
            this[key] = value;
        }

        return 0;
    }

    /** @returns {RenderData[]} */
    get renderData(){
        return [
            ...this.backGround.map((value) => value.renderData),
            ...this.follors.map((value) => value.renderData),
            ...this.npcs.map((value) => value.renderData), 
            ...this.players.map((value) => value.renderData), 
            ...this.frontGrount.map((value) => value.renderData)
        ];
    }

    /**
     * @returns {Entity[]}
     */
    get entities(){
        return [...this.players, ...this.npcs]
    }

    /**
     * 
     * @param {Player} player 
     */
    addPlayer(player) {
        this.players.push(player)
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
        this.npcs[this.npcs.length] = npc
    }

    /**
     * 
     * @param {GameObject} follor 
     */
    addFollor(follor) {
        this.follors[this.follors.length] = follor
    }

    /**
     * 
     * @param {GameObject} frontGrount 
     */
    addFrontGrount(frontGrount) {
        this.frontGrount[this.frontGrount.length] = frontGrount
    }

    /**
     * 
     * @param {GameObject} gameObject 
     */
    getColision(gameObject){
        /**@type {GameObject?} */
        var hCollision = null;
        /**@type {GameObject?} */
        var vCollision = null;

        for(var f of this.follors){
            /**@type {GameObject} */
            var follor = f
            if(!hCollision){
                hCollision = follor.colliding(gameObject.pos[0] + gameObject.velocity[0], gameObject.pos[1], ...gameObject.size)? follor: 0
            }

            if(!vCollision){
                vCollision = follor.colliding(gameObject.pos[0], gameObject.pos[1] + gameObject.velocity[1], ...gameObject.size)? follor: 0
            }

            if(hCollision && vCollision){
                break
            }
        }

        return { hCollision, vCollision };
    }

    run(){
        this.running = true;
        this.simulate();
    }

    stop(){
        this.running = false;
    }

    /**
     * This method simulate the physics of the game
     */
    async simulate(){
        while(this.running){
            for(var entity of this.entities){
                var {hCollision, vCollision} = this.getColision(entity);

                if(!hCollision){
                    if(entity.delayer.isTimeOut("attack") || !vCollision){
                        entity.pos[0] += entity.velocity[0];
                    }

                } else if(entity.pos[0] > hCollision.pos[0]) {
                    entity.pos[0] = hCollision.pos[0] + hCollision.size[0];
                    entity.velocity[0] = 0;
                    
                } else {
                    entity.pos[0] = hCollision.pos[0] - entity.size[0];
                    entity.velocity[0] = 0;
                }

                if(!vCollision){
                    entity.pos[1] += entity.velocity[1];
                    entity.velocity[1] -= this.gravity;

                } else if(entity.pos[1] > vCollision.pos[1]){
                    entity.pos[1] = vCollision.pos[1] + vCollision.size[1];
                    entity.velocity[0] = entity.walkDir[0] * entity.walkSpeed;

                    var isJumping = 0;

                    if(entity.hasEnergy(5) && entity.walkDir[1] == 1){
                        entity.useEnergy(5);
                        isJumping = 1;
                    }

                    entity.velocity[1] = 25 * isJumping;
                    entity.walkDir[1] = 0;

                } else {
                    entity.pos[1] = vCollision.pos[1] - entity.size[1];
                    entity.velocity[1] = 0;

                }

                var attack = Attack.ATTACKS[entity.attack]
                if(entity.delayer.isTimeOut("attack") && attack){
                    attack.useAttack(entity, this.entities);
                }

                if(entity.blocking && entity.delayer.isTimeOutReset("blockingEnergyUsage")){
                    entity.useEnergy(1);
                }
                    
                if(entity.delayer.isTimeOutReset("heal")){
                    entity.heal();
                }
            }

            await sleep(1000/Game.TICK_RATE);
        }
    }
}

export { Game };