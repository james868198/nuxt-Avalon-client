<template lang="pug">
    .game
        .game-container(v-if="game")
            .game-container-left
                .game-container-left-inner
                    .player-list(v-if="game.players")
                        //- .my-player-item()
                        //-     PlayerItem(:data="playerData", :privateInfo="playerInfo", :roundInfo="game.roundInfo", :id="id")
                        .player-item(v-for="(playerData, id) in game.players")
                            PlayerItem(:data="playerData", :privateInfo="playerInfo", :roundInfo="game.roundInfo", :id="id")
                            //- PlayerItem(:id="playerData.id || id", :name="playerData.name", :status="playerData.status", :onMission="playerData.onMission")


            .game-container-right
                .game-container-right-inner
                    .game-container-right-top
                        .vertical-center
                            .game-container-right-top-inner
                                .game-board
                                    .game-board-top
                                        .game-board-top-inner
                                            .game-board-nav
                                                .game-board-nav-container
                                                    .game-board-nav-item(v-for="board in gameBoards"  @click= "gameBoard = board")  {{board}}
                                                    .room-info(v-if="game.room")
                                                        | Game Status: {{game.room.status}} | {{gameBoard}}
                                                        | Player Number: {{game.room.numOfPlayers}}
                                                        br
                                                        | room id: {{game.room.id}}
                                    .game-board-bottom
                                        .game-board-bottom-inner
                                            //- .info-board
                                            //-     //- room data
                                            //-     .info-board-inner(v-if="game.room")

                                            .board-container
                                                .status-board(:class="{ show: gameBoard == 'Game' }")
                                                    //- game status, stage info, history
                                                    .status-board-inner

                                                        .round-board
                                                            .vertical-center
                                                                .round-board-inner
                                                                    RoundBoard(:missions="game.missions", :history="game.voteHistory")
                                                        .info
                                                            .time
                                                                | {{time.min}}:{{time.sec}}
                                                            .stage(v-if="game.roundInfo")
                                                                | Stage: {{game.roundInfo.stage}}
                                                .action-board(:class="{ show: gameBoard == 'Action'}")
                                                    .vertical-center
                                                        .action-board-inner
                                                            ControlBoard(:stage="'quest'", numOfPlayers="game.room.numOfPlayers")

                                            //-     //- player's management board for quest, vote, action, assassinate
                                            //-     .action-board-inner

                    .game-container-right-bottom
                        .vertical-center
                            .game-container-right-bottom-inner
                                .game-chatroom
                                    Chatroom(:chatting="chatting"  :name="playerName"  @message="classifyMessage")



</template>

<script>
import Chatroom from '@/components/chatroom'
import RoundBoard from '@/components/RoundBoard'
import ControlBoard from '@/components/ControlBoard'

import SocketEmits from '@/utils/bridges/socket/emits'
import socketClient from '@/plugins/socket.io'
import Player from '@/components/player'

export default {
    name: 'Game',
    components: {
        Chatroom,
        RoundBoard,
        ControlBoard,
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
                room: {
                    name: 'room',
                    id: null,
                    status: 'pending',
                    numOfPlayers: 0,
                    nowPlayerAmount: 0
                },
                data: null,
                missions: [],
                voteHistory: [],
                roundInfo: null,
                players: [],
                time: 0
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
            },
            // game-board-nav
            gameBoards: ['Game', 'Action'],
            gameBoard: 'Game'
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
                            // this.game = res.data.game
                            if (res.data.game.room) {
                                this.game.room = res.data.game.room
                            }
                            if (res.data.game.data) {
                                this.game.data = res.data.game.data
                            }
                            if (res.data.game.missions) {
                                this.game.missions = res.data.game.missions
                            }
                            if (res.data.game.voteHistory) {
                                this.game.voteHistory =
                                    res.data.game.voteHistory
                            }
                            if (res.data.game.roundInfo) {
                                this.game.roundInfo = res.data.game.roundInfo
                            }
                            if (res.data.game.players) {
                                this.game.players = res.data.game.players
                            }
                            const status = this.game.room.status
                            console.log('game status', status)
                            if (status !== 'pending' && !this.playerInfo) {
                                this.getPlayerInfo()
                            }
                        }
                        if (
                            res.data.time != undefined ||
                            res.data.time != NaN
                        ) {
                            const time = res.data.time
                            if (res.data.time >= 0) {
                                this.time.min = Math.floor(time / 60)
                                this.time.sec = time % 60
                            }
                        }
                        if (res.data.player) {
                            this.player = res.data.player
                        }
                        if (res.data.playerInfo) {
                            console.log('reveice playerInfo')
                            if (this.playerInfo === null) {
                                this.playerInfo = res.data.playerInfo
                            }
                            const map = {}
                            if (this.playerInfo.saw) {
                                this.playerInfo.saw.forEach(sawId => {
                                    map[sawId] = 1
                                })
                                this.playerInfo['seenmap'] = map
                            }
                            console.log('playerInfo:', this.playerInfo)
                        }
                    }
                }
            })
        }
    },
    created() {
        console.log('[socketIo] connect to game server')
        const socketUrl = `${socketClient.url}/game`
        this.socket = socketClient.io(socketUrl, socketClient.options)
        // console.log('[socketIo] get socket:', this.socket)
    },
    mounted() {
        console.log('userId', sessionStorage.userId)
        if (!sessionStorage.userId) {
            this.backToHome()
        }
        if (sessionStorage.playerName) {
            this.playerName = sessionStorage.playerName
        }
        // if (!localStorage.userId) {
        //     this.backToHome()
        // }
        // if (localStorage.playerName) {
        //     this.playerName = localStorage.playerName
        // }
        this.userId = sessionStorage.userId
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
            console.log('[joinGame]', this.userId, this.playerName)
            const data = {
                gameId: this.gameId,
                userId: this.userId,
                userName: this.playerName || 'Anonymous47'
            }
            SocketEmits.joinGame(this.socket, data)
        },
        getGameById(id) {
            console.log('[getGameById]')
            SocketEmits.getGameById(this.socket, id)
        },
        getPlayerInfo() {
            console.log('[getPlayerInfo]', this.socket)
            SocketEmits.getPlayerInfo(this.socket)
        },
        // actions
        quest(word) {
            console.log('[quest]', word)
            if (!word) {
                console.log('no word')
                return
            }
            const data = {
                memberList: word
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
        },
        // for testing
        moveStage() {
            SocketEmits.moveStage(this.socket)
        }
    }
}
</script>

<style lang="scss">
@import '@/styles/variables/index.scss';

$border-color: #bada55;
$board-background-color: color(gray-3);
$board-nav-background-color: color(gray-5);
$board-nav-size: 8em;
$board-item-color: color(gray-3);
$board-font-color: color(orange);

$playerInfo-font-size: 1.2em;

$container-left-width-1: 20px;
$container-left-width-2: 200px;
$gamer-item-height: 20px;
$player-item-height: 30px;

.game {
    position: relative;
    height: 100%;
    width: 100%;
    overflow: hidden;
    .game-container {
        position: relative;
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: row;
        // overflow: hidden;
        .game-container-left {
            position: relative;
            display: inline-block;
            height: 100%;
            width: 20%;
            // min-width: $container-left-width-1;
            transition: width 1s;
            .game-container-left-inner {
                position: relative;
                height: 100%;
                width: 100%;
                .player-list {
                    position: relative;
                    height: 100%;
                    width: 100%;
                    display: grid;
                    grid-template-rows: repeat(11, 1fr);
                    justify-items: center;
                    // align-items: center;
                    .my-player-item {
                        position: relative;
                        width: 100%;
                        grid-row: 1 / 2;
                    }
                    .player-item {
                        position: relative;
                        width: 100%;
                        // position: relative;
                        // height: 5em;
                        // margin-top: 0.5em;
                        // margin-left: 0.5em;
                        // margin-right: 0.5em;
                    }
                }
            }
        }
        .game-container-right {
            position: relative;
            display: inline-block;
            height: 100%;
            width: 80%;
            transition: width 1s;
            background-color: color(gray-5);
            .game-container-right-inner {
                position: relative;
                height: 100%;
                width: 100%;
                display: flex;
                flex-direction: column;
                .game-container-right-top {
                    position: relative;
                    height: 40%;
                    width: 100%;
                    display: inline-block;
                    z-index: 6;

                    .game-container-right-top-inner {
                        position: relative;
                        height: 100%;
                        width: 96%;
                        margin: 0 auto;
                        .game-board {
                            position: relative;
                            height: 100%;
                            width: 100%;
                            display: flex;
                            flex-direction: column;
                            background-color: $board-background-color;
                            .game-board-top {
                                position: relative;
                                height: 20%;
                                width: 100%;
                                display: inline-block;
                                .game-board-top-inner {
                                    position: relative;
                                    height: 100%;
                                    width: 100%;
                                    .game-board-nav {
                                        position: relative;
                                        height: 100%;
                                        width: 100%;
                                        background-color: $board-nav-background-color;
                                        color: $board-font-color;
                                        .game-board-nav-container {
                                            position: relative;
                                            height: 100%;
                                            width: 100%;
                                            display: grid;
                                            grid-template-columns: $board-nav-size $board-nav-size $board-nav-size auto;
                                            text-align: center;
                                            align-self: center;
                                            .game-board-nav-item {
                                                text-align: center;
                                                font-size: 1.6em;
                                                background-color: $board-background-color;
                                                // &::before {
                                                //     position: after;
                                                //     height: 100%;
                                                //     width: 100%;
                                                // }
                                                cursor: pointer;
                                                &:hover {
                                                    opacity: 0.8;
                                                }
                                            }
                                            .room-info {
                                                grid-column: -1;
                                                text-align: right;
                                                display: inline;
                                            }
                                        }
                                    }
                                }
                            }
                            .game-board-bottom {
                                position: relative;
                                height: 80%;
                                width: 100%;
                                display: inline-block;
                                .game-board-bottom-inner {
                                    position: relative;
                                    height: 100%;
                                    width: 100%;
                                    .board-container {
                                        position: relative;
                                        height: 100%;
                                        width: 100%;
                                        // overflow: hidden;
                                        .status-board {
                                            position: relative;
                                            height: 100%;
                                            width: 100%;
                                            display: None;
                                            .status-board-inner {
                                                position: relative;
                                                height: 100%;
                                                width: 100%;
                                                display: grid;
                                                grid-gap: 0.2em;
                                                grid-template-rows: repeat(
                                                    2,
                                                    1fr
                                                );
                                                text-align: center;
                                                align-self: center;
                                                .info {
                                                    display: inline-block;
                                                    position: relative;
                                                    height: 100%;
                                                    width: 100%;
                                                    font-size: 2em;
                                                    z-index: 6;
                                                    .time {
                                                    }
                                                    .stage {
                                                    }
                                                }
                                                .round-board {
                                                    display: inline-block;
                                                    position: relative;
                                                    height: 100%;
                                                    width: 100%;
                                                    z-index: 7;
                                                    .round-board-inner {
                                                        position: relative;
                                                        height: 100%;
                                                        width: 80%;
                                                        margin: 0 auto;
                                                    }
                                                }
                                            }
                                        }
                                        .action-board {
                                            position: relative;
                                            height: 100%;
                                            width: 100%;
                                            display: None;
                                            background-color: white;
                                            .action-board-inner {
                                                position: relative;
                                                height: 100%;
                                                width: 80%;
                                                display: inline-block;
                                            }
                                        }
                                        .show {
                                            display: block;
                                            // transition: height 1s;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                .game-container-right-bottom {
                    position: relative;
                    height: 60%;
                    width: 100%;
                    display: inline-block;
                    z-index: 5;
                    .game-container-right-bottom-inner {
                        position: relative;
                        height: 100%;
                        width: 96%;
                        margin: 0 auto;
                        .game-chatroom {
                            position: relative;
                            height: 100%;
                            width: 100%;
                        }
                    }
                }
            }
        }
    }
}
.vertical-center {
    position: absolute;
    height: 90%;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
    text-align: center;
}
@media screen and (max-width: 1100px) {
    .game {
        .game-container {
            .game-container-left {
                width: 30%;
            }
            .game-container-right {
                width: 70%;
            }
        }
    }
}
@media screen and (max-width: 700px) {
    .game {
        .game-container {
            .game-container-left {
                width: 20%;

                .player-list {
                    position: absolute;
                    z-index: 99999;
                }
                &:hover {
                    overflow: visible;
                    // width: 30%;
                }
            }
            .game-container-right {
                width: 80%;
            }
        }
    }
}
</style>
