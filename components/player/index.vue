<template lang="pug">
    .player(v-bind:class="{ selected: onMission }")
        .player-container
            .player-container-inner
                .id
                    | {{id+1}}

                //- .avatar(v-if="avatar")
                //-     | {{avatar}}
                .status
                    //- .dot-online(v-if="status == 'on' ")
                    //- .dot-offline(v-if="status == 'off'")
                    .dot(v-if="status", v-bind:class="{ on: status == 'on', off: status == 'off' }")
                .name
                    | {{name}}
                //- .voted
                //-     | {{voted}}
                //- .onMission
                //-     | {{onMission}}
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
    background-color: white;
    :hover {
        opacity: 0.8;
    }
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
                width: 8%;
                display: inline-block;
                text-align: center;
                font-style: italic;
                font-size: 1.5em;
            }
            .status {
                position: relative;
                height: 100%;
                width: 10%;
                display: inline-block;
                .dot {
                    position: absolute;
                    top: 5px;
                    // transform: translateY(-50%);
                    border-radius: 50%;
                    height: 15px;
                    width: 15px;
                    display: inline-block;
                }
                .on {
                    background-color: green;
                }
                .off {
                    background-color: red;
                }
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
                width: 50%;
                display: inline-block;
                text-align: center;
                font-size: 1.5em;
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
                width: 20%;
                display: inline-block;
            }
        }
    }
}
.selected {
    background: orange;
}
</style>
