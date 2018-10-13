<template lang="pug">
    main
        .container
            el-row.container-top
                el-col.text(:span="16")
                    | {{message}}
            el-row.container-bottom
                el-input(v-model="message")
</template>

<script>
import socket from '~/plugins/socket.io.js'

var username = 'test'
socket.emit('test', username)

export default {
    name: 'Index',
    data() {
        return {
            chatContent: [],
            message: null
        }
    }
    // computed: {

    // },
    // watch: {

    // },
    // created() {

    // },
    // methods: {

    // }
}
</script>

<style lang="scss">
.container {
    background-color: red;
    height: 100vh;
    word-break: break-all;

    .container-top {
        background-color: blue;
        height: 50vh;
        word-break: break-all;
    }
    .container-bottom {
        background-color: green;
        height: 50vh;
        word-break: break-all;
    }
}

text {
    position: relative;
    word-break: break-all;
}
</style>
