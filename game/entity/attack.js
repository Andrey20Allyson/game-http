/**
 * @typedef {import('./entity').Entity} Entity
 */

class Attack{
    /**@type {Attack[]} */
    static ATTACKS = {
        "punch": new Attack([.5, .6], [1, .3], 5, 10, 5, .3),
        "kick": new Attack([.4, 0], [1, .4], 8, 20, 15, .7)
    }

    /**
     * 
     * @param {String} name 
     * @param {Attack} attack 
     */
    static addAttack(name, attack){
        if(attack instanceof(Attack)){
            Attack.ATTACKS[name] = attack
        } else {
            console.error("parameter attack don't is a instance of Attack")
        }
    }

    /**
     * 
     * @param {Vector2} relativeHitPos 
     * @param {Vector2} relativeHitSize 
     * @param {Number} baseDamage 
     * @param {Number} neededStrength 
     * @param {Number} energyUsage
     * @param {Number} delay
     */
    constructor(relativeHitPos, relativeHitSize, baseDamage, neededStrength, energyUsage, delay){
        this.relativeHitPos = relativeHitPos
        this.relativeHitSize = relativeHitSize
        this.baseDamage = baseDamage
        this.neededStrength = neededStrength
        this.energyUsage = energyUsage
        this.delay = delay
    }

    /**
     * 
     * @param {Entity} attackUser 
     * @param {Entity[]} entityList
     */
    useAttack(attackUser, entityList, tickRate){
        var isRight = (1 + attackUser.faceTo) / 2
        var isLeft = (attackUser.faceTo - 1) / 2
        var attackHitSize = [attackUser.size[0] * this.relativeHitSize[0], attackUser.size[1] * this.relativeHitSize[1]];
        var HitX = attackUser.pos[0] + attackUser.size[0] * (isLeft + this.relativeHitPos[0] * attackUser.faceTo) - attackHitSize[0] * isLeft;
        var attackHitPos = [HitX, attackUser.pos[1] + (attackUser.size[1] * this.relativeHitPos[1])];

        var hitBox = [...attackHitPos, ...attackHitSize]

        /**@type {Entity[]} */
        var targets = []

        for(var target of entityList){
            if(target !== attackUser && target.colliding(...hitBox)){
                targets[targets.length] = target
            }
        }
        
        if(targets.length){
            for(var target of targets){
                var energyMult = attackUser.energy < this.energyUsage ? .2: 1
                target.takeDamage(this.baseDamage * attackUser.skill.strength * (1 - .8 * (attackUser.energy < this.energyUsage)), tickRate)
                target.velocity[1] += this.baseDamage * 2
                target.velocity[0] += attackUser.skill.strength * attackUser.faceTo * this.baseDamage * (1 - .4 * target.blocking)

                attackUser.useEnergy(this.energyUsage * (1 + .4 * target.blocking), tickRate)
            }
        } else {
            attackUser.useEnergy(this.energyUsage / 2, tickRate)
        }

        attackUser.delayer.setTime("attack", Math.trunc(tickRate * this.delay))
    }
}

export { Attack };