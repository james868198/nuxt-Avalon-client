<template lang="pug">
    .circle-token
        .circle-token-container
            .circle-token-container-inner( :style="{ 'height': height + 'em', 'width': width + 'em' }", :class="{ border: isBorder }")
                .circle-token-mid
                    .circle-token-mid-inner
                        .message
                            | {{message}}

</template>

<script>
export default {
    name: 'CircleToken',
    props: {
        height: {
            type: Number,
            default: 3
        },
        width: {
            type: Number,
            default: 3
        },
        fontSize: {
            type: Number,
            default: 5
        },
        imgUrl: {
            type: String,
            default: null
        },
        message: {
            type: String,
            default: null
        },
        isBorder: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {}
    },
    // computed: {
    // },
    watch: {},
    methods: {
        // setHeight(size) {
        //     const element = this.$el.querySelector('#chatting')
        // },
        // setWidth(size) {
        //     const element = this.$el.querySelector('#chatting')
        // },
    }
}
</script>

<style lang="scss">
.circle-token {
    position: relative;
    height: 100%;
    width: 100%;

    .circle-token-container {
        position: absolute;
        width: 100%;
        top: 50%;
        transform: translateY(-50%);
        text-align: center;
        .circle-token-container-inner {
            position: relative;
            // height: 3em;
            // width: 3em;
            text-align: center;
            display: inline-block;

            border-radius: 50%;
            background-color: gray;

            .circle-token-mid {
                position: absolute;
                width: 100%;
                top: 50%;
                transform: translateY(-50%);
                text-align: center;
                .circle-token-mid-inner {
                    position: relative;
                    height: 100%;
                    width: 100%;
                    // .message {

                    // }
                }
            }
        }
        .border {
            border: solid;
            border-color: white;
        }
    }
}
</style>
