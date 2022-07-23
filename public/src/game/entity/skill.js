class Skill{
    constructor(){
        this.level = 1
        this.defenceSkillPoints = 0
        this.vitalitySkillPoints = 0
        this.regenerationSkillPoints = 0
        this.speedSkillPoints = 0
        this.strengthSkillPoints = 0
    }

    get defence(){
        return .5 + .1 * this.level + .2 * this.defenceSkillPoints
    }

    get vitality(){
        return .5 + .15 * this.level + .25 * this.vitalitySkillPoints
    }

    get regeneration(){
        return .5 + .1 * this.level + .15 * this.regenerationSkillPoints
    }

    get speed(){
        return .5 + .15 * this.level + .1 * this.speedSkillPoints
    }

    get strength(){
        return .5 + .1 * this.level + .2 * this.strengthSkillPoints
    }
}

export { Skill };