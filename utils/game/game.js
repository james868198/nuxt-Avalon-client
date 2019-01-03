import uuidv1 from 'uuid/v1'
import avalonRule from '../../Avalon'
import mathUtil from '../mathUtil'

export default class game {
    constructor(roomName, numOfPlayers) {
        console.log('[game]new game', roomName, numOfPlayers)
        // basic
        this.name = roomName
        this.id = uuidv1()
        // condiguration
        this.numOfPlayers = numOfPlayers
        this.configuration = avalonRule.configuration[this.numOfPlayers]
        // status
        this.status = 'pending' // start, assasination, over
        this.missionResult = null
        this.nowPlayerAmount = 0
        this.players = []
        this.winerCamp = null
        // round status
        this.rounds = []
        this.round = null
        this.roundNow = null
        // mission
        this.missionFailTimes = 0
        this.missionSuccessessTimes = 0
        this.mission = null
        this.missionNow = null
        this.missions = []
        // time
        this.timer = null // sent from gameController
        this.createdTime = Date.now()
        this.startTime = null
        // this.mostRecentModifiedTime = this.createdTime
        // private
        this.playersInfo = []
    }
    get publicData() {
        return {
            name: this.name,
            id: this.id,
            numOfPlayers: this.numOfPlayers,
            nowPlayerAmount: this.nowPlayerAmount,
            winerCamp: this.winerCamp,
            status: this.status,
            name: this.name,
            players: this.players,
            configuration: this.configuration,
            // round
            round: this.roundNow,
            mission: this.missionNow,
            rounds: this.rounds,
            missions: this.missions
        }
    }
    get full() {
        return this.numOfPlayers == this.nowPlayerAmount
    }
    getPlayerInfoById(id) {
        console.log('[game]getPlayerInfoById', id)
        return this.playersInfo[id]
    }
    addPlayer(data) {
        console.log('[game]addPlayer', data)
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
        return player
    }
    removePlayer(player) {
        console.log('[game]removePlayer', player)
        this.players = this.players.filter(item => item.id !== player.id) // es6 array remove寫法
        this.nowPlayerAmount--
        return this.publicData
    }

    initial() {
        console.log('[game] initial')

        // if (!this.configuration) {
        //     return false
        // }
        const charactors = mathUtil.shuffle(this.configuration.charactors)
        const view = {
            Merlin: [],
            Traitor: [],
            Percival: []
        }
        // assign charactors
        let i = 0
        this.players.forEach(player => {
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
    resetAll() {
        this.resetMission()
        this.resetRound()
        this.resetPlayers()
    }
    resetPlayers() {
        this.players.forEach(player => {
            player.onMission = false
            player.voted = false
        })
    }
    resetMission() {
        console.log('[game]resetMission')
        if (this.mission) {
            let id = this.mission.id
            if (this.mission.status !== 'pending') {
                id++
            }
            this.mission = {
                id: id,
                NumOnMission: this.configuration.missionNumberEachTrun[id],
                badTolerance: this.configuration.badTolerance[id],
                onMission: [],
                finishedMission: {},
                actionCount: 0,
                status: 'pending',
                success: 0,
                fail: 0
            }
        } else {
            this.mission = {
                id: 0,
                NumOnMission: this.configuration.missionNumberEachTrun[0],
                badTolerance: this.configuration.badTolerance[0],
                onMission: [],
                finishedMission: {},
                actionCount: 0,
                status: 'pending',
                success: 0,
                fail: 0
            }
        }
        this.missionNow = {
            id: this.mission.id,
            NumOnMission: this.mission.NumOnMission,
            badTolerance: this.mission.badTolerance,
            onMission: this.mission.onMission
        }
    }
    resetRound() {
        console.log('[game]resetRound')
        const votes = []
        for (let i = 0; i < this.numOfPlayers; i++) {
            votes.push('Y')
        }
        if (this.round) {
            let id = this.round.id + 1
            const leader = (this.round.leader + 1) % this.numOfPlayers
            if (this.round.id > 4) {
                id = 0
            }
            const missionId = this.mission.id || 0
            this.round = {
                stage: 'questing', // questing, voting, action
                id: id,
                missionId: missionId,
                leader: leader,
                agreeCount: this.numOfPlayers,
                votedCount: 0,
                voteHistory: votes,
                actionResult: 'no action'
            }
        } else {
            this.round = {
                stage: 'questing', // questing, voting, action
                id: 0,
                missionId: 0,
                leader: Math.round(Math.random() * (this.numOfPlayers - 1)),
                agreeCount: this.numOfPlayers,
                votedCount: 0,
                voteHistory: votes,
                actionResult: 'no action'
            }
        }
        this.roundNow = {
            stage: this.round.stage,
            id: this.round.id,
            missionId: this.round.missionId,
            leader: this.round.leader
        }
    }
    pushMission() {
        this.missions.push(this.mission)
    }
    pushRound() {
        const round = {
            id: this.round.id,
            missionId: this.round.missionId,
            leader: this.round.leader,
            voteHistory: this.round.leader,
            actionResult: this.round.actionResult
        }
        this.rounds.push(round)
    }
    roundCheck() {
        console.log('[game] roundCheck')
        if (this.status !== 'start') {
            return
        }
        const round = this.round
        const mission = this.mission
        if (round.stage === 'questing') {
            if (mission.onMission.length === mission.NumOnMission) {
                // questing to voting
                round.stage = 'voting'
                this.roundNow.stage = 'voting'
            }
        } else if (round.stage === 'voting') {
            if (round.votedCount == this.numOfPlayers) {
                // voting to next stage
                if (2 * round.agreeCount > this.numOfPlayers) {
                    // agree, go to next stage
                    console.log('[game][agreeCount]', round.agreeCount)
                    round.stage = 'action'
                    round.actionResult = 'action'
                    this.roundNow.stage = 'action'
                } else if (round.id == 5) {
                    // disagree over 5, go to next stage
                    round.stage = 'action'
                } else {
                    // disagree, go to next stage
                    this.pushRound()
                    this.resetAll()
                }
            }
        } else if (round.stage === 'action') {
            if (mission.actionCount === mission.NumOnMission) {
                // All action complete
                if (mission.fail > mission.badTolerance || round.id == 5) {
                    // fail
                    mission.status = 'fail'
                    this.missionFailTimes++
                } else {
                    // success
                    mission.status = 'success'
                    this.missionSuccessessTimes++
                }

                this.pushRound()
                this.pushMission()
                this.resetAll()
                // check game over
                if (this.missionSuccessessTimes == 3) {
                    this.status = 'assassinating'
                } else if (this.missionFailTimes == 3) {
                    this.winerCamp = 'R'
                    this.status = 'over'
                }
            }
        } else {
            this.resetRound()
        }
    }
    // game status
    start() {
        console.log('[game]start')
        this.initial()
        this.resetMission()
        this.resetRound()
        this.startTime = Date.now()
        this.status = 'start'
    }
    over() {
        console.log('[game]over')
    }

    // player actions
    quest(leaderId, id) {
        console.log('[game]quest', id)
        if (this.round.stage !== 'questing') {
            return false
        }
        if (leaderId !== this.round.leader) {
            return false
        }
        if (this.mission.onMission.length >= this.mission.NumOnMission) {
            return false
        }
        this.players[id].onMission = true
        this.mission.onMission.push(id)
        this.roundCheck()
        return true
    }
    // unQuest(id) {
    //     if (this.round.NumOnMission <= 0) {
    //         return false
    //     }
    //     this.round.NumOnMission--
    //     this.players[id].onMission = false
    // }
    vote(id, voteResult) {
        console.log('[game]vote', id, voteResult)
        if (this.round.stage !== 'voting') {
            return false
        }
        if (this.players[id].voted) {
            return false
        }
        this.players[id].voted = true
        this.round.votedCount++
        if (voteResult === 'N' || voteResult === 'n') {
            this.round.voteHistory[id] = 'N'
            this.round.agreeCount--
        }
        console.log('[game]vote agree', this.round.agreeCount)
        this.roundCheck()
        return true
    }
    action(id, decision) {
        console.log('[game]action', id, decision)
        if (this.round.stage !== 'action') {
            return false
        }
        let onMissionCheck = false
        this.mission.onMission.forEach(onMissionId => {
            if (onMissionId === id) {
                onMissionCheck = true
            }
        })
        if (this.mission.finishedMission[id]) {
            return false
        } else {
            this.mission.finishedMission[id] = 'finished'
        }
        if (!onMissionCheck) {
            return false
        }
        if (decision == 'f') {
            this.mission.fail++
        } else if (decision == 's') {
            this.mission.success++
        } else {
            return false
        }
        this.mission.actionCount++
        this.roundCheck()
        return true
    }
    assassinate(id, target) {
        console.log('[game]assassinate', id, target, this.status)
        if (this.status !== 'assassinating') {
            return false
        }
        if (this.playersInfo[id].charactor !== 'Assassin') {
            return false
        }
        if (this.playersInfo[target].charactor === 'Merlin') {
            this.winerCamp = 'R'
        } else {
            this.winerCamp = 'B'
        }
        this.status = 'over'
        return true
    }
    // timeout
    // froceQuest() {
    //     this.round.NumOnMission = this.configuration.missionNumberEachTrun[
    //         this.round.id
    //     ]
    // }
    // froceVote() {

    // }
    // froceAction() {

    // }
}
