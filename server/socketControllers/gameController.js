// 資料驗證
// 邏輯處理
// 資料回傳
import avalonRule from '../../Avalon'
const QUESI_SEC = avalonRule.turnInterval
const VOTE_SEC = avalonRule.decisionInterval
const ACTION_SEC = avalonRule.decisionInterval
const ASSAINATION_SEC = avalonRule.assassinationInterval

const controller = {
    createGame: (socket, db, data) => {
        console.log('[gameController] create game', data)
        try {
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
        console.log('[gameController] join game', data)
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
            game.addPlayer(playerData)
            socket.player = playerData
            socket.to(socket.room).emit('message', {
                userName: 'system',
                message: `Welcome ${socket.userName}.`
            })

            const respData = {
                status: 'success',
                data: {
                    game: game.publicData
                }
            }
            socket.to(socket.room).emit('response', respData)
            socket.emit('response', respData)
            // check game full again
            if (game.full) {
                // console.log(this)
                controller.startGame(socket, db)
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
    startGame: (socket, db) => {
        console.log('[gameController] start game')
        const game = db.getGameById(socket.room)
        game.start()
        // set paramters
        let result = null
        let time = 0

        const roundTimer = setInterval(() => {
            const respData = {
                status: 'success',
                data: {
                    time: time,
                    game: game.publicData
                }
            }
            socket.emit('response', respData)
            socket.to(socket.room).emit('response', respData)
            result = game.missionResult
            const roundStage = game.round.stage
            if (roundStage === 'questing') {
                if (time >= QUESI_SEC) {
                    time = 0
                }
            } else if (roundStage === 'voting') {
                if (time >= VOTE_SEC) {
                    time = 0
                }
            } else if (roundStage === 'action') {
                if (time >= ACTION_SEC) {
                    time = 0
                }
            } else {
                this.round.time = 0
                this.resetRound()
                clearInterval(roundTimer)
            }
            time++
        }, 1000)
    },
    leaveGame: (socket, db) => {
        console.log('[gameController] leaveGame')
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
        console.log('[gameController] getGames')
        const games = db.getGames
        socket.emit('games', games)
    },
    getGameById: (socket, db, id) => {
        console.log('[gameController] getGameById')
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
        console.log('[gameController] getPlayerInfo', socket.player)
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
            socket.player.identity = playerInfo
            const respData = {
                status: 'success',
                data: {
                    player: socket.player
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
            if (game.round.leader !== socket.player.id) {
                return
            }
            const questId = parseInt(data.playerId)
            game.quest(socket.player.id, questId)
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
    unQuest: (socket, db, data) => {
        try {
            const game = db.getGameById(socket.room)
            if (game.round.leader !== socket.player.id) {
                return
            }
            game.unQuest(data.playerId)
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
            const result = game.action(socket.player.id, data.action)
            const respData = {
                status: 'success',
                data: game.publicData
            }
            if (!result) {
                respData.status = 'fail'
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
