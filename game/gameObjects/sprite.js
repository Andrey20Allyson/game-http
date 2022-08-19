class ParamError extends Error {
    constructor(param) {
        super(`${param} don't is defined!`);
    }
}

class Sprite {
    static SPRITES_IMAGE_WIDTH = 32;

    /**@type {number} */
    index;
    /**@type {string} */
    type;

    /**
     * 
     * @param {GameObject} owner 
     * @param {number} index
     */
    constructor(index=0, type='repeat') {
        this.index = index;
        this.type = type;
    }
    
    setIndexByVector2(x, y) {
        this.index = x + Sprite.SPRITES_IMAGE_WIDTH * y;
    }
}

export { Sprite }