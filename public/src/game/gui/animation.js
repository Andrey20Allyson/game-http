import { Entity } from "../entity/entity.js";

const AnimationConstructError = new Error("This constructor must have a owner param!")
AnimationConstructError.name = "AnimationConstructError"

class Animation{
    /**
     * 
     * @param {Entity} owner 
     * @param {String} path 
     * @param {Number} duration 
     * @param {Boolean} oneTime
     */
    constructor(owner, path="test model1", duration=2, oneTime=false){
        if(!owner){
            throw AnimationConstructError
        }

        this.keyFrames = []
        
        /**@type {Entity} */
        this.owner = owner

        /**@type {String} */
        this.path = path

        /**@type {Number} */
        this.duration = duration

        /**@type {Boolean} */
        this.oneTime = oneTime

        /** @private */
        this.delay = 1

        /**@private */
        this.runningloopId = NaN
    }

    loadKeyFrames(path, name, length){
        if(!path || !name || !length){
            throw ParamError
        }

        this.keyFrames = []
        this.path = path

        for(var i = 0; i < length; i++){
            this.keyFrames[i] = `${name}${i}`
        }
    }

    start(){
        this.stop()

        this.delay = this.duration * 1000 / this.keyFrames.length
        this.runningloopId = Math.trunc(Math.random() * 9999)

        this.animationLoop()
    }

    stop(){
        this.runningloopId = NaN;
    }

    async animationLoop(){
        var loopId = this.runningloopId;
        var frame = 0;

        while(loopId == this.runningloopId){
            this.owner.sprite.name = this.keyFrames[frame];
            frame = frame < this.keyFrames.length ? frame + 1: 0;

            await sleep(this.delay);
        }
    }
}

export { Animation };