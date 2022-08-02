class KeyboardListener{
    keysPresseds = {
        a: false,
        w: false,
        s: false,
        d: false,
        j: false,
        k: false,
        l: false
    };

    constructor() {
        document.addEventListener('keydown', ({ key }) => {
            if(key in this.keysPresseds)
                this.keysPresseds[key] = true ;
        });

        document.addEventListener('keyup', ({ key }) => {
            if(key in this.keysPresseds)
                this.keysPresseds[key] = false;
        });
    }
}

export { KeyboardListener }