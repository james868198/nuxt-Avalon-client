<template lang="pug">
    .game
        .game-container
            .container-left(v-if="game")
                .container-left-inner
                    .container-left-inner-left
                        .player-list(v-if="game.players")
                            .player-item(v-for="player in game.players.slice(0,game.room.numOfPlayers/2)")
                                PlayerItem(:id="player.id", :name="player.name", :status="player.status", :voted="player.voted", :onMission="player.onMission")
                    .container-left-inner-mid
                        .game-board
                            .game-board-header
                                .player-info(v-if="playerInfo")
                                    br
                                    | You are player {{player.id+1}}
                                    br
                                    | You are {{playerInfo.charactor}}
                                    br
                                    | You belong to {{playerInfo.camp}}
                                    br
                                    | you know {{playerInfo.saw}}
                            .game-board-container
                                .time(v-if="time")
                                    | {{time.min}}:{{time.sec}}
                                .info(v-if="game.roundInfo")
                                    | This is mission {{game.missions.length}} round  {{game.roundInfo.roundId+1}}
                                    br
                                    | Stage: {{game.data.stage}}
                                    br
                                    | Player {{game.roundInfo.leader+1}} is the leader
                                    br
                                    br
                                    .mission(v-if="game.missions.length>0")
                                        | We need {{game.missions[game.missions.length-1].NumOnMission}} people for mission
                                .history(v-if="game.missions")
                                    | {{game.missions}}
                                    //- el-select(v-model="historyRoundId" placeholder="Select")
                                    //-     el-option(v-for="mission in game.missions"  :key="mission.id"  :label="mission.id"  :value="mission.id")
                            .game-board-footer(v-if="game.room")
                                | game status: {{game.room.status}}
                                br
                                | {{game.room.numOfPlayers}} players room
                                hr
                                | room id: {{game.room.id}}

                    .container-left-inner-right
                        .player-list(v-if="game.players")
                            .player-item(v-for="player in game.players.slice(game.room.numOfPlayers/2,game.room.numOfPlayers)")
                                PlayerItem(:id="player.id", :name="player.name", :status="player.status", :voted="player.voted", :onMission="player.onMission")
            .container-right
                .container-right-inner
                    Chatroom(:chatting="chatting"  :name="playerName"  @message="classifyMessage")
                //- | id: {{player.id}}



</template>

<script>
import Chatroom from '@/components/chatroom'
// import Board from '@/components/board'

import SocketEmits from '@/utils/bridges/socket/emits'
import socketClient from '@/plugins/socket.io'
import Player from '@/components/player'

export default {
    name: 'Game',
    components: {
        Chatroom,
        PlayerItem: Player
    },
    data() {
        return {
            // base
            chatting: [],
            socketId: null,
            socket: null,
            // game
            game: {
                roomData: null,
                gameData: null,
                missions: null,
                voteHistory: null,
                roundInfo: null,
                players: null
            },
            userId: null,
            playerName: null,
            player: {
                name: null,
                id: null
            },
            playerInfo: null,
            historyRoundId: null,
            time: {
                min: 0,
                sec: 0
            },
            // commands
            cmdConfig: {
                quest: this.quest, // quest [id]
                unquest: this.unquest, // uq [id]
                vote: this.vote, // vote [y or n]
                action: this.action, // action [s or f]
                assassinate: this.assassinate // assassinate [s or f]
            }
        }
    },
    watch: {
        socket(newVal, oldVal) {
            if (!newVal) {
                return
            }
            this.socket.on('socketId', data => {
                console.log('get connect')
                if (data) {
                    console.log('get id', data.id)
                    this.socketId = data.id
                }
            })
            this.socket.on('message', data => {
                console.log('get message', data)
                if (data) {
                    this.chatting.push(data)
                }
            })
            this.socket.on('response', res => {
                console.log('socket res:', res)
                if (res.status == 'fail') {
                    console.log('socket fail:', res.error)
                    if (res.error.code == 10002) {
                        this.backToHome()
                    }
                } else {
                    if (res.data) {
                        if (res.data.game) {
                            this.game = res.data.game
                        }
                        if (res.data.player) {
                            this.player = res.data.player
                        }
                        if (res.data.playerInfo) {
                            console.log('test playerInfo')
                            this.playerInfo = res.data.playerInfo
                        }
                        if (res.data.time) {
                            this.time.min = Math.floor(res.data.time / 60)
                            this.time.sec = res.data.time % 60
                        }
                    }
                }
            })
        },
        game(newVal, oldVal) {
            if (newVal) {
                console.log('watch game status', newVal.room.status)
                this.game = newVal
                if (newVal.room.status !== 'pending' && !this.playerInfo) {
                    this.getPlayerInfo()
                }
            }
        }
    },
    created() {
        const socketUrl = `${socketClient.url}/game`
        this.socket = socketClient.io(socketUrl, socketClient.options)
    },
    mounted() {
        if (!localStorage.userId) {
            this.backToHome()
        }
        if (localStorage.playerName) {
            this.playerName = localStorage.playerName
        }
        this.userId = localStorage.userId
        this.gameId = this.$route.params.id
        this.joinGame() // get game data
    },
    methods: {
        classifyMessage(message) {
            if (!message || message == '') {
                return
            }

            const words = message.split(' ')
            if (words[0] !== '//') {
                this.sendMessage(message)
            } else {
                this.cmdConfig[words[1]](words.slice(2))
            }
        },
        sendMessage(message) {
            if (!this.socket) {
                return null
            }
            const data = {
                userName: this.playerName,
                message: message
            }
            console.log('send message')
            SocketEmits.chat(this.socket, data)
        },
        setPlayerName() {
            if (!this.socket) {
                return null
            }
            console.log('send message')

            const data = {
                userName: this.playerName
            }
            SocketEmits.setName(this.socket, data)
        },
        joinGame() {
            const data = {
                gameId: this.gameId,
                userId: this.userId,
                userName: this.playerName || 'Anonymous47'
            }
            SocketEmits.joinGame(this.socket, data)
        },
        getGameById(id) {
            SocketEmits.getGameById(this.socket, id)
        },
        getPlayerInfo() {
            SocketEmits.getPlayerInfo(this.socket)
        },
        // actions
        quest(word) {
            console.log('[quest]', word)
            if (!word[0]) {
                console.log('no word')
                return
            }
            const data = {
                playerId: word[0]
            }
            SocketEmits.quest(this.socket, data)
        },
        unquest(word) {
            console.log('[unquest]', word)
            if (!word[0]) {
                console.log('no word')
                return
            }
            const data = {
                playerId: word[0]
            }
            SocketEmits.unQuest(this.socket, data)
        },
        vote(word) {
            console.log('[vote]', word)
            if (!word[0]) {
                console.log('no word')
                return
            }
            if (word[0] !== 'y' && word[0] !== 'n') {
                console.log('command error')
                return
            }
            const data = {
                vote: word[0]
            }
            SocketEmits.vote(this.socket, data)
        },
        action(word) {
            console.log('[action]', word)
            if (!word[0]) {
                console.log('no word')
                return
            }
            if (word[0] !== 's' && word[0] !== 'f') {
                console.log('command error')
                return
            }
            const data = {
                action: word[0]
            }
            SocketEmits.action(this.socket, data)
        },
        assassinate(word) {
            if (!word[0]) {
                console.log('no word')
                return
            }
            const data = {
                target: word[0]
            }
            SocketEmits.assassinate(this.socket, data)
        },
        // others
        backToHome() {
            window.location.href = '/'
        }
    }
}
</script>

<style lang="scss">
.game {
    position: relative;
    height: 100%;
    width: 100%;
    overflow: hidden;
    background-color: white;
    .game-container {
        position: relative;
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: row;
        // overflow: hidden;
        .container-left {
            position: relative;
            display: inline-block;
            height: 100%;
            width: 70%;
            .container-left-inner {
                position: relative;
                height: 100%;
                width: 100%;
                display: flex;
                flex-direction: row;
                background-color: rgb(156, 152, 152);
                // margin: 0 auto;
                // text-align: center;
                .container-left-inner-left {
                    position: relative;
                    height: 100%;
                    width: 30%;
                }
                .container-left-inner-mid {
                    position: relative;
                    height: 100%;
                    width: 40%;
                    .game-board {
                        position: relative;
                        height: 100%;
                        width: 100%;
                        // margin-top: 0.5em;
                        // margin-bottom: 0.5em;
                        background-color: white;
                        display: flex;
                        flex-direction: column;
                        text-align: center;
                        .game-board-header {
                            position: relative;
                            height: 40%;
                            width: 100%;
                            display: inline-block;
                            .player-info {
                                position: relative;
                                // font-size: 1em;
                            }
                        }
                        .game-board-container {
                            position: relative;
                            height: 50%;
                            width: 100%;
                            display: inline-block;
                            .time {
                                position: relative;
                                height: 30%;
                                width: 100%;
                                font-size: 3em;
                            }
                            .info {
                                position: relative;
                                height: 50%;
                                width: 100%;
                                font-size: 1.5em;
                            }
                            .history {
                                position: relative;
                                height: 20%;
                                width: 100%;
                            }
                        }
                        .game-board-footer {
                            position: relative;
                            height: 10%;
                            width: 100%;
                            display: inline-block;
                            .room-info {
                                position: relative;
                                padding: 0.5em;
                            }
                        }
                    }
                }
                .container-left-inner-right {
                    position: relative;
                    height: 100%;
                    width: 30%;
                }
                .player-list {
                    position: relative;
                    height: 100%;
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    .player-item {
                        position: relative;
                        height: 5em;
                        margin-top: 0.5em;
                        margin-left: 0.5em;
                        margin-right: 0.5em;
                    }
                }
            }
        }
        .container-right {
            position: relative;
            display: inline-block;
            height: 100%;
            width: 30%;
            .container-right-inner {
                position: relative;
                height: 100%;
                width: 100%;
                text-align: right;
            }
        }
    }
}
</style>
