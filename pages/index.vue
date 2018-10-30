<template lang="pug">
    .main
        .main-container
            .container-left
                .container-left-inner
                    .line
                        .label
                            | Player ID
                        .input
                            el-input(v-model="playerId")
                        .btn
                            el-button(type="info", @click="setPlayerName") enter
                    //- .line
                    //-     .label
                    //-         | create room
                    //-     .input
                    //-         el-input(v-model="roomName")
                    //-     .btn
                    //-         el-button(type="info", @click="createGame") enter
                    //- .line
                    //-     .label
                    //-         | join room
                    //-     .input
                    //-         el-input(v-model="roomName")
                    //-     .btn
                    //-         el-button(type="info", @click="joinGame") enter
            .container-right
                Chatroom(:chatting="chatting"  :name="playerName"  @chat="sendMessage")

</template>

<script>
import Chatroom from '@/components/chatroom'

import io from 'socket.io-client'

export default {
    name: 'Index',
    components: {
        Chatroom
    },
    data() {
        return {
            chatting: [],
            message: null,
            playerId: null,
            socketId: null,
            playerName: null,
            socket: null,
            roomName: null
        }
    },
    watch: {
        socket(newVal, oldVal) {
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
            this.socket.on('rooms', data => {
                console.log('get rooms', data)
                if (data) {
                    this.rooms = data.rooms
                }
            })
        }
    },
    created() {
        this.socket = io('http://127.0.0.1:3000')
    },
    mounted() {},
    methods: {
        sendMessage(data) {
            if (!this.socket) {
                return null
            }
            console.log('send message')
            this.socket.emit('chat', data)
        },
        setPlayerName() {
            this.playerName = this.playerId
            if (!this.socket) {
                return null
            }
            console.log('send message')

            const data = {
                userName: this.playerId
            }
            this.socket.emit('setUserName', data)
        },
        joinRoom() {
            if (!this.socket) {
                return null
            }

            const data = {
                userName: this.userName
            }
            this.socket.emit('setUserName', data)
            this.message = null
        },
        startRoom() {
            if (!this.socket) {
                return null
            }

            const data = {
                userName: this.userName
            }
            this.socket.emit('setUserName', data)
            this.message = null
        },
        setPlayerId() {
            console.log('test')
        }
    }
}
</script>

<style lang="scss">
.main {
    position: relative;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    .main-container {
        position: relative;
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: row;
        // overflow: hidden;
        .container-left {
            background-color: white;
            position: relative;
            display: inline-block;
            height: 100%;
            width: 50%;
            .container-left-inner {
                position: relative;
                height: 100%;
                width: 100%;
                padding: 2em;
                .line {
                    position: relative;
                    padding: 1em;
                    width: 100%;
                    display: flex;
                    flex-direction: row;
                    .label {
                        display: inline-block;
                        position: relative;
                        width: 20%;
                    }
                    .input {
                        display: inline-block;
                        position: relative;
                        width: 40%;
                    }
                    .btn {
                        display: inline-block;
                        position: relative;
                        width: 30%;
                        text-align: center;
                    }
                }
            }
        }
        .container-right {
            background-color: gray;
            position: relative;
            display: inline-block;
            height: 100%;
            width: 50%;
        }
    }
}
</style>
