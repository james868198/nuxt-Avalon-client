import uuidv1 from 'uuid/v1'
import avalonRule from '../../Avalon'
import mathUtil from '../mathUtil'

export default class game {
    constructor(roomName, numOfPlayers) {
        console.log(roomName, numOfPlayers)
        // basic
        this.name = roomName
        this.id = uuidv1()
        // condiguration
        this.configuration = avalonRule.configuration[this.numOfPlayers]
        this.numOfPlayers = numOfPlayers
        // status
        this.status = 'pending'
        this.nowPlayerAmount = 0
        this.players = []
        // round status
        this.rounds = []
        this.round = {
            status: '', // assignment, voting,
            id: 0,
            leader: null,
            agreeCount: 0,
            voteHistory: [],
            NumOnMission: 0,
            playersOnMission: []
        }
        // mission
        this.missionFails = 0
        this.missions = []
        // time
        this.createdTime = Date.now()
        this.startTime = null
        this.turnInterval = avalonRule.turnInterval
        this.assassinationInterval = avalonRule.assassinationInterval
        this.mostRecentModifiedTime = this.createdTime
        // private
        this.playersInfo = []
        this.roundInfo = null
    }
    get publicData() {
        return {
            name: this.name,
            id: this.id,
            numOfPlayers: this.numOfPlayers,
            nowPlayerAmount: this.nowPlayerAmount,
            status: this.status,
            round: this.round,
            name: this.name,
            players: this.players,
            configuration: this.configuration
        }
    }
    get full() {
        return this.numOfPlayers == this.nowPlayerAmount
    }
    getPlayerInfoById(id) {
        return this.playersInfo[id]
    }
    addPlayer(data) {
        console.log('addPlayer', player)
        if (this.status != 'pending') {
            return
        }
        const player = {
            name: data.name,
            id: data.id,
            status: data.status,
            onMission: false,
            voted: false
        }
        this.players.push(player)
        this.nowPlayerAmount++
        return
    }
    removePlayer(player) {
        console.log('removePlayer', player)
        this.players = this.players.filter(item => item.id !== player.id) // es6 array remove寫法
        this.nowPlayerAmount--
        return this.publicData
    }

    initial() {
        if (!this.configuration) {
            return
        }
        const charactors = mathUtil.shuffle(this.configuration.charactors)
        const view = {
            Merlin: [],
            Traitor: [],
            Percival: []
        }
        // assign charactors
        let i = 0
        this.players.forEach(player => {
            // const charactor = avalonRule.charactors[charactors[i]]
            if (charactors[i] == 'Merlin') {
                view.Percival.push(i)
            } else if (charactors[i] == 'Morgana') {
                view.Merlin.push(i)
                view.Traitor.push(i)
                view.Percival.push(i)
            } else if (charactors[i] == 'Mordred') {
                view.Traitor.push(i)
            } else if (charactors[i] == 'Oberon') {
                view.Merlin.push(i)
            } else if (charactors[i] == 'Assassin') {
                view.Merlin.push(i)
                view.Traitor.push(i)
            } else if (charactors[i] == 'Traitor') {
                view.Merlin.push(i)
                view.Traitor.push(i)
            }
            const playerInfo = {
                charactor: charactors[i],
                camp: avalonRule.charactors[charactors[i]].camp
            }
            this.playersInfo.push(playerInfo)
            i++
        })
        // saw others' identity
        this.playersInfo.forEach(playerInfo => {
            if (playerInfo.charactor == 'Merlin') {
                playerInfo.saw = view.Merlin
            } else if (playerInfo.charactor == 'Percival') {
                playerInfo.saw = view.Percival
            } else if (playerInfo.charactor !== 'Loyalty') {
                if (playerInfo.charactor != 'Oberon') {
                    playerInfo.saw = view.Traitor
                }
            }
        })
        return
    }
    vote(id, voteResult) {
        if (this.round.status != 'voting') {
            return
        }
        if (voteResult == 'N') {
            this.round.voteHistory[id] = 'N'
            this.round.voteCount.agree--
        }
    }
    quest(id) {
        if (
            this.round.NumOnMission >=
            this.configuration.missionNumberEachTrun[this.round.id]
        ) {
            return false
        }
        this.players[id].onMission = true
    }
    unQuest(id) {
        if (this.round.NumOnMission <= 0) {
            return false
        }
        this.players[id].onMission = false
    }
    action(decision) {
        if (decision == 'f' && this.missionFails <= this.numOfPlayers) {
            this.missionFails++
        }
    }
    resetRound() {
        this.round.status = 'questing'
        if (this.round.leader) {
            this.round.leader = (this.round.leader + 1) % this.numOfPlayers
        } else {
            this.round.leader = Math.round(
                Math.random() * (this.numOfPlayers - 1)
            )
            console.log('test???', this.round.leader)
        }
        this.round.agreeCount = this.numOfPlayers
        this.round.playersOnMission = []
        for (let i = 0; i < this.numOfPlayers; i++) {
            this.round.voteHistory.push('Y')
        }
    }
    // roundEnd() {

    // }
    // voteEnd() {

    // }
    // actionEnd() {

    // }
    start() {
        this.initial()
        this.resetRound()
        this.startTime = Date.now()
        this.status = 'start'
        return
    }
    over() {
        this.status = 'over'
        return
    }
}
