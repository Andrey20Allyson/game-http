import { Player } from '../entity/player.js';

class KeyboardListener{
    /**
     * 
     * @param {Player} player 
     */
    constructor(player){
        this.player = player
        
        this.keyFuncts = {
            'a': (pressing) => {
                this.player.walkDir.x = -pressing
                this.player.faceTo = -1
            },
            'w': (pressing) => {
                this.player.walkDir.y = pressing
            },
            's': (pressing) => {
                this.player.walkDir.y = -pressing
            },
            'd': (pressing) => {
                this.player.walkDir.x = pressing
                this.player.faceTo = 1
            },
            'j': (pressing) => {
                this.player.attack = pressing ? 'punch': null
            },
            'k': (pressing) => {
                this.player.attack = pressing ? 'kick': null
            },
            'l': (pressing) => {
                this.player.blocking = Boolean(pressing)
            }
        }

        this.startListener()
    }

    startListener(){
        document.addEventListener('keydown', (keyBoardEvent) => {
            var key = keyBoardEvent.key
            if(this.keyFuncts[key]){
                this.keyFuncts[key](1)
            }
        })

        document.addEventListener('keyup', (keyBoardEvent) => {
            var key = keyBoardEvent.key
            if(this.keyFuncts[key]){
                this.keyFuncts[key](0)
            }
        })
    }
}

export { KeyboardListener }