import { GameObject, Vector2, RenderData } from "../gameObjects";
import { Delayer } from '../util/delayer';
import { Skill } from "./ability";
import { Sprite } from '../gameObjects/sprites'

export type EntityRenderData = [...RenderData, number, number, number, number];

export interface IEntityAnimations {
    walk: Anim;
    jump: Anim;
    attacks: [string, Anim][];
}

export class Entity extends GameObject {
    animations: IEntityAnimations = {
        walk: new Anim(this, 64, 1, 80, true),
        jump: new Anim(this, 64, 1, 80, true),
        attacks: []
    };
    id?: string;
    sprite: Sprite;
    faceTo: number;
    walkDir: Vector2;
    skill: Skill;
    health: number;
    energy: number;
    blocking: boolean;
    alive: boolean;
    attack?: string;
    delayer: Delayer;

    constructor() {
        super();

        this.size = [64, 128];
        this.walkDir = [0, 0];

        this.color = "#ffff4aff";

        this.sprite = new Sprite(64, 'fill');

        this.skill = new Skill();

        this.health = this.maxHealth;
        this.energy = this.maxEnergy;

        this.blocking = false;
        this.alive = true;
        this.faceTo = 1;

        this.delayer = new Delayer();
        this.delayer.addDelay("heal", 8);
        this.delayer.addDelay("attack", 0);
        this.delayer.addDelay("blockingEnergyUsage", 6);
    }

    get maxHealth(): number {
        return this.skill.vitality * 100
    }

    get maxEnergy(): number {
        return this.skill.vitality * this.skill.strength * 100
    }

    get energyRegen() {
        return this.skill.regeneration * (this.skill.strength ** 1.6) * 4
    }

    get healthRegen() {
        return this.skill.vitality * (this.skill.regeneration ** 1.6) / 4
    }

    get walkSpeed() {
        return this.skill.speed * 18
    }

    getEntityRenderData(): EntityRenderData {
        return [...this.getRenderData(), this.health, this.maxHealth, this.energy, this.maxEnergy];
    }

    takeDamage(damage: number, tickRate: number) {
        if (!this.blocking) {
            this.health -= 2 * damage / (1 + this.skill.defence * this.skill.strength);
            this.delayer.setTime("heal", Math.trunc(5 * tickRate / this.skill.regeneration));
        } else {
            this.health -= damage / (1 + (this.skill.defence ** 2) * this.skill.strength);
        }

        if(this.health <= 0) {
            this.alive = false;
            this.health = 0;
        }
    }

    hasEnergy(usage: number): boolean {
        return this.energy - usage / (1 + this.skill.regeneration * this.skill.strength) > 0;
    }

    useEnergy(usage: number, tickRate: number): boolean {
        let newEnergy = this.energy - usage / (1 + this.skill.regeneration * this.skill.strength);
        let hasEnough = false;

        if (newEnergy > 0) {
            this.energy = newEnergy;
            this.delayer.setTime("heal", Math.trunc(3 * tickRate / this.skill.regeneration));
            hasEnough = true;
        } else {
            this.energy = this.maxEnergy * .04;
            this.takeDamage(this.maxHealth * .02 / this.skill.strength, tickRate);
            this.delayer.setTime("heal", Math.trunc(9 * tickRate / this.skill.regeneration));
        }

        return hasEnough
    }

    heal() {
        if (!this.alive) {return}

        let newHealth = this.health + this.healthRegen
        let newEnergy = this.energy + this.energyRegen

        if (newHealth < this.maxHealth) {
            this.health += this.healthRegen
        } else if(this.health < this.maxHealth) {
            this.health = this.maxHealth
        }

        if (newEnergy < this.maxEnergy) {
            this.energy += this.energyRegen
        } else if(this.energy < this.maxEnergy) {
            this.energy = this.maxEnergy
        }
    }
}

export type PlayerGUIData = [number, number, number, number, number, number, number];

export class Player extends Entity {
    attackInputs: [string, string][] = [
        ['j', 'punch'],
        ['k', 'kick']
    ]

    walkInputs: [string, string][] = [
        ['d', 'a'],
        ['w', 's']
    ]

    faceToRule: [[number, number], [number, number]] = [
        [0, -1],
        [1,  0]
    ]

    constructor() {
        super()
        this.color = "#0fea2a2f"
    }

    setAttack(pressedKeys: string[]) {
        for(let [key, attack] of this.attackInputs) if(pressedKeys.includes(key)) {
            this.attack = attack;
            return;
        }

        this.attack = undefined;
    }

    setWalkDir(pressedKeys: string[]) {
        let [[walkRight, walkLeft], [up, down]] = this.walkInputs;

        let walkTo = Number(pressedKeys.includes(walkRight)) - Number(pressedKeys.includes(walkLeft));

        this.walkDir[0] = walkTo;
        this.walkDir[1] = Number(pressedKeys.includes(up)) - Number(pressedKeys.includes(down));

        if(walkTo)
            this.faceTo = walkTo;
    } 

    getPlayerGUIData(): PlayerGUIData {
        return [this.health, this.maxHealth, this.energy, this.maxEnergy, 5, 10, 1];
    }
}

export class NPC extends Entity {
    constructor() {
        super();
        this.color = "#ff4a4a2f";
    }
};

export class Anim {
    target: Entity;
    length: number;
    step: number;
    delayer: Delayer;
    index: number;
    animDir: number;
    loop: boolean;

    constructor(target: Entity, index: number, length: number, delay: number, loop?: boolean) {
        this.target = target;

        this.delayer = new Delayer();
        this.delayer.addDelay('next-frame', delay);

        this.length = length;
        this.index = index;

        this.step = 0;
        this.animDir = 1;
        this.loop = loop ?? true;
    }

    get frameIndex() {
        return this.step * 2 + this.index + (-this.target.faceTo + 1) / 2;
    }

    nextStep() {
        this.step = this.step + 1 < this.length ? this.step + 1: 0;
        this.updateSpriteIndex();
    }

    reset() {
        this.step = 0;
        this.updateSpriteIndex();
    }

    updateSpriteIndex() {
        this.target.sprite.index = this.frameIndex;
    }

    next() {
        if(this.animDir == this.target.faceTo) {
            this.nextStep();
        } else {
            this.reset();
            this.animDir = this.target.faceTo; 
        }
    }
}