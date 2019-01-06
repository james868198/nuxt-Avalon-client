<template lang="pug">
    .board
        .board-container
            .board-container-top
                | game status: {{status}}
            .board-container-mid
                .board-container-mid-inner(v-if="missions")
                    .mission(v-for="mission in missions")
                        .mission-container(v-if="mission")
                            .mission-container-inner.id
                                | {{mission.id}}
                            .mission-container-inner.required-num
                                | {{mission.requiredNum}}
                            .mission-container-inner.bad-tolerance(v-if="mission.badTolerance>0")
                                | {{mission.badTolerance}}
                            .mission-container-inner.history(v-if="mission.history")
                                | {{mission.history}}
                            .mission-container-inner.rounds-history(v-if="mission.roundsHistory")
                                | {{mission.roundsHistory}}
            .board-container-bottom
                .board-container-bottom-inner(v-if="roundInfo")
                    | {{roundInfo}}



</template>

<script>
export default {
    name: 'Board',
    props: {
        missions: {
            type: Array,
            required: true,
            default: () => {
                return []
            }
        },
        roundInfo: {
            type: Object,
            required: true,
            default: () => {
                return null
            }
        },
        status: {
            type: String,
            required: true,
            default: 'waiting'
        }
    },
    data() {
        return {}
    },
    methods: {}
}
</script>
<style lang="scss">
.board {
    position: relative;
    height: 100%;
    width: 100%;
    .board-container {
        position: relative;
        height: 100%;
        width: 100%;
        .board-container-top {
            position: relative;
            height: 10%;
            width: 100%;
            background-color: red;
        }
        .board-container-mid {
            position: relative;
            height: 70%;
            width: 100%;
            background-color: yellow;
            .board-container-mid-inner {
                position: relative;
                height: 100%;
                width: 100%;
                display: flex;
                flex-direction: row;
                .mission {
                    position: relative;
                    height: 100%;
                    width: 20%;
                    display: inline-block;
                    .mission-container {
                        position: relative;
                        height: 100%;
                        width: 100%;
                        display: flex;
                        flex-direction: column;
                        .mission-container-inner {
                            display: inline-block;
                        }
                    }
                }
            }
        }
        .board-container-bottom {
            position: relative;
            height: 20%;
            width: 100%;
            background-color: orange;
            // .board-container-bottom-inner{
            // }
        }
    }
}
</style>
