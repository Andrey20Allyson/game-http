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

/**
 * 
 * @returns {Promise<Socket>}
 */
function connectWithServer() {
    return new Promise((resolve) => {
        var socket = connect();

        socket.on('connect', () => {
            console.log('>> Connected with id: %s', socket.id);
            resolve(socket)
        });
    });
}


export { connectWithServer };