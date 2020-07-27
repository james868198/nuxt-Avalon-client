<template lang="pug">
    .game
        .game-container(v-if="game")
            .game-container-left
                .game-container-left-inner
                    .player-list(v-if="game.players")
                        .my-player-item(v-if="playerInfo")
                            | ID: {{player.id+1}}
                            .charactor(:class="{bad: playerInfo.camp === 'R', good: playerInfo.camp === 'B'}")
                                | {{playerInfo.charactor}}
                        .player-item(v-for="(playerData, id) in game.players")
                            PlayerItem(:data="playerData", :privateInfo="playerInfo", :roundInfo="game.roundInfo", :id="id")
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
                                                    .game-board-nav-item(v-for="board in gameBoards" :class="{ selected: gameBoard == board}"  @click= "gameBoard = board")
                                                        .game-board-nav-item-inner
                                                            | {{board}}

                                    .game-board-bottom
                                        .game-board-bottom-inner
                                            .board-container
                                                .status-board(v-show="gameBoard == 'Game'")
                                                    //- game status, stage info, history
                                                    .status-board-inner

                                                        .round-board
                                                            .vertical-center
                                                                .round-board-inner
                                                                    RoundBoard(:missionId="game.data.missionId", :missions="game.missions", :history="game.voteHistory")
                                                        .info
                                                            .info-container
                                                                .time
                                                                    | Time:&nbsp
                                                                    .time-inner
                                                                        | {{time.min}}:{{time.sec}}
                                                                .stage(v-if="game.data")
                                                                    | Stage:&nbsp
                                                                    .stage-inner(v-if="game.data.stage")
                                                                        | {{game.data.stage}}
                                                                    .stage-inner(v-else)
                                                                        | initializing
                                                .action-board(v-show="gameBoard == 'Action'")
                                                    .vertical-center
                                                        .action-board-inner(v-if="game.room && game.data")
                                                            ControlBoard(:stage="game.data.stage"  :selectionNumber="selectionNumber"  :numOfPlayers="game.room.numOfPlayers" @quest="quest" @vote="vote" @action="action" @assassinate="assassinate")
                                                .room-board(v-show="gameBoard == 'Room'")
                                                    //- room data
                                                    .room-board-inner(v-if="game.room")
                                                        br
                                                        | Game Status: {{game.room.status}}
                                                        br
                                                        | Player Number: {{game.room.numOfPlayers}}
                                                        hr
                                                        .room-id
                                                            | {{game.room.id}}
                                                .test-board(v-show="gameBoard == 'Test'")
                                                    el-button(type="warning"  @click="moveStage") moveStage
                                                    | {{game.roundInfo}}
                                                    | {{game.data}}
                                                    | {{game.voteHistory}}
                    .game-container-right-bottom
                        .vertical-center
                            .game-container-right-bottom-inner
                                .game-chatroom
                                    Chatroom(:chatting="chatting"  :name="playerName"  @message="sendMessage")
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
                data: {
                    missionId: -1
                },
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
            // game-board-nav
            gameBoards: ['Game', 'Action', 'Room', 'Test'],
            gameBoard: 'Game'
        }
    },
    computed: {
        selectionNumber() {
            if (this.game == null) {
                return -1
            }
            if (this.game.missions == null || this.game.missions.length == 0) {
                return -1
            }
            if (
                this.game.data == null ||
                this.game.data.missionId == null ||
                this.game.data.missionId < 0
            ) {
                return -1
            }
            return this.game.missions[this.game.data.missionId].NumOnMission
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
                // console.log('socket res:', res)
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
                                if (
                                    res.data.game.data.winner &&
                                    this.game.data.winner == null
                                ) {
                                    alert(
                                        `Winner: ${
                                            res.data.game.data.winner
                                        } side`
                                    )
                                }
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
                            // console.log('game status', status)
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
        sendMessage(message) {
            if (!message || message == '') {
                return
            }
            if (!this.socket) {
                return null
            }
            let name = this.playerName
            if (this.player) {
                if (this.player.id != null) {
                    name = `${this.playerName}(Player:${this.player.id + 1})`
                }
            }
            const data = {
                userName: name,
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
        quest(selection) {
            console.log('[gameroom][quest]', selection)
            if (status == null || status == undefined) {
                console.log('status empty')
                return
            }
            if (!this.game || !this.game.data) {
                console.log('game data not found')
                return
            }
            const stage = this.game.data.stage
            if (stage !== 'questing') {
                console.log('wrong stage')
                return
            }
            if (!selection) {
                console.log('no selection')
                return
            }
            const data = {
                memberList: selection
            }
            SocketEmits.quest(this.socket, data)
            console.log('[gameroom][quest] sent')
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
            // SocketEmits.unQuest(this.socket, data)
        },
        vote(status) {
            console.log('[vote]', status)
            if (status == null || status == undefined) {
                console.log('status empty')
                return
            }
            if (!this.game || !this.game.data) {
                console.log('game data not found')
                return
            }
            const stage = this.game.data.stage
            if (stage !== 'voting') {
                console.log('wrong stage')
                return
            }

            if (status !== 1 && status !== 0) {
                console.log('vote data is not 1 and 0')
                return
            }
            const data = {
                vote: status
            }
            SocketEmits.vote(this.socket, data)
        },
        action(status) {
            console.log('[action]', status)
            if (status == null || status == undefined) {
                console.log('status empty')
                return
            }
            if (!this.game || !this.game.data) {
                console.log('game data not found')
                return
            }
            const stage = this.game.data.stage
            if (stage !== 'action') {
                console.log('wrong stage')
                return
            }

            if (status !== 1 && status !== 0) {
                console.log('vote data is not 1 and 0')
                return
            }
            const data = {
                action: status
            }
            SocketEmits.action(this.socket, data)
        },
        assassinate(selection) {
            console.log('[assassinate]', selection)
            if (!this.game || !this.game.room || !this.game.data) {
                console.log('game data not found')
                return
            }
            if (selection < 0 || selection >= this.game.room.numOfPlayers) {
                console.log('selection not validation')
                return
            }
            const stage = this.game.data.stage
            if (stage !== 'assassinating') {
                console.log('wrong stage')
                return
            }
            const data = {
                target: selection
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

$board-background-color: color(gray-1);
$board-nav-background-color: color(gray-3);

$board-nav-size: 8em;
$board-item-color: color(gray-2);
$board-font-color: color(orange);

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
                    align-items: center;
                    .my-player-item {
                        position: relative;
                        width: 100%;
                        height: 100%;
                        border-bottom: 2px solid color(black);
                        font-size: 1.4em;
                        font-weight: bold;
                        text-align: center;
                        background-color: color(gray-5);
                        .charactor {
                            &::before {
                                content: 'Card: ';
                                color: color(black);
                            }
                        }
                        .charactor.bad {
                            color: color(red);
                        }
                        .charactor.good {
                            color: color(blue);
                        }
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
            background-color: color(gray-4);
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
                            // background-color: $board-background-color;
                            .game-board-top {
                                position: relative;
                                height: 15%;
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
                                        // background-color: $board-nav-background-color;
                                        color: $board-font-color;
                                        overflow: hidden;
                                        .game-board-nav-container {
                                            position: relative;
                                            height: 100%;
                                            width: 100%;
                                            display: grid;
                                            grid-template-columns: $board-nav-size $board-nav-size $board-nav-size auto;
                                            text-align: center;
                                            align-self: center;
                                            justify-items: center;
                                            // background-color: $board-nav-background-color;

                                            .game-board-nav-item {
                                                text-align: center;
                                                background-color: $board-item-color;
                                                width: 100%;
                                                // &::before {
                                                //     position: after;
                                                //     height: 100%;
                                                //     width: 100%;
                                                // }

                                                cursor: pointer;
                                                &:hover {
                                                    opacity: 0.8;
                                                }
                                                .game-board-nav-item-inner {
                                                    font-size: 1.6em;
                                                }
                                            }
                                            .game-board-nav-item.selected {
                                                background-color: $board-background-color;
                                            }
                                        }
                                    }
                                }
                            }
                            .game-board-bottom {
                                position: relative;
                                height: 85%;
                                width: 100%;
                                display: inline-block;
                                background-color: $board-background-color;
                                .game-board-bottom-inner {
                                    position: relative;
                                    height: 100%;
                                    width: 100%;
                                    .board-container {
                                        position: relative;
                                        height: 100%;
                                        width: 100%;
                                        // overflow: hidden;
                                        .room-board {
                                            position: relative;
                                            height: 100%;
                                            width: 100%;
                                            // display: None;
                                            text-align: center;
                                            .room-board-inner {
                                                position: relative;
                                                height: 100%;
                                                width: 80%;
                                                display: inline-block;
                                                text-align: center;
                                                color: color(orange);
                                                overflow: scroll;
                                                font-size: 1.4em;
                                                .room-id {
                                                    display: inline;
                                                    font-size: 1.4em;
                                                    &::before {
                                                        font-size: 0.5em;
                                                        content: 'Room ID: ';
                                                    }
                                                }
                                            }
                                        }
                                        .status-board {
                                            position: relative;
                                            height: 100%;
                                            width: 100%;
                                            .status-board-inner {
                                                position: relative;
                                                height: 100%;
                                                width: 100%;
                                                display: grid;
                                                grid-gap: 0.2em;
                                                grid-template-rows: 1em auto 5em;
                                                text-align: center;
                                                align-self: center;
                                                .round-board {
                                                    display: inline-block;
                                                    position: relative;
                                                    height: 100%;
                                                    width: 100%;
                                                    z-index: 7;
                                                    grid-row-start: 2;

                                                    .round-board-inner {
                                                        position: relative;
                                                        height: 100%;
                                                        width: 80%;
                                                        margin: 0 auto;
                                                    }
                                                }
                                                .info {
                                                    display: inline-block;
                                                    position: relative;
                                                    height: 100%;
                                                    width: 100%;
                                                    z-index: 6;
                                                    grid-row-start: 3;
                                                    color: color(orange);
                                                    text-align: center;
                                                    .info-container {
                                                        position: relative;
                                                        height: 100%;
                                                        width: 80%;
                                                        margin: 0 auto;
                                                        display: grid;
                                                        grid-template-columns: repeat(
                                                            2,
                                                            1fr
                                                        );
                                                        text-align: left;
                                                        .time {
                                                            font-size: 1.2em;
                                                            .time-inner {
                                                                display: inline;
                                                                font-size: 2em;
                                                            }
                                                        }
                                                        .stage {
                                                            font-size: 1.2em;
                                                            .stage-inner {
                                                                display: inline;
                                                                font-size: 2em;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        .action-board {
                                            position: relative;
                                            height: 100%;
                                            width: 100%;
                                            // background-color: white;
                                            .action-board-inner {
                                                position: relative;
                                                height: 100%;
                                                width: 80%;
                                                display: inline-block;
                                            }
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
