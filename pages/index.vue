<template lang="pug">
    .main
        .main-container
            .container-left
                .container-left-inner
                    .line
                        .label
                            .label-inner
                                | Player ID
                        .input
                            el-input(v-model="playerId")
                        .btn
                            el-button(type="info", @click="setPlayerName") enter
                    //- .line
                    //-     .label
                    //-         .label-inner
                    //-             | create room
                    //-     .input
                    //-         el-input(v-model="roomName")
                    //-     .btn
                    //-         el-button(type="info", @click="createGame") enter
                    //- .line
                    //-     .label
                    //-         .label-inner
                    //-             | join room
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
                .line {
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
