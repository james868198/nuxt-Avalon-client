import gameController from '../socketControllers/gameController'
import chatController from '../socketControllers/baseController'

export default (socket, db) => {
    socket.userName = ''
    socket.room = null
    socket.player = {
        name: 'gamer'
    }
    console.log('game socket start, id:%s', socket.id)

    // on
    socket.on('chat', data => {
        if (!socket.room) {
            return
        }
        console.log('socket chat', data)
        socket.to(socket.room).emit('message', data)
        socket.emit('message', data)
    })
    socket.on('joinGame', data => gameController.joinGame(socket, db, data))

    socket.on('getGameById', id => gameController.getGameById(socket, db, id))

    // socket.on('action', gameController.action(socket, db, data))
    // socket.on('vote', gameController.vote(socket, db, data))
    // socket.on('assassinate', gameController.assassinate(socket, db, data))

    socket.on('disconnect', () => gameController.leaveGame(socket, db))

    // socket.on('startGame', () => gameController.startGame(socket, db, data))
}
