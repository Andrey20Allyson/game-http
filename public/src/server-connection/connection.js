/**
 * @typedef {import("socket.io-client").Socket} Socket 
 * @typedef {import("socket.io-client").Manager} Manager
 * @typedef {import("socket.io-client").ManagerOptions} ManagerOptions
 * @typedef {import("socket.io-client").SocketOptions} SocketOptions
 * @typedef {import("socket.io/dist/typed-events").DefaultEventsMap} DefaultEventsMap
 * @typedef {import('socket.io-client').connect} ioFunc
 */;

/**@type {ioFunc} */
var connect = io;

const REQUEST_TIMEOUT = 5000

class SocketReq {

    /**
     * 
     * @returns {Promise<{socket: Socket}>}
     */
    static connectWithServer() {
        return new Promise((resolve) => {
            var socket = connect();

            socket.on('connect', () => {
                resolve({socket})
            });
        });
    }

    /**
     * 
     * @param {Socket} socket 
     * @returns {Promise<{ping: number}>}
     */
    static ping(socket) {
        return new Promise((resolve) => {
            var before = new Date().getTime();

            socket.emit('r-ping', () => {
                var now = new Date().getTime();
                var ping = Math.trunc((now - before) / 2);

                resolve({ping});
            });
        });
    }
}

export { SocketReq };