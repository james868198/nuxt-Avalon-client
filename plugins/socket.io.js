import io from 'socket.io-client'

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
