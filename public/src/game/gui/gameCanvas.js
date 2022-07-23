class GameCanvas{
    /**@type {HTMLElement?} */
    static canvas = null;
    /**@type {CanvasRenderingContext2D?} */
    static context = null;

    /**
     * 
     * @param {string} canvasID 
     * @param {CanvasRenderingContext2D?} config
     */
    static setContext2D(canvasID, config = {imageSmoothingEnabled: false}) {

        this.canvas = document.getElementById(canvasID);
        
        /**@type {CanvasRenderingContext2D} */
        this.context = this.canvas.getContext('2d');

        for(let [key, value] of Object.entries(config)) if(typeof value != 'function') {
            this.context[key] = value;
        };
    };
};

export { GameCanvas };