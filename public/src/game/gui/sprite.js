import { GameObject } from "../gameObjects/gameObject.js"
import { GameCanvas } from "./gameCanvas.js"

const SpriteError = new Error("This constructor must have a owner param!")
SpriteError.name = "SpriteError"

class Sprite{
    /**
     * 
     * @param {String} src 
     * @param {GameObject} owner 
     */
    constructor(owner, path, name){
        if(!owner){
            throw SpriteError
        }
        this._image = new Image()
        this.owner = owner

        /**@private */
        this._path = path
        /**@private */
        this._name = name ? name: "stopRight0"

        this.updateSrc()
    }

    /**
     * @param {String} value
     */
    set name(value){
        this._name = value
        this.updateSrc()
    }

    /**
     * @param {String} value
     */
    set path(value){
        this._path = value
        this.updateSrc()
    }

    updateSrc(){
        if(this._path && this._name){
            try{
                this._image.src = `images/${this._path}/${this._name}.png`
                
            } catch(error){
                this._image.src = "images/notFound.png"

            }
        } else {
            this._image.src = "images/null.png"
        }
    }

    draw(){
        var posY = -(this.owner.pos.y - GameCanvas.canvas.height + this.owner.size.y)
        GameCanvas.context.drawImage(this._image, this.owner.pos.x - this.owner.size.x / 2, posY, this.owner.size.y, this.owner.size.y)
    }
}

export { Sprite }