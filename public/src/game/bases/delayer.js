class Delayer{
    constructor(){
        /**@private */
        this.delays = {}
        /**@private */
        this.times = {}
    }

    addDelay(name, time){
        this.delays[name] = time
        this.times[name] = time
    }

    /**
     * 
     * @param {String} name 
     * @param {Number} delay 
     */
    setTime(name, delay){
        this.times[name] = delay > this.times[name] ? delay: this.times[name] 
    }

    /**
     * 
     * @param {String} name 
     * @returns {boolean} boolean
     */
    isTimeOutReset(name){
        var isTimeOut = !this.times[name]
        if(isTimeOut){
            this.reset(name)
            return true
        } else {
            this.next(name)
            return false
        }
    }

    isTimeOut(name){
        var isTimeOut = !this.times[name]
        this.next(name)

        return isTimeOut
    }

    /**
     * 
     * @param {String} name 
     */
    reset(name){
        this.times[name] = this.delays[name]
    }

    /**
     * 
     * @param {String} name 
     */
    next(name){
        this.times[name] -= Boolean(this.times[name])
    }
}

export { Delayer };