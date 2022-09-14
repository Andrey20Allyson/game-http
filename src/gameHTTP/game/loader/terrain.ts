import { readFile } from 'fs';
import { homedir } from 'os';
import { Game } from '..';
import { GameObject, Vector2 } from '../gameObjects';

interface Terrain {
    name: string;
    follors: [...Vector2, ...Vector2, ...Vector2, string][];
    background: [...Vector2, ...Vector2, ...Vector2, string][];
}

class TerrainLoader {
    game: Game;

    constructor(game: Game) {
        this.game = game;
    }

    load(path: string = homedir() + '/AppData/Roaming/Game/terrain/t0.json') {
        return new Promise((resolve, reject) => {
            readFile(path, (err, data) => {
                if (err) reject(err);

                let jsonData = JSON.parse(data.toString('utf-8'));
                
                resolve(jsonData);
            });
        });
    }

    apply(data: Terrain) {
        data.follors.forEach(([x, y, w, h, sx, sy, stype]) => {
            let object =  new GameObject();
            object.pos = [x, y];
            object.size = [w, h];
            object.sprite.setIndexByVector2(sx, sy);
            object.sprite.type = stype;

            this.game.addFollor(object);
        });
    }
}

export { TerrainLoader }