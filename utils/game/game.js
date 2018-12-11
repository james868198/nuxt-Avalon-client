import rules from '../../Avalon.json'
import uuidv1 from 'uuid/v1'

export default class game {
    constructor(roomName, playerNumber) {
        console.log(roomName, playerNumber)
        this.name = roomName
        this.gameId = uuidv1()
        this.playerNumber = playerNumber
        this.status = 'pending'
        this.players = []
        this.turnNow = 0
        this.fails = 0
        this.createdTime = Date.now()
        this.startTime = null
        this.mostRecentModifiedTime = this.createdTime
    }
    getName() {
        return this.name
    }
    getGameId() {
        return this.gameId
    }
    getStatus() {
        return this.status
    }
    getPlayers() {
        return this.players
    }
    getTurn() {
        return this.turnNow
    }
    getFails() {
        return this.fails
    }

    addPlayer(player) {
        if (this.status == 'pending') {
            return
        }
        this.players.push(player)
        if (length(this.players) == this.playerNumber) {
            this.start()
        }
    }

    initial() {
        charactors = rules.setting[this.playerNumber]
        let i = 0
        this.players.forEach(player => {
            player.charactor = charactors[i]
            i++
        })
        console.log()
    }
    start() {
        this.initial()
        this.startTime = Date.now()
        this.status = 'night'
        // this.status = 'start'
    }
    over() {
        this.status = 'over'
    }
}
