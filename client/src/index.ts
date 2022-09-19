import { GameScreen, GameRenderData, PlayerGUIData } from "./render/screen.js";
import { connectWithServer } from "./connection.js";
import { KeyboardListener } from "./inputs.js";

const LISTENER = new KeyboardListener();

const screen = new GameScreen('gameScreen');

connectWithServer()
.then(socket => {
    let noKeysCount = 0;

    let keysListenerUpdate = setInterval(() => {
        noKeysCount = LISTENER.pressedKeys.length ? 0: noKeysCount + 1; 
        if(noKeysCount < 2)
            socket.emit('client-update', LISTENER.pressedKeys);
    }, 1000 / 15);

    socket.on('player-update', (playerGuiData: PlayerGUIData) => {
        try {
            screen.gui.setData(playerGuiData);
        } catch (e) {
            console.log(e);
        }
    });

    socket.on('game-update', (gameRenderData: GameRenderData) => {
        try {
            screen.render(gameRenderData);
        } catch (e) {
            console.log(e);
        }
    });
})
.catch(reason => {
    console.log(reason);
});