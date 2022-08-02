import { Object2D } from "./object2D.js";

class GameObject extends Object2D {
    constructor() {
        super();

        /**@type {Vector2} */
        this.spriteID = [1, 0];
        this.spriteType = 'repeat';

        /**@type {Vector2} */
        this.velocity = [0, 0];
    };

    /**@type {RenderData} */
    get renderData() {
        return [...this.pos, ...this.size, ...this.spriteID, this.spriteType];
    };

    /**@type {(x: number, y: number, w: number, h: number) => boolean} */
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