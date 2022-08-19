import { Entity } from "./entity.js";

/**
 * @typedef {import("game").PlayerGUIData} PlayerGUIData
 */

class Player extends Entity{
    /**@type {[string, string][]} */
    attackInputs = [
        ['j', 'punch'],
        ['k', 'kick']
    ]

    walkInputs = [
        ['d', 'a'],
        ['w', 's']
    ]

    faceToRule = [
        [0, -1],
        [1,  0]
    ]

    constructor(){
        super()
        this.color = "#0fea2a2f"
    }

    /**
     * 
     * @param {string[]} pressedKeys 
     */
    setAttack(pressedKeys) {
        for(let [key, attack] of this.attackInputs) if(pressedKeys.includes(key)) {
            this.attack = attack;
            return;
        }

        this.attack = null;
    }

    /**
     * 
     * @param {string[]} pressedKeys 
     */
    setWalkDir(pressedKeys) {
        let [[walkRight, walkLeft], [up, down]] = this.walkInputs;

        let walkTo = pressedKeys.includes(walkRight) - pressedKeys.includes(walkLeft);

        this.walkDir[0] = walkTo;
        this.walkDir[1] = pressedKeys.includes(up) - pressedKeys.includes(down);

        if(walkTo)
            this.faceTo = walkTo;
    } 

    /**
     * 
     * @returns {PlayerGUIData}
     */
    getPlayerGUIData() {
        return [this.health, this.maxHealth, this.energy, this.maxEnergy, 5, 10, 1];
    }
}

export { Player };