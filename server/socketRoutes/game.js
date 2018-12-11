export default (socket, db) => {
    socket.userName = ''
    socket.player = ''
    console.log('socket start, id:%s', socket.id)

    socket.emit('message', {
        userName: 'system',
        message: `Welcome to join us.`
    })

    // on
    socket.on('initial', data => {
        socket.userName = data.userName
        socket.room = data.gameId
        socket.join(data.gameId)
        const game = db.getGameById(data.gameId)
        socket.player = {
            name: data.userName
        }
        game.addPlayer(socket.player)

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

    socket.on('leaveGame', () => {
        console.log('leaveGame')
    })

    socket.on('disconnect', () => {
        users--
        console.log('socket disconnect')
    })

    socket.on('gameStart', () => {
        console.log('create room')
    })
}
