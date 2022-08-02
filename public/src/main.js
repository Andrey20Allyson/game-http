import { GameCanvas } from "./game/gui/gameCanvas.js";
import { SocketReq } from "./server-connection/connection.js";
import { KeyboardListener } from "./game/input/KeyboardListener.js";

/**
 * @typedef {import('./game/gameObjects/gameObject').GameObject} GameObject
 * @typedef {import('./game/bases/vector2').RenderData} RenderData
 */

const LISTENER = new KeyboardListener();

GameCanvas.init('gameScreen');

SocketReq.connectWithServer()
.then(
    ({socket}) => {
    console.log('>> Connected with id: %s', socket.id);
    GameCanvas.start();

    setInterval(() => {
        socket.emit('client-update', LISTENER.keysPresseds)
    }, 1000 / 15)

    socket.on('game-update', 
    /**@type {(renderDatas: RenderData[]) => void} */
    (renderDatas) => {
        GameCanvas.renderDatas = renderDatas;
    });
});