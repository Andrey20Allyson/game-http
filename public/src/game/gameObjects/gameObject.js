import { Vector2 } from "../bases/vector2.js";
import { Sprite } from "../gui/sprite.js";
import { GameCanvas } from "../gui/gameCanvas.js";
import { Object2D } from "./object2D.js";

class GameObject extends Object2D{
    constructor(){
        super()

        this.sprite = new Sprite(this)

        this.velocity = new Vector2()
    };

    draw(){
        super.draw();

        var posY = -(this.pos.y - GameCanvas.canvas.height + this.size.y);
        GameCanvas.context.fillStyle = this.color;
        GameCanvas.context.fillRect(this.pos.x, posY, this.size.x, this.size.y);

        this.sprite.draw();
    };

    /**
     * 
     * @param {Vector2} pos 
     * @param {Vector2} size 
     * @returns boolean
     */
    colliding(x, y, w, h){
        return (
            (this.pos.x < x + w) &&
            (this.pos.x + this.size.x > x) &&
            (this.pos.y < x + h) &&
            (this.pos.y + this.size.y > y)
        );
    };
};

export { GameObject };