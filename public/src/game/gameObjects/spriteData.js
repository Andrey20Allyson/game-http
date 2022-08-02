class SpriteData {
    static SPRITE_SIZE = 32;
    static SRC_WIDTH = 32;
    static SRC_HEIGHT = 32;

    index = 0;
    renderMethod = 'fill';

    /**@type {(config: SpriteData) => SpriteData} */
    constructor(config) {
        console.log(Object.keys(config));
        for(let i in config) {
            if(typeof this[i] != 'function') {
                this[i] = config[i];
            }
        }
    }

    /**@type {() => {x: number, y: number}} */
    getSpritePos() {
        var y = Math.trunc( this.index / SpriteData.SRC_WIDTH );
        var x = this.index - y * SpriteData.SRC_WIDTH;

        return { x, y }
    }
}

var sd = new SpriteData({index: 2});

console.log(Object.keys(sd));