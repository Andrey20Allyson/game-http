import { StatusBar } from "./statusBar.js";
import { GameScreen, Vector2, PlayerGUIData } from "./screen.js";

export type StatusTuple = [number, number];

export interface GUIStatus {
    health: StatusTuple;
    energy: StatusTuple;
    exp: StatusTuple;
    level: number;
}

export class GUI{
    status: GUIStatus;
    healthBar: StatusBar;
    expBar: StatusBar;
    energyBar: StatusBar;
    screen: GameScreen;

    constructor(screen: GameScreen) {
        this.status = {
            health: [0, 0],
            energy: [0, 0],
            exp: [0, 0],
            level: 1
        }

        this.screen = screen;

        this.healthBar = new StatusBar(this.screen, .63, "Health", [70, this.screen.canvas.height - 40], 800, "#af0a0aff", "#0afa6aff");
        this.expBar = new StatusBar(this.screen, .8, "Exp", [20, this.screen.canvas.height - 20 - 50], 350, "#353500ff", "#ffff0aff");
        this.energyBar = new StatusBar(this.screen, .8, "Energy", [390, this.screen.canvas.height - 20 - 50], 430, "#004867ff", "#00b3ffff");
    }

    setData([health, maxHealth, energy, maxEnergy, exp, maxExp, level]: PlayerGUIData) {
        this.status.health = [health, maxHealth];
        this.status.energy = [energy, maxEnergy];
        this.status.exp = [exp, maxExp];
        this.status.level = level;
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