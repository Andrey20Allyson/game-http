import { Entity } from "./entity.js";

class NPC extends Entity {
    constructor() {
        super();
        this.color = "#ff4a4a2f";

        // this.NPCHealthBar = new StatusBar(1, "Enemy", new Vector2(this.pos.x - this.size.x / 20, this.pos.y), 180, "#400000ff", "#d01f1fff");
    };

    // draw(){
    //     super.draw();

    //     if(this.health < this.maxHealth){
    //         this.NPCHealthBar.pos.x = this.pos.x - ((this.NPCHealthBar.width - this.size.x + 20) / 2);
    //         this.NPCHealthBar.pos.y = this.pos.y + this.size.y + 10;

    //         this.NPCHealthBar.fillPerc = this.health / this.maxHealth;
    //         this.NPCHealthBar.draw();
    //     };
    // };
};

export { NPC };