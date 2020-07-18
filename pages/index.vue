<template lang="pug">
    .main
        .container
            .container-top
                .container-top-inner
                    .main-board
                        .main-board-top
                            .main-board-column
                                .main-board-column-inner
                                    .main-board-column-container
                                        .label
                                            .label-inner
                                                | Player Name
                                        .input
                                            el-input(v-model="playerName")
                                        .btn
                                            el-button(type="warning"  @click="setPlayerName") enter

                            .main-board-column
                                .main-board-column-inner
                                    .main-board-column-container
                                        .label
                                            .label-inner
                                                | Create Room
                                        .input
                                            el-input.input-left(v-model="gameName", placeholder="Room Name")
                                            el-select.input-right(v-model="numOfPlayers", placeholder="Player Number")
                                                el-option(v-for="item in numOfPlayersOptions", :key="item.value", :label="item.label", :value="item.value")
                                        .btn
                                            el-button(type="warning", @click="createGame") create
                            .main-board-column
                                .main-board-column-inner
                                    .main-board-column-container
                                        .label
                                            .label-inner
                                                | Join Room
                                        .input
                                            el-input(v-model="roomId", placeholder="Room ID")
                                        .btn
                                            el-button(type="warning", @click="joinGame") GO
                        //-     .main-board-column
                        //- .container-left-inner-bottom

                        //- .game(v-for="game in games")
                        //-     | {{game.name}}
                        //- .line
                        //-     .label
                        //-         .label-inner
                        //-             | join room
                        //-     .input
                        //-         el-input(v-model="roomName")
                        //-     .btn
                        //-         el-button(type="info", @click="joinGame") enter
            .container-bottom
                .container-bottom-inner
                    Chatroom(:chatting="chatting"  :name="playerName"  @message="classifyMessage")

</template>

<script>
import Chatroom from '@/components/chatroom'
import SocketEmits from '@/utils/bridges/socket/emits'
import socketClient from '@/plugins/socket.io'

export default {
    name: 'Index',
    components: {
        Chatroom
    },
    data() {
        return {
            chatting: [],
            games: [],
            userId: null,
            playerName: null,
            socket: null,
            gameName: null,
            numOfPlayers: null,
            numOfPlayersOptions: [
                {
                    value: 2,
                    label: '2'
                },
                {
                    value: 5,
                    label: '5'
                },
                {
                    value: 6,
                    label: '6'
                },
                {
                    value: 7,
                    label: '7'
                },
                {
                    value: 8,
                    label: '8'
                },
                {
                    value: 9,
                    label: '9'
                },
                {
                    value: 10,
                    label: '10'
                }
            ],
            roomId: null
        }
    },
    watch: {
        socket(newVal, oldVal) {
            if (!newVal) {
                // this.socket = socketClient.io(socketClient.url, socketClient.options)
                return
            }
            this.socket.on('message', data => {
                console.log('get message', data)
                if (data) {
                    this.chatting.push(data)
                }
            })
            this.socket.on('games', data => {
                console.log('get games', data)
                if (data) {
                    this.games = data
                }
            })
            this.socket.on('response', resp => {
                console.log('get res', resp)
                if (resp.status == 'fail') {
                    console.log('ERROR:', resp.error)
                } else {
                    if (resp.data) {
                        if (resp.data.user) {
                            console.log('get user', resp.data.user)
                            this.userId = resp.data.user.id
                            this.playerName = resp.data.user.name
                            // localStorage.userId = resp.user.id
                            // localStorage.playerName = resp.user.name
                            sessionStorage.userId = resp.data.user.id
                            sessionStorage.playerName = resp.data.user.name
                        }
                        if (resp.data.gameId) {
                            window.location = `game/${resp.data.gameId}`
                        }
                    }
                }
            })
        }
    },
    created() {
        this.socket = socketClient.io(socketClient.url, socketClient.options)
    },
    mounted() {
        // if (localStorage.playerName) {
        //     this.playerName = localStorage.playerName
        // }
        // if (localStorage.userId) {
        //     this.userId = localStorage.userId
        // }
        if (sessionStorage.userId) {
            console.log('sessionStorage.userId', sessionStorage.userId)
            this.userId = localStorage.userId
        }
        if (sessionStorage.playerName) {
            this.playerName = sessionStorage.playerName
        }
    },
    methods: {
        classifyMessage(message) {
            if (!message || message == '') {
                return
            }
            this.sendMessage(message)
        },
        sendMessage(message) {
            if (!this.socket) {
                return
            }
            const data = {
                userName: this.playerName,
                message: message
            }
            SocketEmits.chat(this.socket, data)
        },
        setPlayerName() {
            if (this.playerName == '' || !this.playerName) {
                return
            }
            this.setName()
        },
        setName() {
            if (!this.socket) {
                return
            }
            const data = {
                userId: this.userId,
                userName: this.playerName
            }
            SocketEmits.createUser(this.socket, data)
        },
        joinGame() {
            if (!this.roomId) {
                console.log('[joinGame] fail: roomId is empty')
                return
            }
            window.location = `game/${this.roomId}`
            // this.$router.push(`game/${this.roomId}`)
        },
        createGame() {
            if (!this.socket) {
                return null
            }
            if (!this.gameName) {
                this.chatting.push({
                    userName: 'SYSTEM',
                    message: 'ERROR: no room name'
                })
                return
            }
            const data = {
                roomName: this.gameName,
                numOfPlayers: this.numOfPlayers
            }
            SocketEmits.createGame(this.socket, data)
        },
        getGames() {
            SocketEmits.getGames(this.socket)
        }
    }
}
</script>

<style lang="scss">
@import '../styles/variables/index.scss';

$label-color: color(white);

.main {
    position: relative;
    height: 100%;
    width: 100%;
    overflow: hidden;
    background-color: white;
    font-size: $font-size1;
    background-color: color(gray-2);
    .container {
        position: relative;
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        // overflow: hidden;
        .container-top {
            position: relative;
            display: inline-block;
            height: 50%;
            width: 100%;
            text-align: center;
            .container-top-inner {
                position: relative;
                display: inline-block;
                height: 100%;
                width: 70%;
                text-align: center;
                .main-board {
                    position: relative;
                    height: 100%;
                    width: 80%;
                    margin: 0 auto;
                    text-align: center;
                    overflow: scroll;
                    .main-board-column {
                        position: relative;
                        width: 100%;
                        height: 6em;
                        .main-board-column-inner {
                            position: absolute;
                            top: 50%;
                            transform: translateY(-50%);
                            // height: 90%;
                            width: 100%;
                            .main-board-column-container {
                                position: relative;
                                height: 90%;
                                width: 100%;
                                display: flex;
                                flex-direction: row;
                                .label {
                                    display: inline-block;
                                    position: relative;
                                    width: 25%;
                                    font-size: 1.5em;
                                    text-align: center;
                                    color: $label-color;
                                    font-weight: bold;
                                    .label-inner {
                                        position: absolute;
                                        top: 50%;
                                        transform: translateY(-50%);
                                    }
                                }
                                .input {
                                    display: inline-block;
                                    position: relative;
                                    width: 50%;
                                    text-align: left;
                                    .input-left {
                                        position: relative;
                                        height: 100%;
                                        max-width: 40%;
                                        display: inline-block;
                                    }
                                    .input-right {
                                        margin-left: 1em;
                                        position: relative;
                                        height: 100%;
                                        max-width: 40%;
                                        display: inline-block;
                                    }
                                }
                                .btn {
                                    display: inline-block;
                                    position: relative;
                                    width: 25%;
                                    text-align: center;
                                }
                            }
                        }
                    }
                    // .container-left-inner-mid {
                    //     position: relative;
                    //     width: 100%;
                    //     display: flex;
                    //     flex-direction: row;
                    //     padding-top: 2em;
                    //     font-size: 1.5em;
                    // }
                }
            }
        }
        .container-bottom {
            position: relative;
            display: inline-block;
            height: 50%;
            width: 100%;
            text-align: center;
            .container-bottom-inner {
                position: relative;
                height: 90%;
                width: 70%;
                margin: 0 auto;
                text-align: center;
                border-radius: 15px;
                background-color: color(gray-2);
            }
        }
    }
}

@media screen and (max-width: 800px) {
    .main {
        font-size: $font-size3;
        .container {
            .container-top {
                .container-top-inner {
                    width: 100%;
                }
            }
            .container-bottom {
                .container-bottom-inner {
                    width: 90%;
                }
            }
        }
    }
}
</style>
