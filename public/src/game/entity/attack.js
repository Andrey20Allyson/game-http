import { Game } from "../game.js";

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
    useAttack(attackUser, entityList){
        var isRight = (1 + attackUser.faceTo) / 2
        var isLeft = (attackUser.faceTo - 1) / 2
        var attackHitSize = [attackUser.size.x * this.relativeHitSize.x, attackUser.size.y * this.relativeHitSize.y];
        var HitX = attackUser.pos.x + attackUser.size.x * (isLeft + this.relativeHitPos.x * attackUser.faceTo) - attackHitSize.x * isLeft;
        var attackHitPos = [HitX, attackUser.pos.y + (attackUser.size.y * this.relativeHitPos.y)];

        var hitBox = [...attackHitPos.list, ...attackHitSize.list]

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
                target.takeDamage(this.baseDamage * attackUser.skill.strength * (1 - .8 * (attackUser.energy < this.energyUsage)))
                target.velocity.y += this.baseDamage * 2
                target.velocity.x += attackUser.skill.strength * attackUser.faceTo * this.baseDamage * (1 - .4 * target.blocking)

                attackUser.useEnergy(this.energyUsage * (1 + .4 * target.blocking))
            }
        } else {
            attackUser.useEnergy(this.energyUsage / 2)
        }

        attackUser.delayer.setTime("attack", Math.trunc(Game.TICK_RATE * this.delay))
    }
}

export { Attack };