<template lang="pug">
    .board
        //- el-button(type="info", @click="showModal = true") test
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
                                    .mission-container(v-bind:class="{ success: mission.result == 'success', fail: mission.result == 'fail'}")
                                        .mission-left.right-board2
                                            .id
                                                | {{missionId+1}}
                                        .mission-mid(v-if="history")
                                            .round-list
                                                .round(v-for="(roundRecerd, roundId) in history[missionId]" v-on:click="showRecord(roundRecerd)")
                                                    .vertical-center
                                                        .round-container
                                                            | {{roundId+1}}
        modal(v-if='showModal' @close="closeRecord")
            .modal-header(slot="header")
                | Voting Result
            .modal-body(slot="body")
                hr
                .modal-body-container(v-if='roundData')
                    .leader
                        | Leader: {{roundData.leader+1}}
                    .on-mission(v-if='roundData.onMission')
                        | Players in mission: &nbsp
                        .player(v-for="id in roundData.onMission")
                            | {{id+1}}
                    .vote-results(v-if='roundData.voteResult')
                        .vote-results-top
                            .agree Agree: &nbsp
                            .player(v-for="(result, playerId) in roundData.voteResult" v-if="result == 'T'")
                                | {{playerId+1}}
                        .vote-results-bottom
                            .disagree Disagree: &nbsp
                            .player(v-for="(result, playerId) in roundData.voteResult" v-if="result == 'F'")
                                | {{playerId+1}}
                hr
            .modal-footer(slot="footer")
                el-button(round type="info", @click="closeRecord") Close
</template>

<script>
import CircleToken from '@/components/commons/CircleToken'
import Modal from '@/components/modal'

export default {
    name: 'Board',
    components: {
        CircleToken,
        modal: Modal
    },
    props: {
        missions: {
            type: Array,
            required: true,
            default: () => {
                return null
            }
        },
        history: {
            type: Array,
            required: true,
            default: () => {
                return null
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
        return {
            showModal: false,
            roundData: null
        }
    },
    created() {
        console.log('board created')
    },
    methods: {
        showRecord(roundRecerd) {
            console.log('[showRecord]', roundRecerd)
            this.showModal = true
            this.roundData = roundRecerd
            return
        },
        closeRecord() {
            console.log('[closeRecord]')
            this.showModal = false
            this.roundData = null
            return
        }
    }
}
</script>
<style lang="scss">
$mission-column-height: 3em;
$record-btn-size: 1.5em;
$modal-header-size: 1.5em;
$modal-body-size: 1.2em;
// $board-background-color: #f9fce4;
$board-background-color: #ffffff;

$border-color: #bada55;
$mission-background-noresult: #ffffff;
$background-red: #ff6f6f;
$background-blue: #487ef1;
$background-agree: #51cc6f;

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
                    background-color: $board-background-color;
                    border: 2px solid $border-color;
                    border-radius: 8px;
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
                                background-color: $background-blue;
                                text-align: center;
                            }
                            .score-board-right {
                                position: relative;
                                height: 100%;
                                width: 50%;
                                display: inline-block;
                                background-color: $background-red;
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
                    border: 3px solid $border-color;
                    border-radius: 10px;
                    overflow: hidden;
                    .mission-list {
                        position: relative;
                        height: 100%;
                        width: 100%;
                        display: flex;
                        flex-direction: column;
                        background-color: $board-background-color;
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
                                    background-color: $mission-background-noresult;
                                    border-radius: 10px;
                                    border: 2px solid $border-color;
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
                                                // width: 100%;
                                                display: inline-block;
                                                text-align: center;
                                                margin: 0 auto;
                                                margin-left: 1em;

                                                .round-container {
                                                    position: relative;
                                                    height: $record-btn-size;
                                                    width: $record-btn-size;
                                                    // width: 5px;
                                                    background-color: white;
                                                    border-radius: 5px;
                                                    border: 2px solid
                                                        $border-color;
                                                    overflow: hidden;
                                                    font-size: 1.2em;
                                                    cursor: pointer;
                                                }
                                            }
                                        }
                                    }
                                }
                                .success {
                                    background-color: $background-blue;
                                }
                                .fail {
                                    background-color: $background-red;
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
    border-right: 1px solid #bada55;
}
.right-board2 {
    border-right: 1px solid #bada55;
}
.vertical-center {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
}
.modal-header {
    font-size: $modal-header-size;
}
.modal-body {
    position: relative;
    height: 100%;
    width: 100%;
    text-align: center;
    .modal-body-container {
        position: relative;
        height: 100%;
        width: 100%;
        text-align: left;
        .leader {
            font-size: $modal-body-size;
        }
        .on-mission {
            font-size: $modal-body-size;
        }
        .vote-results {
            font-size: $modal-body-size;
            .vote-results-top {
                position: relative;
                height: 50%;
                width: 100%;
                margin: 0 auto;
            }
            .vote-results-bottom {
                position: relative;
                height: 50%;
                width: 100%;
                margin: 0 auto;
            }
            .agree {
                color: $background-agree;
                display: inline;
            }
            .disagree {
                color: $background-red;
                display: inline;
            }
        }
        .player {
            display: inline;
            margin: 0 auto;
            margin-left: 0.5em;
        }
    }
}
// .modal-footer {
// }
</style>
