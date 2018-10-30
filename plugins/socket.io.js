import io from 'socket.io-client'
const Socket = io('http://127.0.0.1:3000')

export default { io, Socket }
