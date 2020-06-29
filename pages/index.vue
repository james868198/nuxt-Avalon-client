<template lang="pug">
    .main
        .main-container
            .container-left
                .container-left-inner
                    .container-left-inner-top
                        .label
                            .label-inner
                                | Player ID
                        .input
                            el-input(v-model="playerName")
                        .btn
                            el-button(type="info", @click="setPlayerName") enter
                    //- .game(v-for="game in games")
                    //-     | {{game.name}}
                    .container-left-inner-mid
                        .label
                            .label-inner
                                | create game
                        .input
                            el-input(v-model="gameName")
                            el-select(v-model="numOfPlayers")
                                el-option(v-for="item in numOfPlayersOptions", :key="item.value", :label="item.label", :value="item.value")
                        .btn
                            el-button(type="info", @click="createGame") enter
                    .container-left-inner-bottom
                    //- .line
                    //-     .label
                    //-         .label-inner
                    //-             | join room
                    //-     .input
                    //-         el-input(v-model="roomName")
                    //-     .btn
                    //-         el-button(type="info", @click="joinGame") enter
            .container-right
                .container-right-inner
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
            socketId: null,
            userId: null,
            playerName: null,
            socket: null,
            gameName: 'room',
            numOfPlayers: 5,
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
            cmdConfig: {
                gg: this.getGames, //gg
                jg: this.joinGame //cr [id]
            }
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
                if (resp.status == 'error') {
                    console.log('ERROR:', resp.error.description)
                } else {
                    if (resp.socketId) {
                        this.socketId = resp.socketId
                    }
                    if (resp.userData) {
                        console.log('get userData', resp.userData)
                        this.userId = resp.userData.id
                        this.playerName = resp.userData.name
                        localStorage.userId = resp.userData.id
                        localStorage.playerName = resp.userData.name
                    }
                    if (resp.data) {
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
        if (localStorage.playerName) {
            this.playerName = localStorage.playerName
            this.userId = localStorage.userId
            // this.setName()
        }
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
                if (this.cmdConfig[words[1]]) {
                    this.cmdConfig[words[1]](words.slice(2))
                }
            }
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
            SocketEmits.setName(this.socket, data)
        },
        joinGame(params) {
            if (!params) {
                this.chatting.push({
                    userName: 'SYSTEM',
                    message: 'ERROR: no params'
                })
                return
            }
            if (params.length !== 1) {
                this.chatting.push({
                    userName: 'SYSTEM',
                    message: 'ERROR: command format wrong'
                })
                return
            }
            const gameId = params[0]
            this.$router.push(`game/${gameId}`)
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
.main {
    position: relative;
    height: 100%;
    width: 100%;
    overflow: hidden;
    background-color: white;
    .main-container {
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
            text-align: center;
            .container-left-inner {
                position: relative;
                height: 100%;
                width: 80%;
                margin: 0 auto;
                text-align: center;
                .container-left-inner-top {
                    position: relative;
                    width: 100%;
                    display: flex;
                    flex-direction: row;
                    padding-top: 2em;
                    font-size: 1.5em;
                    .label {
                        display: inline-block;
                        position: relative;
                        width: 20%;
                        .label-inner {
                            position: absolute;
                            width: 100%;
                            top: 50%;
                            transform: translateY(-50%);
                            text-align: center;
                        }
                    }
                    .input {
                        display: inline-block;
                        position: relative;
                        width: 40%;
                        text-align: center;
                    }
                    .btn {
                        display: inline-block;
                        position: relative;
                        width: 30%;
                        text-align: center;
                    }
                }
                .container-left-inner-mid {
                    position: relative;
                    width: 100%;
                    display: flex;
                    flex-direction: row;
                    padding-top: 2em;
                    font-size: 1.5em;
                    .label {
                        display: inline-block;
                        position: relative;
                        width: 20%;
                        .label-inner {
                            position: absolute;
                            width: 100%;
                            top: 50%;
                            transform: translateY(-50%);
                            text-align: center;
                        }
                    }
                    .input {
                        display: inline-block;
                        position: relative;
                        width: 40%;
                        text-align: center;
                    }
                    .btn {
                        display: inline-block;
                        position: relative;
                        width: 30%;
                        text-align: center;
                    }
                }
                .container-left-inner-bottom {
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
