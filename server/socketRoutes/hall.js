let users = 0
const curRoomName = 'hall'

export default (socket, db) => {
    socket.userName = ''
    socket.join(curRoomName)
    console.log('socket start, id:%s', socket.id)

    socket.emit('message', {
        userName: 'system',
        message: `Welcome to join us.`
    })
    socket.on('setUserName', data => {
        socket.userName = data.userName
        console.log('socket get user name')
        socket.emit('socketId', {
            id: socket.id
        })
        users++
        socket.to(curRoomName).emit('message', {
            userName: 'system',
            message: `Now we have ${users} players.
            Welcome new player ${socket.userName}.`
        })
    })

    socket.on('chat', data => {
        console.log('socket chat', data)
        socket.to(curRoomName).emit('message', data)
        socket.emit('message', data)
    })

    socket.on('createGame', data => {
        // const gameId = db.createGame(data.roomName, data.playersNumber)
        const gameId = db.createGame('test', 10)
        console.log(db)
        // console.log('create room, id:', gameId)
        // socket.emit('redirectToGame', gameId)
    })

    socket.on('disconnect', () => {
        users--
        console.log('socket disconnect')
    })
}
