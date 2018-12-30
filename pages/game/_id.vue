<template lang="pug">
    .game
        .game-container
            .container-left
                .container-left-inner
                    .container-left-inner-top
                        | {{game}}
                    .container-left-inner-mid
                        .avatar
                        .name
                            | {{player}}
                            | {{time}}
                    .container-left-inner-bottom
                        .container-left-inner-bottom-inner(v-if="game")
                            .player(v-for="player in game.players")
                                | {{player}}:
            .container-right
                Chatroom(:chatting="chatting"  :name="playerName"  @message="classifyMessage")

</template>

<script>
import Chatroom from '@/components/chatroom'
import SocketEmits from '@/utils/bridges/socket/emits'
import socketClient from '@/plugins/socket.io'

export default {
    name: 'Game',
    components: {
        Chatroom
    },
    data() {
        return {
            // base
            chatting: [],
            socketId: null,
            socket: null,
            // game
            game: null,
            gameId: null,
            playerName: null,
            player: {
                name: null,
                id: null,
                charactor: null,
                camp: null,
                saw: []
            },
            time: {
                min: 0,
                sec: 0
            },
            // commands
            cmdConfig: {
                quest: this.quest, // q [id]
                // unQuest: this.unQuest, // uq [id]
                vote: this.vote, // v [y or n]
                action: this.action // a [s or f]
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
                    console.log('socket fail:')
                    if (res.error.code == 10000) {
                        console.log('socket code:')
                        window.location.href = '/'
                        // this.$router.push({ path: '/' })
                    }
                } else {
                    if (res.data) {
                        if (res.data.game) {
                            this.game = res.data.game
                        }
                        if (res.data.player) {
                            this.player = res.data.player
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
                this.game = newVal
                if (newVal.status !== 'pending') {
                    this.getIdentity()
                }
            }
        }
    },
    created() {
        const socketUrl = `${socketClient.url}/game`
        this.socket = socketClient.io(socketUrl, socketClient.options)
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
                userName: this.playerName || 'hello kuo'
            }
            SocketEmits.joinGame(this.socket, data)
        },
        getGameById(id) {
            SocketEmits.getGameById(this.socket, id)
        },
        getIdentity() {
            SocketEmits.getIdentity(this.socket)
        },
        // actions
        quest(id) {
            const data = {
                playerId: id
            }
            SocketEmits.quest(this.socket, data)
        },
        // unQuest(id) {
        //     const data = {
        //         playerId: id
        //     }
        //     SocketEmits.unQuest(this.socket, data)
        // },
        vote(vote) {
            const data = {
                vote: vote
            }
            SocketEmits.vote(this.socket, data)
        },
        action(action) {
            const data = {
                action: action
            }
            SocketEmits.action(this.socket, data)
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
            text-align: center;
            .container-left-inner {
                position: relative;
                height: 100%;
                width: 100%;
                // margin: 0 auto;
                // text-align: center;
                .container-left-inner-top {
                    position: relative;
                    height: 40%;
                    width: 100%;
                }
                .container-left-inner-mid {
                    position: relative;
                    height: 20%;
                    width: 100%;
                }
                .container-left-inner-bottom {
                    position: relative;
                    height: 40%;
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
