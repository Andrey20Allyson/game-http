export type SpriteTypes = 'repeat' | 'fill';

export class Sprite {
    static SPRITES_IMAGE_WIDTH: number = 32;
    index: number;
    type: string;

    constructor(index: number = 0, type = 'repeat') {
        this.index = index;
        this.type = type;
    }
    
    setIndexByVector2(x: number, y: number) {
        this.index = x + Sprite.SPRITES_IMAGE_WIDTH * y;
    }
};