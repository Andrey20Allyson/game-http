import { GameScreen, GameRenderData } from "./render/screen.js";
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

    socket.on('player-update', (playerGuiData: any) => screen.gui.setData( playerGuiData ));

    socket.on('game-update', (renderDatas: GameRenderData) => screen.render( renderDatas ));
})
.catch(reason => {
    console.log(reason);
});