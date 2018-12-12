// 資料驗證
// 邏輯處理
// 資料回傳

const controller = {
    createGame: (socket, db, data) => {
        try {
            console.log('controller create game', data)
            const gameId = db.createGame(data.roomName, data.numOfPlayers)
            if (!gameId) {
                socket.emit('error', {
                    code: 10001,
                    message: 'create game fail'
                })
            }
            const respData = {
                inst: 'redirect',
                gameId: gameId
            }
            socket.emit('respone', respData)
        } catch (error) {
            console.log('error ??', error)
            socket.emit('error', {
                code: 11111,
                message: `unexpected error:${error}`
            })
        }
    },
    joinGame: (socket, db, data) => {
        console.log('controller join game', data)
        socket.userName = data.userName
        socket.room = data.gameId
        socket.join(data.gameId)
        try {
            const game = db.getGameById(data.gameId)
            console.log('controller get game', game)
            if (!game) {
                socket.emit('error', {
                    code: 10000,
                    message: 'found no game'
                })
                return
            }
            socket.player = {
                name: data.userName
            }
            game.addPlayer(socket.player)
            console.log('controller addPlayer')
            socket.to(socket.room).emit('message', {
                userName: 'system',
                message: `Welcome ${socket.userName}.`
            })
            console.log('fail')
            socket.to(socket.room).emit('gameUpdate', game.publicData)
        } catch (error) {
            socket.emit('error', {
                code: 11111,
                message: `unexpected error:${error}`
            })
        }
    },
    startGame: (socket, db, data) => {
        // const gameId = db.createGame(data.roomName, data.numOfPlayers)
        // socket.emit('gameId', gameId)
    },
    leaveGame: (socket, db, data) => {
        // const gameId = db.createGame(data.roomName, data.numOfPlayers)
        // socket.emit('gameId', gameId)
    },
    geteGames: (socket, db) => {
        const games = db.getGames
        socket.emit('games', games)
    },
    getGameById: (socket, db, id) => {
        if (!socket || !db || !id) {
            socket.emit('error', {
                code: 10000,
                message: 'miss required data'
            })
        }
        try {
            const game = db.getGameById(id)
            socket.to(socket.room).emit('gameUpdate', game.publicData)
        } catch (error) {
            socket.emit('error', {
                code: 11111,
                message: `unexpected error:${error}`
            })
        }
    }
}

export default controller
