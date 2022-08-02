import { GameCanvas } from "./gameCanvas.js"

class StatusBar{
    /**
     * 
     * @param {Number} fillPerc 
     * @param {String} title 
     * @param {Vector2} pos
     * @param {Number} width 
     * @param {String} underColor 
     * @param {String} upperColor 
     */
    constructor(fillPerc, title, pos, width, underColor, upperColor){
        this.fillPerc = fillPerc ? fillPerc: 1
        this.title = title ? title: "N/A"
        /**@type {Vector2} */
        this.pos = pos || [0, 0];
        this.width = width ? width: 500
        this.underColor = underColor ? underColor: "#000000ff"
        this.upperColor = upperColor ? upperColor: "#f0f0f0ff"
    }

    draw(){
        const inverseY = -(this.pos.y - GameCanvas.canvas.height + 20)

        GameCanvas.context.fillStyle = this.underColor

        GameCanvas.context.beginPath()

        GameCanvas.context.moveTo(this.pos.x + 40, inverseY)
        GameCanvas.context.lineTo(this.pos.x + this.width + 40, inverseY)
        GameCanvas.context.lineTo(this.pos.x + this.width, inverseY + 20)
        GameCanvas.context.lineTo(this.pos.x, inverseY + 20)

        GameCanvas.context.fill()


        GameCanvas.context.fillStyle = this.upperColor

        GameCanvas.context.beginPath()

        GameCanvas.context.moveTo(this.pos.x + 40, inverseY)
        GameCanvas.context.lineTo(this.pos.x + this.width * this.fillPerc + 40, inverseY)
        GameCanvas.context.lineTo(this.pos.x + this.width * this.fillPerc, inverseY + 20)
        GameCanvas.context.lineTo(this.pos.x, inverseY + 20)

        GameCanvas.context.fill()


        GameCanvas.context.strokeStyle = "#3f3f3faf"
        GameCanvas.context.lineWidth = 4

        GameCanvas.context.beginPath()

        GameCanvas.context.moveTo(this.pos.x + 40, inverseY)
        GameCanvas.context.lineTo(this.pos.x + this.width + 40, inverseY)
        GameCanvas.context.lineTo(this.pos.x + this.width, inverseY + 20)
        GameCanvas.context.lineTo(this.pos.x, inverseY + 20)
        GameCanvas.context.lineTo(this.pos.x + 40, inverseY)
        GameCanvas.context.closePath();

        var marks = 3

        for(var i = 1; i - 1 < marks; i++){
            GameCanvas.context.moveTo(this.pos.x + i * this.width / (marks + 1), inverseY + 20)
            GameCanvas.context.lineTo(20 + this.pos.x + i * this.width / (marks + 1), inverseY + 10)
        }

        GameCanvas.context.stroke()


        GameCanvas.context.fillStyle = "#2f2f2fff"

        GameCanvas.context.font = "20px bold"
        GameCanvas.context.fillText(this.title, this.pos.x + 48, inverseY + 16)
    }
}

export { StatusBar }