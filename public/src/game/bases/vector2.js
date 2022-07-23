
class Vector2 {
    constructor(x = 0, y = 0){
        /**@type {number}*/
        this.x = x;
        
        /**@type {number}*/
        this.y = y;
    }

    set(x, y){
        this.x = x;
        this.y = y;
    }

    /**
     * @returns {Number[]}
     */
    get list(){
        return [this.x, this.y];
    }
};

export { Vector2 };