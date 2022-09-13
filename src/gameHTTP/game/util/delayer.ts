export interface ITimeDelay {
    [k: string]: number;
}

export class Delayer {
    private delays: ITimeDelay;
    private times: ITimeDelay;

    constructor() {
        this.delays = {}
        this.times = {}
    }

    addDelay(name: string, time: number): void {
        this.delays[name] = time;
        this.times[name] = time;
    }

    setTime(name: string, delay: number): void {
        this.times[name] = delay > 0 ? delay: 0; 
    }

    isTimeOutReset(name: string): boolean {
        let isTimeOut = !this.times[name]
        if (isTimeOut) {
            this.reset(name)
            return true
        } else {
            this.next(name)
            return false
        }
    }

    isTimeOut(name: string): boolean {
        let isTimeOut = !this.times[name]
        this.next(name)

        return isTimeOut
    }

    reset(name: string): void {
        this.times[name] = this.delays[name]
    }

    next(name: string): void {
        this.times[name] -= this.times[name]? 1: 0;
    }
}