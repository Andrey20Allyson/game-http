import { readFile } from 'fs';
import { homedir } from 'os';
import { Game } from '../game.js';
import { GameObject } from '../gameObjects/gameObject.js';

/**
 * @typedef {import('game').Terrain} Terrain
 * @typedef {import('../game').Game} Game
 */

class ParamError extends Error {
    /**
     * 
     * @param {string} msg 
     */
    constructor(msg) {
        super(msg);
        this.name = 'ParamError';
    }
}

class TerrainLoader {
    /**@type {Game} */
    game = null;

    /**
     * 
     * @param {Game} game 
     */
    constructor(game) {
        if(!(game instanceof Game))
            throw new ParamError('the param game dont is a instance of Game!');
        this.game = game;
    }

    /**
     * 
     * @param {string} path
     * @returns {Promise<Terrain>}
     */
    load(path=homedir() + '/AppData/Roaming/Game/terrain/t0.json') {
        return new Promise((resolve, reject) => {
            readFile(path, (err, data) => {
                if(err)
                    reject(err);

                let jsonData = JSON.parse(data.toString('utf-8'));
                
                resolve(jsonData);
            });
        });
    }

    /**
     * 
     * @param {Terrain} data
     */
    apply(data) {
        data.follors.forEach(([x, y, w, h, sx, sy, stype]) => {
            let object =  new GameObject();
            object.pos = [x, y];
            object.size = [w, h];
            object.spriteID = [sx, sy];
            object.spriteType = stype;

            this.game.addFollor(object);
        });
    }
}

export { TerrainLoader }