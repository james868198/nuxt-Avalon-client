<template lang="pug">
    .chatroom
        .chatroom-container
            .chatroom-container-inner
                .chatroom-container-top
                    #chatting.message-list
                        .message-list-inner
                            .message(v-for="chat in chatting")
                                .message-continaer
                                    .user
                                        | {{chat.userName}}
                                    .message
                                        | {{chat.message}}

                .chatroom-container-bottom(@keyup.enter="sendMessage")
                    .dialog(v-if="name")
                        .input
                            input(v-model="message", type="text", placeholder="Write here!")


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
    updated() {
        this.$nextTick(() => {
            this.toBottom()
        })
    },
    methods: {
        sendMessage() {
            this.$emit('message', this.message)
            this.message = null
        },
        toBottom() {
            const element = this.$el.querySelector('#chatting')
            console.log(element.scrollHeight)
            element.scrollTop = element.scrollHeight + 100
        }
    }
}
</script>

<style lang="scss">
@import '../../styles/variables/index.scss';

.chatroom {
    position: relative;
    height: 100%;
    width: 100%;

    background-color: color(gray-1);

    .chatroom-container {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        height: 92%;
        width: 100%;
        text-align: center;
        .chatroom-container-inner {
            position: relative;
            height: 100%;
            width: 100%;
            display: flex;
            flex-direction: column;

            .chatroom-container-top {
                display: inline-block;
                position: relative;
                height: 85%;
                width: 100%;
                .message-list {
                    position: relative;
                    height: 100%;
                    width: 100%;
                    overflow: scroll;
                    .message-list-inner {
                        position: relative;
                        width: 100%;
                        .message {
                            position: relative;
                            width: 100%;

                            .message-continaer {
                                font-size: 1.2em;
                                word-wrap: break-word;
                                display: flex;
                                flex-direction: column;
                                min-height: 40px;
                                color: color(white);
                                padding-left: 0.2em;
                                .user {
                                    display: inline-block;
                                    font-size: 1.2em;
                                    text-align: left;
                                    color: color(green);
                                }
                                .message {
                                    display: inline-block;
                                    text-align: left;
                                    opacity: 0.8;
                                    padding-left: 0.4em;
                                }
                                &:hover {
                                    background-color: color(gray-2);
                                    opacity: 0.5;
                                }
                            }
                        }
                    }
                }
            }
            .chatroom-container-bottom {
                display: inline-block;
                position: relative;
                height: 15%;
                width: 100%;
                .dialog {
                    position: relative;
                    height: 100%;
                    width: 100%;
                    text-align: center;
                    .input {
                        position: relative;
                        width: 98%;
                        height: 100%;
                        display: inline-block;
                        input[type='text'] {
                            padding: 12px 20px;
                            margin: 3px 0;
                            position: relative;
                            height: 96%;
                            width: 100%;
                            box-sizing: border-box;
                            color: color(white);
                            background-color: color(gray-2);
                            border-radius: 15px;
                            border: 0;
                            &:focus {
                                border: 0;
                                outline: none;
                            }
                        }
                        ::placeholder {
                            color: color(green);
                        }
                        ::-webkit-input-placeholder {
                            /* Edge */
                            color: color(green);
                        }

                        :-ms-input-placeholder {
                            /* Internet Explorer 10-11 */
                            color: color(green);
                        }
                    }
                }
            }
        }
    }
}
</style>
