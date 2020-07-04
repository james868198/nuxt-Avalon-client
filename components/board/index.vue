<template lang="pug">
    .board
        .board-container
            .board-container-top
                .info-board(v-if="data")
                    .info-board-inner
                        .info-board-top.info-board-block
                            .info-board-top-inner
                                .info-board-top-left
                                    | Stage
                                .info-board-top-right.stage
                                    | {{data.stage}}
                        .info-board-mid.board-block
                            .info-board-mid-inner
                                .info-board-mid-left
                                    | Leader
                                .info-board-mid-right.leader(v-if="info")
                                    | {{info.leader}}
                        .info-board-bottom.board-block
                            .score-board
                                .score-board-left
                                    | {{data.successCounter}}
                                .score-board-right
                                    | {{data.failCounter}}
            .board-container-bottom
                .mission-board
                    .mission-board-inner
                        .mission-list(v-if="missions")
                            .mission(v-for="(mission, missionId) in missions")
                                .mission-inner
                                    .mission-container
                                        .mission-left.right-board2
                                            .id
                                                | {{missionId+1}}
                                        .mission-mid(v-if="history")
                                            .round-list
                                                .round(v-for="(voteRecerd, roundId) in history[missionId]" v-on:click="showHistory(voteRecerd)")
                                                    .vertical-center
                                                        .round-container
                                                            | {{roundId+1}}
                                        //- .mission-right






</template>

<script>
import CircleToken from '@/components/commons/CircleToken'

export default {
    name: 'Board',
    components: {
        CircleToken
    },
    props: {
        missions: {
            type: Array,
            required: true,
            default: () => {
                return []
            }
        },
        history: {
            type: Array,
            required: true,
            default: () => {
                return []
            }
        },
        info: {
            type: Object,
            default: () => {
                return null
            }
        },
        data: {
            type: Object,
            default: () => {
                return null
            }
        }
    },
    data() {
        return {}
    },
    created() {
        console.log('board created')
    },
    methods: {
        showHistory(history) {
            console.log('[showHistory]', history)
            return
        }
    }
}
</script>
<style lang="scss">
$mission-column-height: 3em;
$record-btn-size: 2em;

.board {
    position: relative;
    height: 100%;
    width: 100%;
    text-align: center;
    .board-container {
        position: relative;
        height: 100%;
        width: 100%;
        .board-container-top {
            position: relative;
            height: 20%;
            width: 100%;
            text-align: center;
            .info-board {
                position: relative;
                height: 100%;
                width: 50%;
                margin: 0 auto;
                .info-board-inner {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    height: 80%;
                    // min-height: 5em;
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    text-align: center;
                    background-color: #dbe5e6;
                    border: 3px solid #bada55;
                    border-radius: 10px;
                    overflow: hidden;
                    .info-board-top {
                        position: relative;
                        height: 34%;
                        width: 100%;
                        display: inline-block;

                        .info-board-top-inner {
                            position: relative;
                            height: 100%;
                            width: 100%;
                            display: inline-flex;
                            flex-direction: row;
                            .info-board-top-left {
                                position: relative;
                                height: 100%;
                                width: 50%;
                                display: inline-block;
                                text-align: center;
                            }
                            .info-board-top-right {
                                position: relative;
                                height: 100%;
                                width: 50%;
                                display: inline-block;
                                text-align: center;
                                .stage {
                                    position: relative;
                                    height: 100%;
                                    width: 100%;
                                }
                            }
                        }
                    }
                    .info-board-mid {
                        position: relative;
                        height: 33%;
                        width: 100%;
                        display: inline-block;
                        .info-board-mid-inner {
                            position: relative;
                            height: 100%;
                            width: 100%;
                            display: inline-flex;
                            flex-direction: row;
                            .info-board-mid-left {
                                position: relative;
                                height: 100%;
                                width: 50%;
                                display: inline-block;
                                text-align: center;
                            }
                            .info-board-mid-right {
                                position: relative;
                                height: 100%;
                                width: 50%;
                                display: inline-block;
                                text-align: center;
                                .leader {
                                    position: relative;
                                    height: 100%;
                                    width: 100%;
                                }
                            }
                        }
                    }
                    .info-board-bottom {
                        position: relative;
                        height: 33%;
                        width: 100%;
                        display: inline-block;
                        text-align: center;
                        .score-board {
                            position: relative;
                            height: 100%;
                            width: 100%;
                            color: white;
                            display: inline-flex;
                            flex-direction: row;
                            .score-board-left {
                                position: relative;
                                height: 100%;
                                width: 50%;
                                display: inline-block;
                                background-color: blue;
                                text-align: center;
                            }
                            .score-board-right {
                                position: relative;
                                height: 100%;
                                width: 50%;
                                display: inline-block;
                                background-color: red;
                                text-align: center;
                            }
                        }
                    }
                }
            }
        }
        .board-container-bottom {
            position: relative;
            height: 85%;
            width: 100%;
            text-align: center;
            .mission-board {
                position: relative;
                height: 100%;
                width: 80%;
                margin: 0 auto;
                .mission-board-inner {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    height: 90%;
                    // min-height: 18em;
                    width: 100%;
                    border: 3px solid #bada55;
                    border-radius: 10px;
                    overflow: hidden;
                    .mission-list {
                        position: relative;
                        height: 100%;
                        width: 100%;
                        display: flex;
                        flex-direction: column;
                        background-color: #dbe5e6;
                        .mission {
                            position: relative;
                            height: 20%;
                            width: 100%;
                            min-height: 2.5em;
                            .mission-inner {
                                position: absolute;
                                top: 50%;
                                transform: translateY(-50%);
                                // height: 90%;
                                width: 100%;
                                text-align: center;
                                .mission-container {
                                    position: relative;
                                    height: $mission-column-height;
                                    // min-height: $mission-column-height;
                                    width: 90%;
                                    margin: 0 auto;
                                    display: flex;
                                    flex-direction: row;
                                    background-color: #e0e0e0;
                                    border-radius: 10px;
                                    border: 3px solid #bada55;
                                    overflow: hidden;
                                    .mission-left {
                                        position: relative;
                                        height: 100%;
                                        width: 15%;
                                        display: inline-block;
                                        margin: 0 auto;
                                        .id {
                                            font-size: 2.4em;
                                            // color: white;
                                        }
                                    }
                                    .mission-mid {
                                        position: relative;
                                        height: 100%;
                                        width: 85%;
                                        display: inline-block;
                                        .round-list {
                                            position: relative;
                                            height: 100%;
                                            width: 100%;
                                            display: flex;
                                            flex-direction: row;
                                            .round {
                                                position: relative;
                                                height: 100%;
                                                width: 100%;
                                                display: inline-block;
                                                text-align: center;
                                                margin-left: 0.5em;
                                                .round-container {
                                                    position: relative;
                                                    height: $record-btn-size;
                                                    width: $record-btn-size;
                                                    // width: 5px;
                                                    background-color: white;
                                                    border-radius: 5px;
                                                    border: 1px solid #bada55;
                                                    overflow: hidden;
                                                    font-size: 1em;
                                                    cursor: pointer;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
.right-board1 {
    border-right: 3px solid #bada55;
}
.right-board2 {
    border-right: 3px solid #bada55;
}
.vertical-center {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
}
</style>
