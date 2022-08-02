import { GameObject } from "../gameObjects/gameObject.js";
import { Delayer } from '../bases/delayer.js';
import { Skill } from "./skill.js";
// import { Game } from "../game.js";

class Entity extends GameObject {
    /**@type {string?} */
    id = null;

    constructor(){
        super();

        this.size = [64, 128];
        this.walkDir = [0, 0];

        /**@type {String} */
        this.color = "#ffff4aff";

        /**@type {Array<number>} */
        this.spriteID = [0, 2];
        this.spriteType = 'fill';

        /**@type {Skill} */
        this.skill = new Skill();

        this.health = this.maxHealth;
        this.energy = this.maxEnergy;

        this.blocking = false;
        this.alive = true;
        this.faceTo = 1;
        this.attack = null;

        this.delayer = new Delayer();
        this.delayer.addDelay("heal", 8);
        this.delayer.addDelay("attack", 0);
        this.delayer.addDelay("blockingEnergyUsage", 6);
    }

    get maxHealth(){
        return this.skill.vitality * 100
    }

    get maxEnergy(){
        return this.skill.vitality * this.skill.strength * 100
    }

    get energyRegen(){
        return this.skill.regeneration * (this.skill.strength ** 1.6) * 4
    }

    get healthRegen(){
        return this.skill.vitality * (this.skill.regeneration ** 1.6) / 4
    }

    get walkSpeed(){
        return this.skill.speed * 18
    }

    takeDamage(damage){
        if(!this.blocking){
            this.health -= 2 * damage / (1 + this.skill.defence * this.skill.strength)
            this.delayer.setTime("heal", Math.trunc(5 * Game.TICK_RATE / this.skill.regeneration) )
        } else {
            this.health -= damage / (1 + (this.skill.defence ** 2) * this.skill.strength)
        }

        if(this.health <= 0){
            this.alive = false
            this.health = 0
        }
    }

    hasEnergy(usage){
        return this.energy - usage / (1 + this.skill.regeneration * this.skill.strength) > 0
    }

    /**
     * 
     * @param {Number} usage
     * @returns {Boolean} Boolean
     */
    useEnergy(usage){
        var newEnergy = this.energy - usage / (1 + this.skill.regeneration * this.skill.strength)
        var hasEnough = false

        if(newEnergy > 0){
            this.energy = newEnergy
            this.delayer.setTime("heal", Math.trunc(3 * 35 /*Game.TICK_RATE*/ / this.skill.regeneration))
            hasEnough = true
        } else {
            this.energy = this.maxEnergy * .04
            this.takeDamage(this.maxHealth * .02 / this.skill.strength)
            this.delayer.setTime("heal", Math.trunc(9 * 35 /*Game.TICK_RATE*/ / this.skill.regeneration))
        }

        return hasEnough
    }

    heal(){
        if(!this.alive){return}

        var newHealth = this.health + this.healthRegen
        var newEnergy = this.energy + this.energyRegen

        if(newHealth < this.maxHealth){
            this.health += this.healthRegen
        } else if(this.health < this.maxHealth){
            this.health = this.maxHealth
        }

        if(newEnergy < this.maxEnergy){
            this.energy += this.energyRegen
        } else if(this.energy < this.maxEnergy){
            this.energy = this.maxEnergy
        }
    }
}

export { Entity };