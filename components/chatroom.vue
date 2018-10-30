<template lang="pug">
    .chatroom
        .chatroom-container
            .container-top
                #chatting.chatroom-message
                    ul.chatroom-message-inner
                        li(v-for="chat in chatting")
                            | {{chat.userName}}:
                            | {{chat.message}}
            .container-bottom(@keyup.enter="sendMessage")
                .dialog(v-if="name")
                    .input
                        .vertical-center
                            el-input(v-model="message")
                    .btn
                        .vertical-center
                            el-button(type="info", @click="sendMessage") enter

</template>

<script>
// import { io, Socket } from '~/plugins/socket.io.js'

export default {
    name: 'Chatroom',
    props: {
        chatting: {
            type: Array,
            required: true,
            default: null
        },
        name: {
            type: String,
            default: null
        }
    },
    data() {
        return {
            message: null
        }
    },
    watch: {
        chatting(newVal, oldVal) {
            this.toBottom()
        }
    },
    methods: {
        sendMessage() {
            const data = {
                userName: this.name,
                message: this.message
            }
            this.$emit('chat', data)
            this.message = null
        },
        toBottom() {
            const element = this.$el.querySelector('#chatting')
            element.scrollTop = element.scrollHeight
        }
    }
}
</script>

<style lang="scss">
.chatroom {
    background-color: gray;
    position: relative;
    height: 100%;
    width: 100%;
    text-align: left;
    .chatroom-container {
        position: relative;
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        .container-top {
            display: inline-block;
            position: relative;
            height: 85%;
            width: 100%;
            padding-top: 1em;
            .chatroom-message {
                position: relative;
                height: 100%;
                width: 100%;
                overflow: scroll;
                .chatroom-message-inner {
                    list-style-type: none;
                    color: white;
                    font-size: 1.5em;
                }
            }
        }
        .container-bottom {
            display: inline-block;
            position: relative;
            height: 15%;
            width: 100%;
            background-color: #f8f8ff;
            padding-left: 1em;
            padding-right: 1em;
            .dialog {
                position: relative;
                height: 100%;
                width: 100%;
                display: flex;
                flex-direction: row;
                .input {
                    position: relative;
                    width: 50%;
                    height: 100%;
                    display: inline-block;
                }
                .btn {
                    position: relative;
                    width: 50%;
                    height: 100%;
                    display: inline-block;
                    text-align: center;
                }
            }
        }
    }
}
</style>
