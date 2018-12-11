export default socket => {
    socket.on('chat', data => {
        console.log('socket chat', data)
        socket.to(curRoomName).emit('message', data)
        socket.emit('message', data)
    })

    socket.on('disconnect', () => {
        users--
        console.log('socket disconnect')
    })
}
