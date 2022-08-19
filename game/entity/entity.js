import { GameObject } from "../gameObjects/gameObject.js";
import { Delayer } from '../bases/delayer.js';
import { Skill } from "./skill.js";
import { Sprite } from '../gameObjects/sprite.js';
import { Anim } from '../gameObjects/animation.js'

/**
 * @typedef {import("game").EntityRenderData} EntityRenderData
 */

class Entity extends GameObject {
    /**@type {string?} */
    id = null;
    /**@type {Sprite} */
    sprite;
    /**
     * @type {{
     *   walk: Anim?,
     *   jump: Anim?
     *   attacks: [string, Anim][]?
     * }} 
     */
    animations = {
        walk: null,
        jump: null,
        attacks: []
    };

    faceTo = 1;

    constructor(){
        super();

        this.size = [64, 128];
        this.walkDir = [0, 0];

        this.color = "#ffff4aff";

        this.sprite = new Sprite(64, 'fill');

        this.animations.walk = new Anim(this, 64, 1, 80, true);

        /**@type {Skill} */
        this.skill = new Skill();

        this.health = this.maxHealth;
        this.energy = this.maxEnergy;

        this.blocking = false;
        this.alive = true;
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

    /**
     * 
     * @returns {EntityRenderData}
     */
    getRenderData() {
        return super.getRenderData().concat(this.health, this.maxHealth, this.energy, this.maxEnergy);
    }

    /**
     * 
     * @param {number} damage 
     * @param {number} tickRate 
     */
    takeDamage(damage, tickRate) {
        if(!this.blocking){
            this.health -= 2 * damage / (1 + this.skill.defence * this.skill.strength)
            this.delayer.setTime("heal", Math.trunc(5 * tickRate / this.skill.regeneration) )
        } else {
            this.health -= damage / (1 + (this.skill.defence ** 2) * this.skill.strength)
        }

        if(this.health <= 0){
            this.alive = false
            this.health = 0
        }
    }

    hasEnergy(usage) {
        return this.energy - usage / (1 + this.skill.regeneration * this.skill.strength) > 0
    }

    /**
     * 
     * @param {number} usage
     * @param {number} tickRate
     * @returns {boolean} Boolean
     */
    useEnergy(usage, tickRate) {
        var newEnergy = this.energy - usage / (1 + this.skill.regeneration * this.skill.strength)
        var hasEnough = false

        if(newEnergy > 0){
            this.energy = newEnergy
            this.delayer.setTime("heal", Math.trunc(3 * tickRate / this.skill.regeneration))
            hasEnough = true
        } else {
            this.energy = this.maxEnergy * .04
            this.takeDamage(this.maxHealth * .02 / this.skill.strength)
            this.delayer.setTime("heal", Math.trunc(9 * tickRate / this.skill.regeneration))
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