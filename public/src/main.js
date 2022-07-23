import { Game } from "./game/game.js";
import { GameCanvas } from "./game/gui/gameCanvas.js";

GameCanvas.setContext2D('gameScreen');

const game = new Game();

game.run();
