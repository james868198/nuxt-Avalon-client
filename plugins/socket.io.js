import io from 'socket.io-client'
// import config from '../nuxt.config.js'
// const host = config.gameServer.host || '0.0.0.0'
// const port = config.gameServer.host || 8080
const host = '0.0.0.0'
const port = 8080

const url = `http://${host}:${port}`
const options = {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: Infinity
}

export default { io, url, options }
