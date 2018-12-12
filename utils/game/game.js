import rules from '../../Avalon.json'
import uuidv1 from 'uuid/v1'

export default class game {
    constructor(roomName, numOfPlayers) {
        console.log(roomName, numOfPlayers)
        this.name = roomName
        this.id = uuidv1()
        this.numOfPlayers = numOfPlayers
        this.status = 'pending'
        this.players = []
        this.round = 0
        this.fails = 0
        this.createdTime = Date.now()
        this.startTime = null
        this.mostRecentModifiedTime = this.createdTime
        // private
        this.charactors = []
    }
    get publicData() {
        return {
            name: this.name,
            id: this.id,
            numOfPlayers: this.numOfPlayers,
            status: this.status,
            round: this.round,
            name: this.name,
            players: this.players
        }
    }

    addPlayer(player) {
        console.log('addPlayer', player)
        if (this.status != 'pending') {
            return
        }
        console.log('addPlayer after 1 if')
        this.players.push(player)
        // if (length(this.players) == this.numOfPlayers) {
        //     this.start()
        // }
        console.log('push', this.players)
    }

    initial() {
        charactors = rules.setting[this.numOfPlayers]
        let i = 0
        this.players.forEach(player => {
            player.charactor = charactors[i]
            i++
        })
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
