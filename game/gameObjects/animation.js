import { Delayer } from '../bases/delayer.js'

/**
 * @typedef {import('../entity/entity.js').Entity} Entity 
 */

const AnimationConstructError = new Error("This constructor must have a owner param!")
AnimationConstructError.name = "AnimationConstructError"

class Anim{
    /**@type {Entity} */
    target;

    length = 0;
    step = 0;
    /**@type {Delayer} */
    delayer = null;

    index = 0;

    /**
     * 
     * @param {Entity} target
     * @param {number} delay
     * @param {Boolean} loop
     */
    constructor(target, index, length, delay, loop=true) {
        this.target = target;

        this.delayer = new Delayer();
        this.delayer.addDelay('next-frame', delay);

        this.length = length;
        this.index = index;

        this.animDir = 1;
    }

    get frameIndex() {
        return this.step * 2 + this.index + (-this.target.faceTo + 1) / 2;
    }

    nextStep() {
        this.step = this.step + 1 < this.length ? this.step + 1: 0;
        this.updateSpriteIndex();
    }

    reset() {
        this.step = 0;
        this.updateSpriteIndex();
    }

    /**
     * 
     * @param {number} index 
     */
    updateSpriteIndex() {
        this.target.sprite.index = this.frameIndex;
    }

    next() {
        if(this.animDir == this.target.faceTo) this.nextStep();
        else {
            this.reset();
            this.animDir = this.target.faceTo; 
        }
    }
}

export { Anim };