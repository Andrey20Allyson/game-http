import { Vector2 } from "../gameObjects";
import { Entity } from ".";

export class Skill{
    level: number;
    defenceSkillPoints: number;
    vitalitySkillPoints: number;
    regenerationSkillPoints: number;
    speedSkillPoints: number;
    strengthSkillPoints: number;

    constructor() {
        this.level = 1
        this.defenceSkillPoints = 0
        this.vitalitySkillPoints = 0
        this.regenerationSkillPoints = 0
        this.speedSkillPoints = 0
        this.strengthSkillPoints = 0
    }

    get defence() {
        return .5 + .1 * this.level + .2 * this.defenceSkillPoints
    }

    get vitality() {
        return .5 + .15 * this.level + .25 * this.vitalitySkillPoints
    }

    get regeneration() {
        return .5 + .1 * this.level + .15 * this.regenerationSkillPoints
    }

    get speed() {
        return .5 + .15 * this.level + .1 * this.speedSkillPoints
    }

    get strength() {
        return .5 + .1 * this.level + .2 * this.strengthSkillPoints
    }
}

export interface AttackStack {
    [k: string]: Attack | undefined;
}

export class Attack{
    static ATTACKS: AttackStack = {
        "punch": new Attack([.5, .6], [1, .3], 5, 10, 5, .3),
        "kick": new Attack([.4, 0], [1, .4], 8, 20, 15, .7)
    }

    static addAttack(name: string, attack: Attack) {
        if (attack instanceof(Attack)) {
            Attack.ATTACKS[name] = attack
        } else {
            console.error("parameter attack don't is a instance of Attack")
        }
    }

    relativeHitPos: Vector2;
    relativeHitSize: Vector2;
    baseDamage: number;
    neededStrength: number;
    energyUsage: number;
    delay: number;

    constructor(relativeHitPos: Vector2, relativeHitSize: Vector2, baseDamage: number, neededStrength: number, energyUsage: number, delay: number) {
        this.relativeHitPos = relativeHitPos;
        this.relativeHitSize = relativeHitSize;
        this.baseDamage = baseDamage;
        this.neededStrength = neededStrength;
        this.energyUsage = energyUsage;
        this.delay = delay;
    }

    useAttack(attackUser: Entity, entityList: Entity[], tickRate: number) {
        var isRight = (1 + attackUser.faceTo) / 2
        var isLeft = (attackUser.faceTo - 1) / 2
        var attackHitSize: Vector2 = [attackUser.size[0] * this.relativeHitSize[0], attackUser.size[1] * this.relativeHitSize[1]];
        var HitX = attackUser.pos[0] + attackUser.size[0] * (isLeft + this.relativeHitPos[0] * attackUser.faceTo) - attackHitSize[0] * isLeft;
        var attackHitPos: Vector2 = [HitX, attackUser.pos[1] + (attackUser.size[1] * this.relativeHitPos[1])];

        var hitBox: [...Vector2, ...Vector2] = [...attackHitPos, ...attackHitSize]

        /**@type {Entity[]} */
        var targets: Entity[] = []

        for (var target of entityList) {
            if(target !== attackUser && target.colliding(...hitBox)) {
                targets[targets.length] = target
            }
        }
        
        if (targets.length) {
            for(var target of targets) {
                var energyMult = attackUser.energy < this.energyUsage ? .2: 1
                target.takeDamage(this.baseDamage * attackUser.skill.strength * (1 - .8 * Number(attackUser.energy < this.energyUsage)), tickRate)
                target.velocity[1] += this.baseDamage * 2
                target.velocity[0] += attackUser.skill.strength * attackUser.faceTo * this.baseDamage * (1 - .4 * Number(target.blocking))

                attackUser.useEnergy(this.energyUsage * (1 + .4 * Number(target.blocking)), tickRate)
            }
        } else {
            attackUser.useEnergy(this.energyUsage / 2, tickRate)
        }

        attackUser.delayer.setTime("attack", Math.trunc(tickRate * this.delay))
    }
}