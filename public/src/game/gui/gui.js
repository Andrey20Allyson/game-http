import { StatusBar } from "./statusBar.js";
import { GameCanvas } from "./gameCanvas.js";

class GUI{
    /**
     * 
     * @param {Player} player 
     */
    constructor(player){
        this.referencePlayer = player;

        this.playerHealth = new StatusBar(.63, "Health", [70, GameCanvas.canvas.height - 40], 800, "#af0a0aff", "#0afa6aff");
        this.playerExp = new StatusBar(.8, "Exp", [20, GameCanvas.canvas.height - 20 - 50], 350, "#353500ff", "#ffff0aff");
        this.playerEnergy = new StatusBar(.8, "Energy", [390, GameCanvas.canvas.height - 20 - 50], 430, "#004867ff", "#00b3ffff");
    }

    draw(){
        this.playerHealth.fillPerc = this.referencePlayer.health / this.referencePlayer.maxHealth;
        this.playerHealth.draw();

        this.playerExp.draw();

        this.playerEnergy.fillPerc = this.referencePlayer.energy / this.referencePlayer.maxEnergy;
        this.playerEnergy.draw();
    };
};

export { GUI };