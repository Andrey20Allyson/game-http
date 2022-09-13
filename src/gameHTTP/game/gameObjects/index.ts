import { Sprite } from "./sprites";

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

export class GameObject extends Object2D {
    sprite: Sprite;
    velocity: Vector2;

    constructor() {
        super();

        this.sprite = new Sprite(1, 'repeat');
        this.velocity = [0, 0];
    };

    getRenderData(): RenderData {
        return [...this.pos, ...this.size, this.sprite.index, this.sprite.type];
    };

    colliding(x: number, y: number, w: number, h: number): boolean {
        return (
            (this.pos[0] < x + w) &&
            (this.pos[0] + this.size[0] > x) &&
            (this.pos[1] < x + h) &&
            (this.pos[1] + this.size[1] > y)
        );
    };
};