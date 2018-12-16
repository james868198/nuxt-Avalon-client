const joinGame = (socket, data) => {
    socket.emit('joinGame', data)
}
const setName = (socket, data) => {
    socket.emit('setName', data)
}
const chat = (socket, data) => {
    socket.emit('chat', data)
}
const getGames = socket => {
    socket.emit('getGames')
}
const createGame = (socket, data) => {
    socket.emit('createGame', data)
}
const getGameById = (socket, id) => {
    socket.emit('getGameById', id)
}
const getIdentity = socket => {
    socket.emit('getIdentity')
}
export default {
    // all
    chat,
    setName,
    getGameById,
    // hall
    getGames,
    createGame,
    // game
    joinGame,
    getIdentity
}
