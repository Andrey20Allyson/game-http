import { Object2D } from "./object2D.js";
import { Sprite } from "./sprite.js";

/**
 * @typedef {import("game").Vector2} Vector2
 * @typedef {import('game').RenderData} RenderData
 */

class GameObject extends Object2D {
    /**@type {Sprite} */
    sprite;
    /**@type {Vector2} */
    velocity;

    constructor() {
        super();

        this.sprite = new Sprite(1, 'repeat');
        
        this.velocity = [0, 0];
    };

    /**
     * 
     * @returns {RenderData}
     */
    getRenderData() {
        return [...this.pos, ...this.size, this.sprite.index, this.sprite.type];
    };

    /**
     * 
     * @param {number} x
     * @param {number} y
     * @param {number} w
     * @param {number} h
     * @returns {boolean}
     */
    colliding(x, y, w, h) {
        return (
            (this.pos[0] < x + w) &&
            (this.pos[0] + this.size[0] > x) &&
            (this.pos[1] < x + h) &&
            (this.pos[1] + this.size[1] > y)
        );
    };
};

export { GameObject };