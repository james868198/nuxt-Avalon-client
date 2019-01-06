<template lang="pug">
    .chatroom
        .chatroom-container
            .chatroom-container-inner
                .container-top
                    #chatting.chatroom-message
                        ul.chatroom-message-inner
                            li.chatroom-message.sentence(v-for="chat in chatting")
                                .user
                                    | {{chat.userName}}:
                                .message
                                    | &nbsp{{chat.message}}
                .container-bottom(@keyup.enter="sendMessage")
                    .dialog(v-if="name")
                        .input
                            .vertical-center
                                el-input(v-model="message", type="textarea", placeholder="Write here!")


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
            this.$emit('message', this.message)
            this.message = null
        },
        toBottom() {
            const element = this.$el.querySelector('#chatting')
            console.log(element)
            element.scrollTop = element.scrollHeight
        }
    }
}
</script>

<style lang="scss">
.chatroom {
    position: relative;
    height: 100%;
    width: 100%;
    text-align: left;
    max-width: 30em;
    min-width: 20em;
    text-align: right;
    background-color: gray;
    .chatroom-container {
        position: relative;
        height: 100%;
        width: 99%;
        display: inline-block;
        background-color: white;
        .chatroom-container-inner {
            position: relative;
            height: 100%;
            width: 100%;
            display: flex;
            flex-direction: column;
            text-align: left;
            .container-top {
                display: inline-block;
                position: relative;
                height: 85%;
                width: 100%;
                .chatroom-message {
                    position: relative;
                    height: 100%;
                    width: 100%;
                    overflow: scroll;
                    .chatroom-message-inner {
                        list-style-type: none;
                        margin: 0% auto;
                        padding-left: 1em;
                        padding-right: 1em;
                        .chatroom-message.sentence {
                            font-size: 1.5em;
                            word-wrap: break-word;
                            .user {
                                display: inline;
                                opacity: 0.7;
                            }
                            .message {
                                display: inline;
                            }
                        }
                    }
                }
            }
            .container-bottom {
                display: inline-block;
                position: relative;
                height: 15%;
                width: 100%;
                background-color: #f8f8ff;
                .dialog {
                    position: relative;
                    height: 100%;
                    width: 100%;
                    text-align: center;
                    .input {
                        position: relative;
                        width: 80%;
                        height: 100%;
                        display: inline-block;
                    }
                }
            }
        }
    }
}
</style>
