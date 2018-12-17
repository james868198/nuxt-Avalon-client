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
        this.missionResult = null
        this.nowPlayerAmount = 0
        this.players = []
        // round status
        this.rounds = []
        this.roundReady = false
        this.round = {
            stage: 'questing', // questing, voting, action
            id: 0,
            leader: null,
            agreeCount: 0,
            voteHistory: [],
            NumOnMission: 0
        }
        // mission
        this.missionFails = 0
        this.missions = []
        // time
        this.timer = null // sent from gameController
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
            name: this.name,
            players: this.players,
            configuration: this.configuration,
            // round
            round: {
                stage: this.round.stage,
                id: this.round.id,
                leader: this.round.leader
            },
            history: this.rounds
        }
    }
    get full() {
        return this.numOfPlayers == this.nowPlayerAmount
    }
    getPlayerInfoById(id) {
        return this.playersInfo[id]
    }
    addPlayer(data) {
        console.log('addPlayer', data)
        if (this.status !== 'pending') {
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
                if (playerInfo.charactor !== 'Oberon') {
                    playerInfo.saw = view.Traitor
                }
            }
        })
    }
    // system actions
    resetRound() {
        this.round.stage = 'questing'
        if (this.round.leader) {
            this.round.leader = (this.round.leader + 1) % this.numOfPlayers
        } else {
            this.round.leader = Math.round(
                Math.random() * (this.numOfPlayers - 1)
            )
        }
        this.round.agreeCount = this.numOfPlayers
        for (let i = 0; i < this.numOfPlayers; i++) {
            this.round.voteHistory.push('Y')
        }
        this.roundReady = false
        console.log('resetRound round leader', this.round.leader)
    }
    questCheck() {
        const round = this.round
        if (round.stage !== 'questing') {
            return false
        }
        // check onMisson number correct
        if (
            round.NumOnMission ===
            this.configuration.missionNumberEachTrun[round.id]
        ) {
            // correct, go to next stage
            this.round.stage = 'voting'
            return true
        } else {
            return false
        }
    }
    voteCheck() {
        const round = this.round
        if (round.stage !== 'voting') {
            return false
        }
        // check vote result
        if (2 * this.round.voteCount.agree > this.numOfPlayers) {
            // agree, go to next stage
            this.round.stage = 'action'
            return true
        } else {
            // disagree, go to next stage
            this.rounds.push(this.round)
            this.resetRound()
            return false
        }
    }
    actionCheck() {
        const round = this.round
        if (round.stage !== 'action') {
            return false
        }
        // check vote result
        this.rounds.push(this.round)
        this.resetRound()
        return true
    }
    start() {
        this.initial()
        this.resetRound()
        this.startTime = Date.now()
        this.status = 'start'
    }
    over() {
        this.status = 'over'
    }
    // player actions
    vote(id, voteResult) {
        if (this.round.stage !== 'voting') {
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
        this.round.NumOnMission++
        this.players[id].onMission = true
    }
    unQuest(id) {
        if (this.round.NumOnMission <= 0) {
            return false
        }
        this.round.NumOnMission--
        this.players[id].onMission = false
    }
    action(decision) {
        if (decision == 'f' && this.missionFails <= this.numOfPlayers) {
            this.missionFails++
        }
    }
}
