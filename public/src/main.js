import { GameCanvas } from "./gui/gameCanvas.js";
import { connectWithServer } from "./server-connection/connection.js";
import { KeyboardListener } from "./input/keyboardListener.js";
import {  } from 'ga'

const LISTENER = new KeyboardListener();

GameCanvas.init('gameScreen');

connectWithServer()
.then(socket => {

    let noKeysCount = 0;

    let keysListenerUpdate = setInterval(() => {
        noKeysCount = LISTENER.pressedKeys.length ? 0: noKeysCount + 1; 
        if(noKeysCount < 2)
            socket.emit('client-update', LISTENER.pressedKeys);
    }, 1000 / 15);

    socket.on('player-update', playerGuiData => GameCanvas.gui.setData( playerGuiData ));

    socket.on('game-update', renderDatas => GameCanvas.render( renderDatas ));
})
.catch(reason => {
    console.log(reason);
});