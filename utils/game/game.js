import uuidv1 from 'uuid/v1'
import avalonRule from '../../Avalon'
import mathUtil from '../mathUtil'

export default class game {
    constructor(roomName, numOfPlayers) {
        console.log(roomName, numOfPlayers)
        this.name = roomName
        this.id = uuidv1()
        this.numOfPlayers = numOfPlayers
        this.status = 'pending'
        this.players = []
        this.nowPlayerAmount = 0
        this.round = 0
        this.fails = 0
        this.createdTime = Date.now()
        this.startTime = null
        this.mostRecentModifiedTime = this.createdTime
        this.setting = avalonRule.setting[this.numOfPlayers]
        // private
        this.playersInfo = []
        this.missionNumberEachTrun = []
        this.badTolerance = []
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
            players: this.players
        }
    }
    get full() {
        return this.numOfPlayers == this.nowPlayerAmount
    }
    getPlayerInfoById(id) {
        return this.playersInfo[id]
    }
    addPlayer(player) {
        console.log('addPlayer', player)
        if (this.status != 'pending') {
            return
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
        const gameSetting = avalonRule.setting[this.numOfPlayers]
        const charactors = mathUtil.shuffle(gameSetting.charactors)
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
        // sfs
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
    start() {
        this.initial()
        this.startTime = Date.now()
        this.status = 'start'
        this.round = 1
        return
    }
    over() {
        this.status = 'over'
        return
    }
}
