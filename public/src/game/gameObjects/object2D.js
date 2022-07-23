import { Vector2 } from "../bases/vector2.js";

class Object2D{
    constructor(){
        this.pos = new Vector2()
        this.size = new Vector2(80, 80)
        this.color = "#4a4a4aff"
    }

    /**
     * @returns {void}
     */
    draw(){};
}

export { Object2D };