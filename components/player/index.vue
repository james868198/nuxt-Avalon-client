<template lang="pug">
    .player
        .player-container
            .player-container-inner
                .id
                    | {{id}}
                .status
                    | {{status}}
                .avatar(v-if="avatar")
                    | {{avatar}}
                .name
                    | {{name}}
                .voted
                    | {{voted}}
                .onMission
                    | {{onMission}}
</template>

<script>
import CircleToken from '@/components/commons/CircleToken'

export default {
    name: 'Player',
    components: {
        playerToken: CircleToken
    },
    props: {
        name: {
            type: String,
            default: null
        },
        id: {
            type: Number,
            default: null
        },
        status: {
            type: String,
            default: null
        },
        onMission: {
            type: Boolean,
            default: null
        },
        voted: {
            type: Boolean,
            default: null
        },
        avatar: {
            type: String,
            default: null
        }
    },
    data() {
        return {}
    },
    // computed: {
    // },
    watch: {},
    methods: {}
}
</script>

<style lang="scss">
.player {
    position: relative;
    height: 100%;
    width: 100%;
    .player-container {
        position: absolute;
        width: 100%;
        top: 50%;
        transform: translateY(-50%);
        text-align: center;
        .player-container-inner {
            position: relative;
            height: 100%;
            width: 100%;
            display: flex;
            flex-direction: row;
            .id {
                position: relative;
                height: 100%;
                width: 5%;
                display: inline-block;
            }
            .status {
                position: relative;
                height: 100%;
                width: 5%;
                display: inline-block;
            }
            .avatar {
                position: relative;
                height: 100%;
                width: 20%;
                display: inline-block;
            }
            .name {
                position: relative;
                height: 100%;
                width: 20%;
                display: inline-block;
            }
            .voted {
                position: relative;
                height: 100%;
                width: 10%;
                display: inline-block;
            }
            .onMission {
                position: relative;
                height: 100%;
                width: 10%;
                display: inline-block;
            }
        }
    }
}
</style>
