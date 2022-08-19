/**
 * @typedef {import("game").Vector2} Vector2
 */

class Object2D {
    /**@type {Vector2} */
    pos = [0, 0];
    /**@type {Vector2} */
    size = [80, 80];
    color = '#4a4a4aff';

    constructor() {
        this.pos = [0, 0];
        this.size = [80, 80];
    }
}

export { Object2D };