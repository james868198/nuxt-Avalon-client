<template lang="pug">
    .chatroom
        .chatroom-container
            .container-top
                ul.chatroom-message
                    li(v-for="chat in chatting")
                        | {{chat.userName}}:
                        | {{chat.message}}
            .container-bottom(@keyup.enter="SendMessage")
                el-row(v-if="name")
                    el-col.input(:span="20")
                        el-input(v-model="message")
                    el-col.btn(:span="4")
                        el-button(type="info", @click="SendMessage") enter

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
    methods: {
        SendMessage() {
            const data = {
                userName: this.name,
                message: this.message
            }
            this.$emit('chat', data)
            this.message = null
        }
    }
}
</script>

<style lang="scss">
.chatroom {
    position: relative;
    height: 100%;
    width: 100%;
    display: block;
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
            height: 90%;
            width: 100%;
            .chatroom-message {
                list-style-type: none;
                color: white;
            }
        }
        .container-bottom {
            display: inline-block;
            position: relative;
            height: 10%;
            width: 100%;

            .input {
                padding: 0.1em;
            }
            .btn {
                padding: 0.1em;
            }
        }
    }
}
</style>
