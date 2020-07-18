const joinGame = (socket, data) => {
    socket.emit('joinGame', data)
}
const createUser = (socket, data) => {
    socket.emit('createUser', data)
}
const getUser = (socket, data) => {
    socket.emit('getUser', data)
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
const getPlayerInfo = socket => {
    socket.emit('getPlayerInfo')
}

const quest = (socket, data) => {
    socket.emit('quest', data)
}

const unQuest = (socket, data) => {
    socket.emit('unQuest', data)
}

const vote = (socket, data) => {
    socket.emit('vote', data)
}

const action = (socket, data) => {
    socket.emit('action', data)
}

const assassinate = (socket, data) => {
    socket.emit('assassinate', data)
}

export default {
    // all
    chat,
    createUser,
    getUser,
    getGameById,
    // hall
    getGames,
    createGame,
    // game
    joinGame,
    getPlayerInfo,
    quest,
    unQuest,
    vote,
    action,
    assassinate
}
