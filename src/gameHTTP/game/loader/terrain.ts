import { readFile } from 'fs/promises';
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
    loadedTerrain?: Terrain;

    constructor(game: Game) {
        this.game = game;
    }

    async load(path: string = homedir() + '/AppData/Roaming/Game/terrain/t0.json') {
        let data = await readFile(path);

        let jsonData: Terrain = JSON.parse(data.toString('utf-8'));
        
        return jsonData;
    }

    apply(data: Terrain) {
        for (const [x, y, w, h, sx, sy, stype] of data.follors) {
            let object =  new GameObject();
            object.pos = [x, y];
            object.size = [w, h];
            object.sprite.setIndexByVector2(sx, sy);
            object.sprite.type = stype;

            this.game.addFollor(object);
        };
    }
}

export { TerrainLoader }