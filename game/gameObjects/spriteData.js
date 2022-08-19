class SpriteData {
    static SPRITE_SIZE = 32;
    static SRC_WIDTH = 64;
    static SRC_HEIGHT = 64;

    index = 0;
    renderMethod = 'fill';

    constructor() {}

    /**@type {() => {x: number, y: number}} */
    getSpritePos() {
        var y = Math.trunc( this.index / SpriteData.SRC_WIDTH );
        var x = this.index - y * SpriteData.SRC_WIDTH;

        return { x, y }
    }
}

console.log(Object.keys(sd));