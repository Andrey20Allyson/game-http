export class KeyboardListener{
    pressedKeys: string[] = [];

    constructor() {
        document.addEventListener('keydown', ({ key }) => {
            if(!this.pressedKeys.includes(key))
                this.pressedKeys.push(key);
        });

        document.addEventListener('keyup', ({ key }) => {
            let keyIndex = this.pressedKeys.indexOf(key); 
            keyIndex != -1 ?
                this.pressedKeys.splice(keyIndex, 1):
                null;
        });
    }
};