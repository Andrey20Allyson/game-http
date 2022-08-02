import { GameObject } from '../gameObjects/gameObject.js';
import { GUI } from './gui.js';

/**
 * @typedef {import('../gameObjects/gameObject').GameObject} GameObject
 * @typedef {import('../game.js').Game} Game
 * @typedef {import('../entity/player.js').Player} Player
 * @typedef {import('../bases/vector2.js').RenderData} RenderData
 * @typedef {(x: number, y: number, w: number, h: number, spriteX: number, spriteY: number) => void} SpriteMethods
 */

class GameCanvasInitError extends Error {
    constructor() {
        super('GameCanvas.init() dont recived the args');

        this.name = 'GameCanvasInitError';
    }
}

class SpriteTypeError extends Error {
    constructor(message) {
        super(message);

        this.name = 'SpriteTypeError';
    }
}

class GameCanvas{
    /**@type {HTMLCanvasElement?} */
    static canvas = null;
    /**@type {CanvasRenderingContext2D?} */
    static context = null;
    /**@type {RenderData[]} */
    static renderDatas = [];
    /**@type {GUI?} */
    static gui = null;
    /**@type {HTMLImageElement?} */
    static sprites = null;
    static rendering = false;
    static REFRESH_RATE = 40;

    static DRAW_SPRITES = {
        /**@type {SpriteMethods} */
        repeat: (x, y, w, h, spriteX, spriteY) => {
            var inverseY = -(y - this.canvas.height + h);

            var spritePos = [spriteX * 32, spriteY * 32];

            for (var i = 0; i * 32 < h - 32; i++) {
                for(var j = 0; j * 32 < w - 32; j++) {
                    this.context.drawImage(this.sprites, ...spritePos, 32, 32, x + j * 32, inverseY + i * 32, 32, 32);
                };

                var endw = w - j * 32
                this.context.drawImage(this.sprites, ...spritePos, endw, 32, x + j * 32, inverseY + i * 32, endw, 32);
            };

            var endh = h - i * 32

            for (var j = 0; j * 32 < w - 32; j++) {
                this.context.drawImage(this.sprites, ...spritePos, 32, endh, x + j * 32, inverseY + i * 32, 32, endh);

            };

            endw = w - j * 32
            this.context.drawImage(this.sprites, ...spritePos, endw, endh, x + j * 32, inverseY + i * 32, endw, endh);
        },

        /**@type {SpriteMethods} */
        fill: (x, y, w, h, spriteX, spriteY) => {
            y = -(y - this.canvas.height + h);

            var spritePos = [spriteX * 32, spriteY * 32];
            var maxSize = Math.max(w, h);

            this.context.drawImage(this.sprites, ...spritePos, 32, 32, x, y, maxSize, maxSize);
        }
    }

    /**
     * 
     * @param {string} canvasID 
     * @param {Game} game
     * @param {Player} player
     * @param {CanvasRenderingContext2D?} config
     */
    static init(canvasID, config = {imageSmoothingEnabled: false}) {
        if(!canvasID)
            throw new GameCanvasInitError();

        this.canvas = document.getElementById(canvasID);
        // this.gui = new GUI();
        
        /**@type {CanvasRenderingContext2D} */
        this.context = this.canvas.getContext('2d');
        this.sprites = document.createElement('img');
        this.sprites.src = './sprites.png';

        for(let [key, value] of Object.entries(config)) if(typeof value != 'function') {
            this.context[key] = value;
        };
    };

    static start() {
        this.rendering = true;
        this.render();
    }

    /**@type {(_: GameObject) => {inverseY: number, spritePos: Array<number>}} */
    static getRenderValues(renderObject) {
        var inverseY = -(renderObject.pos.y - this.canvas.height + renderObject.size.y);

        var spritePos = renderObject.spriteID.map( 
            (value, index, array) => value * 32 
        );

        return { inverseY, spritePos };
    }

    static async render() {
        while(this.rendering){
            this.context.fillStyle = '#00a0f0ff';
            this.context.fillRect(0, 0, GameCanvas.canvas.width, GameCanvas.canvas.height);

            for (let [x, y, w, h, spriteX, spriteY, spriteType] of this.renderDatas) if(spriteType in this.DRAW_SPRITES) {
                this.DRAW_SPRITES[spriteType](x, y, w, h, spriteX, spriteY);
            } else {
                throw new SpriteTypeError(`sprite render method: [ ${spriteType}(); ] dont exist!`);
            }

            // this.gui.draw();

            await new Promise((res) => setTimeout(res, 1000 / this.REFRESH_RATE));
        };
    }
};

export { GameCanvas };