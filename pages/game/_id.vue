<template lang="pug">
    .main
        .main-container
            .container-left
                .container-left-inner
                    .container-left-inner-top
                        | {{game}}
                    .container-left-inner-mid
                        .avatar
                        .name
                            | {{playerName}}
                    .container-left-inner-bottom
            .container-right
                Chatroom(:chatting="chatting"  :name="playerName"  @message="classifyMessage")

</template>

<script>
import Chatroom from '@/components/chatroom'
import SocketEmits from '@/utils/bridges/socket/emits'
import io from 'socket.io-client'

export default {
    name: 'Game',
    components: {
        Chatroom
    },
    data() {
        return {
            game: null,
            gameId: null,
            chatting: [],
            playerName: null,
            socketId: null,
            socket: null,
            gameTime: '00:00:00',
            cmdConfig: {
                cr: this.createRoom, //cr [roomName]
                jg: this.joinGame, //cr [id]
                t: this.test
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
            this.socket.on('respone', resp => {
                if (data) {
                }
            })
            this.socket.on('error', errorMsg => {
                console.log('ERROR:', errorMsg.message)
                if (errorMsg.code == 10000) {
                    window.location = '/'
                }
            })
            this.socket.on('gameUpdate', game => {
                if (game) {
                    this.game = game
                } else {
                    // this.$router.push({ path: '/' })
                    window.location = '/'
                }
            })
        }
    },
    created() {
        this.socket = io('http://127.0.0.1:3000/game')
    },
    mounted() {
        if (localStorage.playerName) {
            this.playerName = localStorage.playerName
        }
        this.gameId = this.$route.params.id
        this.joinGame()
    },
    methods: {
        classifyMessage(message) {
            if (!message || message == '') {
                return
            }

            const words = message.split(' ')
            if (words[0] != '//') {
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
                userName: this.playerName || 'hello kuo'
            }
            SocketEmits.joinGame(this.socket, data)
        },
        getGameById(id) {
            SocketEmits.getGameById(this.socket, id)
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
                width: 100%;
                // margin: 0 auto;
                // text-align: center;
                .container-left-inner-top {
                    position: relative;
                    height: 50%;
                    width: 100%;
                    background: yellow;
                }
                .container-left-inner-mid {
                    position: relative;
                    height: 20%;
                    width: 100%;
                    background: gray;
                }
                .container-left-inner-bottom {
                    position: relative;
                    height: 20%;
                    width: 100%;
                }
            }
        }
        .container-right {
            position: relative;
            display: inline-block;
            height: 100%;
            width: 30%;
        }
    }
}
</style>
