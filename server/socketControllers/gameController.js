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
        try {
            const game = db.getGameById(data.gameId)
            // check game existed
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
            // check game full
            if (game.full) {
                const respData = {
                    status: 'fail',
                    error: {
                        code: 10000,
                        description: 'game full'
                    }
                }
                socket.emit('response', respData)
                return
            }
            socket.userName = data.userName
            socket.room = data.gameId
            socket.join(data.gameId)
            const playerData = {
                name: data.userName,
                id: game.nowPlayerAmount,
                status: 'on'
            }
            socket.player = game.addPlayer(playerData)
            socket.to(socket.room).emit('message', {
                userName: 'system',
                message: `Welcome ${socket.userName}.`
            })
            // check game full again
            if (game.full) {
                game.start()
            }

            const respData = {
                status: 'success',
                data: {
                    game: game.publicData
                }
            }
            socket.to(socket.room).emit('response', respData)
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
            if (game.status == 'pending') {
                const publicData = game.removePlayer(socket.player)
                const respData = {
                    status: 'success',
                    data: {
                        game: publicData
                    }
                }
                socket.to(socket.room).emit('response', respData)
            } else {
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
        try {
            const game = db.getGameById(id)
            const respData = {
                status: 'success',
                data: {
                    game: game.publicData
                }
            }
            socket.emit('response', respData)
            socket.to(socket.room).emit('response', respData)
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
    getPlayerInfo: (socket, db) => {
        console.log('controller get playerInfo')
        if (!socket.player) {
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
            const game = db.getGameById(socket.room)
            const playerInfo = game.getPlayerInfoById(socket.player.id)
            const respData = {
                status: 'success',
                data: {
                    player: playerInfo
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
    // in game
    quest: (socket, db, data) => {
        try {
            const game = db.getGameById(socket.room)
            if (game.roundParams.leader != socket.player.id) {
                return
            }
            game.quest(data.questId)
            const respData = {
                status: 'success',
                data: game.publicData
            }
            socket.emit('response', respData)
            socket.to(socket.room).emit('response', respData)
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
    vote: (socket, db, data) => {
        try {
            const game = db.getGameById(socket.room)
            game.vote(socket.player.id, data.vote)
            const respData = {
                status: 'success',
                data: game.publicData
            }
            socket.emit('response', respData)
            socket.to(socket.room).emit('response', respData)
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
    action: (socket, db, data) => {
        try {
            const game = db.getGameById(socket.room)
            let onMission = false
            game.roundParams.playersOnMission.forEach(id => {
                if (id === socket.player.id) {
                    onMission = true
                }
            })
            if (!onMission) {
                return
            }
            game.action(data.action)
            const respData = {
                status: 'success',
                data: game.publicData
            }
            socket.emit('response', respData)
            socket.to(socket.room).emit('response', respData)
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
