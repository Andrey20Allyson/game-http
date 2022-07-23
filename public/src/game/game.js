import { Vector2 } from "./bases/vector2.js";
import { Attack } from "./entity/attack.js";
import { Entity } from "./entity/entity.js";
import { NPC } from "./entity/npc.js";
import { Player } from "./entity/player.js";
import { GameObject } from "./gameObjects/gameObject.js";
import { GameCanvas } from "./gui/gameCanvas.js";
import { GUI } from "./gui/gui.js";
import { KeyboardListener } from "./input/KeyboardListener.js";
import { sleep } from "./bases/sleep.js";


class Game{
    static TICK_RATE = 35
    static REFRESH_RATE = 35

    constructor(){
        this.running = false;
        this.gravity = 4.8;

        this.player = new Player();
        this.listener = new KeyboardListener(this.player);

        this.npcs = [];
        this.follors = [];

        this.backGround = [];
        this.frontGrount = [];

        this.gui = new GUI(this.player)

        this.player.pos = new Vector2(80, 190)

        var fol1 = new GameObject()
        fol1.size.x = 900

        var fol2 = new GameObject()
        fol2.pos.set(500, 60)
        fol2.size.set(200, 90)

        for(var i = 0; i < 2; i++){
            var newNPC = new NPC()
            newNPC.pos = new Vector2(Math.random() * 880, 80 + Math.random() * 100)

            this.addNPC(newNPC)
        }

        this.addFollor(fol1)
        this.addFollor(fol2)
    }

    get renderObjects(){
        return [...this.backGround, ...this.follors, ...this.npcs, this.player, this.gui, ...this.frontGrount]
    }

    /**
     * @returns {Entity[]} Entity[]
     */
    get entities(){
        return [this.player, ...this.npcs]
    }

    /**
     * 
     * @param {Entity} npc 
     */
    addNPC(npc){
        this.npcs[this.npcs.length] = npc
    }

    /**
     * 
     * @param {GameObject} follor 
     */
    addFollor(follor){
        this.follors[this.follors.length] = follor
    }

    /**
     * 
     * @param {GameObject} frontGrount 
     */
    addFrontGrount(frontGrount){
        this.frontGrount[this.frontGrount.length] = frontGrount
    }

    /**
     * 
     * @param {GameObject} gameObject 
     */
    getColision(gameObject){
        /**@type {GameObject|Number} */
        var hCollision = 0
        /**@type {GameObject|Number} */
        var vCollision = 0

        for(var f of this.follors){
            /**@type {GameObject} */
            var follor = f
            if(!hCollision){
                hCollision = follor.colliding(gameObject.pos.x + gameObject.velocity.x, gameObject.pos.y, ...gameObject.size.list)? follor: 0
            }

            if(!vCollision){
                vCollision = follor.colliding(gameObject.pos.x, gameObject.pos.y + gameObject.velocity.y, ...gameObject.size.list)? follor: 0
            }

            if(hCollision && vCollision){
                break
            }
        }

        return {h: hCollision, v: vCollision}
    }

    run(){
        this.running = true
        this.draw()
        this.simulate()
    }

    stop(){
        this.running = false
    }

    async draw(){
        while(this.running){
            // GameCanvas.context.clearRect(0, 0, canvas.width, canvas.height)
            GameCanvas.context.fillStyle = '#00a0f0ff';
            GameCanvas.context.fillRect(0, 0, GameCanvas.canvas.width, GameCanvas.canvas.height);

            for(var renderObjects of this.renderObjects){
                renderObjects.draw()
            }

            await sleep(1000/Game.REFRESH_RATE)
        }
    }

    /**
     * This method simulate the physics of the game
     */
    async simulate(){
        while(this.running){
            for(var entity of this.entities){
                var collisions = this.getColision(entity)

                if(!collisions.h){
                    if(entity.delayer.isTimeOut("attack") || !collisions.v){
                        entity.pos.x += entity.velocity.x
                    }

                } else if(entity.pos.x > collisions.h.pos.x) {
                    entity.pos.x = collisions.h.pos.x + collisions.h.size.x
                    entity.velocity.x = 0
                    
                } else {
                    entity.pos.x = collisions.h.pos.x - entity.size.x
                    entity.velocity.x = 0
                    console.log(entity instanceof Player)
                    if(entity instanceof Player){
                        console.log(entity.velocity);
                    }

                }

                if(!collisions.v){
                    entity.pos.y += entity.velocity.y
                    entity.velocity.y -= this.gravity
                    

                } else if(entity.pos.y > collisions.v.pos.y){
                    entity.pos.y = collisions.v.pos.y + collisions.v.size.y
                    entity.velocity.x = entity.walkDir.x * entity.walkSpeed

                    var isJumping = 0

                    if(entity.hasEnergy(5) && entity.walkDir.y == 1){
                        entity.useEnergy(5)
                        isJumping = 1
                    }

                    entity.velocity.y = 25 * isJumping
                    entity.walkDir.y = 0

                } else {
                    entity.pos.y = collisions.v.pos.y - entity.size.y
                    entity.velocity.y = 0

                }

                var attack = Attack.ATTACKS[entity.attack]
                if(entity.delayer.isTimeOut("attack") && attack){
                    attack.useAttack(entity, this.entities)    
                }

                if(entity.blocking && entity.delayer.isTimeOutReset("blockingEnergyUsage")){
                    entity.useEnergy(1)
                }
                    
                if(entity.delayer.isTimeOutReset("heal")){
                    entity.heal()
                }
            }

            await sleep(1000/Game.TICK_RATE)
        }
    }
}

export { Game };