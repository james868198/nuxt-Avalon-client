import gameController from '../socketControllers/gameController'

let users = 0
const curRoomName = 'hall'

export default (socket, db) => {
    socket.userName = ''
    socket.join(curRoomName)
    console.log('socket start, id:%s', socket.id)
    console.log('user:', users)

    socket.emit('message', {
        userName: 'System',
        message: `Welcome to join us.`
    })
    // socket.on('connect', () => {
    //     users--
    // })
    socket.on('setName', data => {
        socket.userName = data.userName
        console.log('socket get user name', data.userName)
        socket.emit('socketId', {
            id: socket.id
        })
        users++
        socket.to(curRoomName).emit('message', {
            userName: 'System',
            message: `Now we have ${users} players.
            Welcome new player ${socket.userName}.`
        })
    })

    socket.on('chat', data => {
        console.log('socket chat', data)
        socket.to(curRoomName).emit('message', data)
        socket.emit('message', data)
    })

    socket.on('createGame', data => gameController.createGame(socket, db, data))

    socket.on('getGames', () => gameController.getGames(socket, db))

    socket.on('disconnect', () => {
        users--
        console.log('socket disconnect')
    })
}
