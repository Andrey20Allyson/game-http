import { GUI } from './gui.js';
import { StatusBar } from './statusBar.js';

/**
 * @typedef {(x: number, y: number, w: number, h: number, spriteX: number, spriteY: number) => void} SpriteMethods
 * @typedef {import('game').GameRenderData} GameRenderData
 * @typedef {import('game').RenderData} RenderData
 * @typedef {import('game').EntityRenderData} EntityRenderData
 */

class GameCanvasInitError extends Error {
    constructor() {
        super('GameCanvas.init() dont recived the args');

        this.name = 'GameCanvasInitError';
    }
}

class SpriteTypeError extends Error {
    constructor(message: string) {
        super(message);

        this.name = 'SpriteTypeError';
    }
}

export type Vector2 = [number, number];

export type SpriteDrawFunction = (x: number, y: number, w: number, h: number, spriteX: number, spriteY: number) => void;
export type SpriteType = 'repeat' | 'fill'

export type RenderData = [...Vector2, ...Vector2, number, SpriteType];
export type EntityRenderData = [...RenderData, number, number, number, number];
export type GameRenderData = [RenderData[], EntityRenderData[], RenderData[]]

export type PlayerGUIData = [number, number, number, number, number, number, number];

export type SpriteMethods = {
    [k in SpriteType]: SpriteDrawFunction;
};

export class GameScreen {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    gui: GUI;
    sprites: HTMLImageElement;
    renderData: any;
    drawMethods: SpriteMethods;

    SPRITES_IMAGE_WIDTH: number = 32;
    SINGLE_SPRITE_SIZE: number = 32;
    rendering: boolean = false;

    constructor(canvasID: string) {
        let canvas = document.querySelector<HTMLCanvasElement>(`canvas#${canvasID}`);
        if (!canvas) throw new Error('e');

        this.canvas = canvas;

        let ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('es');

        this.context = ctx;
        this.context.imageSmoothingEnabled = false;
        this.gui = new GUI(this);

        this.sprites = document.createElement('img');
        this.sprites.src = './sprites.png'

        this.drawMethods = {
            repeat: (x, y, w, h, spriteX, spriteY) => {
                let inverseY = -(y - this.canvas.height + h);
    
                let spritePos: Vector2 = [spriteX * 32, spriteY * 32];
    
                for (var i = 0; i * 32 < h - 32; i++) {
                    for(var j = 0; j * 32 < w - 32; j++) {
                        this.context.drawImage(this.sprites, ...spritePos, 32, 32, x + j * 32, inverseY + i * 32, 32, 32);
                    };
    
                    var endw = w - j * 32
                    this.context.drawImage(this.sprites, ...spritePos, endw, 32, x + j * 32, inverseY + i * 32, endw, 32);
                };
    
                let endh = h - i * 32
    
                for (var j = 0; j * 32 < w - 32; j++) {
                    this.context.drawImage(this.sprites, ...spritePos, 32, endh, x + j * 32, inverseY + i * 32, 32, endh);
    
                };
    
                endw = w - j * 32;
                this.context.drawImage(this.sprites, ...spritePos, endw, endh, x + j * 32, inverseY + i * 32, endw, endh);
            },
    
            fill: (x, y, w, h, spriteX, spriteY) => {
                y = -(y - this.canvas.height + h);
    
                let spritePos: Vector2 = [spriteX * 32, spriteY * 32];
                let maxSize = Math.max(w, h);
    
                this.context.drawImage(this.sprites, ...spritePos, 32, 32, x - w / 2, y , maxSize, maxSize);
            }
        }
    }

    render(data: GameRenderData) {
        this.context.fillStyle = '#00a0f0ff';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.renderGameObject(data[0]);
        this.renderEntity(data[1]);
        this.gui.draw();
        this.renderGameObject(data[2]);
    }

    renderGameObject(data: RenderData[]) {
        for (const [x, y, w, h, spriteIndex, spriteType] of data) if(spriteType in this.drawMethods) {
            this.drawMethods[spriteType](x, y, w, h, ...this.spriteIndexToVector2(spriteIndex));
        } else {
            throw new SpriteTypeError(`sprite render method: [ ${spriteType}(); ] dont exist!`);
        }
    }

    renderEntity(data: EntityRenderData[]) {
        for(let [x, y, w, h, spriteIndex, spriteType, health, maxHealth] of data) if(spriteType in this.drawMethods) {
            this.drawMethods[spriteType](x, y, w, h, ...this.spriteIndexToVector2(spriteIndex));

            if(health < maxHealth){
                let healthBar = new StatusBar(this, 1, " ", [0, 0], 100, "#0040202f", "#00f0b0af");

                healthBar.pos = [
                    x - (healthBar.width - w + 20) / 2, 
                    healthBar.pos[1] = y + h + 10
                ];
    
                healthBar.fillPerc = health / maxHealth;
                healthBar.draw();
            };
        } else {
            throw new SpriteTypeError(`sprite render method: [ ${spriteType}(); ] dont exist!`);
        }
    }

    spriteIndexToVector2(index: number): Vector2 {
        return [index % this.SPRITES_IMAGE_WIDTH, Math.trunc( index / this.SPRITES_IMAGE_WIDTH ) ];
    }
};