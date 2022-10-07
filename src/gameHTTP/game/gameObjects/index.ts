import { Sprite } from "./sprites";
import { Game } from "..";

export type Vector2 = [number, number];
export type RenderData = [...Vector2, ...Vector2, number, string];

export class Object2D {
    pos: Vector2 = [0, 0];
    size: Vector2 = [80, 80];
    color: string = '#4a4a4aff';

    constructor() {
        this.pos = [0, 0];
        this.size = [80, 80];
    }
};

export interface GameObjectOptions {
    game: Game;
}

export class GameObject extends Object2D {
    sprite: Sprite;
    game: Game;
    velocity: Vector2;

    constructor({ game }: GameObjectOptions) {
        super();

        this.sprite = new Sprite(1, 'repeat');

        this.game = game;

        this.velocity = [0, 0];
    }

    getRenderData(): RenderData {
        return [...this.pos, ...this.size, this.sprite.index, this.sprite.type];
    }

    colliding(x: number, y: number, width: number, height: number): boolean {
        return (
            (this.pos[0] < x + width) &&
            (this.pos[0] + this.size[0] > x) &&
            (this.pos[1] < x + height) &&
            (this.pos[1] + this.size[1] > y)
        );
    }
};