import { GameScreen, Vector2 } from "./screen.js"

class StatusBar {
    fillPerc: number;
    title: string;
    pos: Vector2;
    width: number;
    underColor: string;
    upperColor: string;
    screen: GameScreen;

    constructor(screen: GameScreen, fillPerc?: number, title?: string, pos?: Vector2, width?: number, underColor?: string, upperColor?: string) {
        this.screen = screen;
        
        this.fillPerc = fillPerc ?? 1;

        this.title = title ?? "N/A";

        this.pos = pos ?? [0, 0];
        this.width = width ?? 500;

        this.underColor = underColor ?? "#000000ff"
        this.upperColor = upperColor ?? "#f0f0f0ff"
    }

    draw() {
        const inverseY = -(this.pos[1] - this.screen.canvas.height + 20)

        this.screen.context.fillStyle = this.underColor;

        this.screen.context.beginPath()

        this.screen.context.moveTo(this.pos[0] + 40, inverseY)
        this.screen.context.lineTo(this.pos[0] + this.width + 40, inverseY)
        this.screen.context.lineTo(this.pos[0] + this.width, inverseY + 20)
        this.screen.context.lineTo(this.pos[0], inverseY + 20)

        this.screen.context.fill()


        this.screen.context.fillStyle = this.upperColor

        this.screen.context.beginPath()

        this.screen.context.moveTo(this.pos[0] + 40, inverseY)
        this.screen.context.lineTo(this.pos[0] + this.width * this.fillPerc + 40, inverseY)
        this.screen.context.lineTo(this.pos[0] + this.width * this.fillPerc, inverseY + 20)
        this.screen.context.lineTo(this.pos[0], inverseY + 20)

        this.screen.context.fill()


        this.screen.context.strokeStyle = "#3f3f3faf"
        this.screen.context.lineWidth = 4

        this.screen.context.beginPath()

        this.screen.context.moveTo(this.pos[0] + 40, inverseY)
        this.screen.context.lineTo(this.pos[0] + this.width + 40, inverseY)
        this.screen.context.lineTo(this.pos[0] + this.width, inverseY + 20)
        this.screen.context.lineTo(this.pos[0], inverseY + 20)
        this.screen.context.lineTo(this.pos[0] + 40, inverseY)
        this.screen.context.closePath();

        var marks = 3

        for (var i = 1; i - 1 < marks; i++) {
            this.screen.context.moveTo(this.pos[0] + i * this.width / (marks + 1), inverseY + 20)
            this.screen.context.lineTo(20 + this.pos[0] + i * this.width / (marks + 1), inverseY + 10)
        }

        this.screen.context.stroke()

        this.screen.context.fillStyle = "#2f2f2fff"

        this.screen.context.font = "20px bold"
        this.screen.context.fillText(this.title, this.pos[0] + 48, inverseY + 16)
    }
}

export { StatusBar }