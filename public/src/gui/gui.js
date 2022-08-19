import { StatusBar } from "./statusBar.js";
import { GameCanvas } from "./gameCanvas.js";

/**
 * @typedef {import("game").PlayerGUIData} PlayerGUIData
 */

class GUI{
    constructor(){
        this.status = {
            health: [0, 0],
            energy: [0, 0],
            exp: [0, 0],
            level: 1
        }

        this.healthBar = new StatusBar(.63, "Health", [70, GameCanvas.canvas.height - 40], 800, "#af0a0aff", "#0afa6aff");
        this.expBar = new StatusBar(.8, "Exp", [20, GameCanvas.canvas.height - 20 - 50], 350, "#353500ff", "#ffff0aff");
        this.energyBar = new StatusBar(.8, "Energy", [390, GameCanvas.canvas.height - 20 - 50], 430, "#004867ff", "#00b3ffff");
    }

    /**
     * 
     * @param {PlayerGUIData} playerGuiData
     */
    setData(playerGuiData) {
        this.status.health = playerGuiData.splice(0, 2);
        this.status.energy = playerGuiData.splice(0, 2);
        this.status.exp = playerGuiData.splice(0, 2);
        this.status.level = playerGuiData[0];
    }
    
    draw(){
        this.healthBar.fillPerc = this.status.health[0] / this.status.health[1];
        this.healthBar.draw();

        this.expBar.fillPerc = this.status.exp[0] / this.status.exp[1];
        this.expBar.draw();

        this.energyBar.fillPerc = this.status.energy[0] / this.status.energy[1];
        this.energyBar.draw();
    }
};

export { GUI };