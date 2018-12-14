// 資料驗證
// 邏輯處理
// 資料回傳

const controller = {
    createGame: (socket, db, data) => {
        try {
            console.log('controller create game')
            const gameId = db.createGame(data.roomName, data.numOfPlayers)
            if (!gameId) {
                const respData = {
                    status: 'fail',
                    error: {
                        code: 10001,
                        description: 'create game fail'
                    }
                }
                socket.emit('response', respData)
                return
            }
            const respData = {
                status: 'success',
                data: {
                    gameId: gameId
                }
            }
            socket.emit('response', respData)
        } catch (error) {
            console.log('error:', error)
            const respData = {
                status: 'fail',
                error: {
                    code: 11111,
                    description: `unexpected error:${error}`
                }
            }
            socket.emit('response', respData)
        }
    },
    joinGame: (socket, db, data) => {
        console.log('controller join game')
        socket.userName = data.userName
        socket.room = data.gameId
        socket.join(data.gameId)
        try {
            const game = db.getGameById(data.gameId)
            if (!game) {
                const respData = {
                    status: 'fail',
                    error: {
                        code: 10000,
                        description: 'found no game'
                    }
                }
                socket.emit('response', respData)
                return
            }
            socket.player = {
                name: data.userName,
                id: socket.id,
                status: 'on'
            }
            game.addPlayer(socket.player)
            socket.to(socket.room).emit('message', {
                userName: 'system',
                message: `Welcome ${socket.userName}.`
            })
            socket.to(socket.room).emit('gameUpdate', game.publicData)
            socket.emit('gameUpdate', game.publicData)
        } catch (error) {
            console.log('error:', error)
            const respData = {
                status: 'fail',
                error: {
                    code: 11111,
                    description: `unexpected error:${error}`
                }
            }
            socket.emit('response', respData)
        }
    },
    startGame: (socket, db, data) => {
        // const gameId = db.createGame(data.roomName, data.numOfPlayers)
        // socket.emit('gameId', gameId)
    },
    leaveGame: (socket, db) => {
        console.log('controller leave game')
        if (!socket.room) {
            return
        }

        try {
            const game = db.getGameById(socket.room)
            if (!game) {
                const respData = {
                    status: 'fail',
                    error: {
                        code: 10000,
                        description: 'found no game'
                    }
                }
                socket.emit('response', respData)
                return
            }
            console.log(' ??????')
            if (game.status == 'pending') {
                const data = game.removePlayer(socket.player)
                console.log('pending leave', data)
                socket.to(socket.room).emit('gameUpdate', data)
            } else {
                console.log('not pending leave')
                socket.player.status = 'off'
            }
        } catch (error) {
            console.log('error:', error)
            const respData = {
                status: 'fail',
                error: {
                    code: 11111,
                    description: `unexpected error:${error}`
                }
            }
            socket.emit('response', respData)
        }
    },
    getGames: (socket, db) => {
        console.log('controller get games')
        const games = db.getGames
        socket.emit('games', games)
    },
    getGameById: (socket, db, id) => {
        console.log('controller get game by id')
        if (!socket || !db || !id) {
            const respData = {
                status: 'fail',
                error: {
                    code: 11110,
                    description: `input not qualified`
                }
            }
            socket.emit('response', respData)
            return
        }
        try {
            const game = db.getGameById(id)
            socket.to(socket.room).emit('gameUpdate', game.publicData)
            socket.emit('gameUpdate', game.publicData)
        } catch (error) {
            console.log('error:', error)
            const respData = {
                status: 'fail',
                error: {
                    code: 11111,
                    description: `unexpected error:${error}`
                }
            }
            socket.emit('response', respData)
        }
    }
}

export default controller
