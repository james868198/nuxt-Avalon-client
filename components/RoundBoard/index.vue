<template lang="pug">
    .round-board
        .round-board-container
            .round-item(v-for=" (mission, roundId) in missions")
                .round-item-inner(:class="{ show: historyListStatus[roundId]}")
                    .history-list(:class="{ success: mission.result === 'success', fail: mission.result === 'fail'}")
                        .round-id(:class="{now : missionId === roundId}")
                            | R {{roundId+1}} | {{mission.NumOnMission}}
                        .history-item(v-for=" (record, recordId) in history[roundId]" @click="showRecord(record, roundId)")
                            | {{recordId+1}}
                        .arror(@click="activateHistoryList(roundId+1)")
                            //- | test
                            .arror-down
                                img(src="@/static/icons/down-arror.svg")
                            .arror-up
                                img(src="@/static/icons/up-arror.svg")
                    .shield(v-if="mission.badTolerance>0")
                        img(src="@/static/icons/shield.svg")
                    .fail-counter(v-if="mission.failCounter>0")
                        .fail-counter-inner
                            | {{mission.failCounter}}
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
                            .player(v-for="(result, playerId) in roundData.voteResult" v-if="result == 'N'")
                                | {{playerId+1}}
                hr
            .modal-footer(slot="footer")
                el-button(round type="info", @click="closeRecord") Close
</template>

<script>
import CircleToken from '@/components/commons/CircleToken'
import Modal from '@/components/modal'

export default {
    name: 'RoundBoard',
    components: {
        CircleToken,
        modal: Modal
    },
    // directives: {
    //     clickout: {
    //         bind: (el, binding, vNode) => {
    //             // Provided expression must evaluate to a function.
    //             console.log('binding:', typeof binding.value)
    //             if (typeof binding.value !== 'function') {
    //                 const compName = vNode.context.name
    //                 let warn = `[Vue-click-outside:] provided expression '${
    //                     binding.expression
    //                 }' is not a function, but has to be`
    //                 if (compName) {
    //                     warn += `Found in component '${compName}'`
    //                 }
    //                 console.warn(warn)
    //             }
    //             // Define Handler and cache it on the element
    //             const bubble = binding.modifiers.bubble
    //             const handler = e => {
    //                 console.log('handler el', el, e.target, bubble)
    //                 if (bubble || (!el.contains(e.target) && el !== e.target)) {
    //                     console.log('binding handler', binding)
    //                     binding.value(e)
    //                 }
    //             }
    //             el.__vueClickOutside__ = handler

    //             // add Event Listeners
    //             document.addEventListener('click', handler)
    //         },

    //         unbind: (el, binding) => {
    //             // Remove Event Listeners
    //             document.removeEventListener('click', el.__vueClickOutside__)
    //             el.__vueClickOutside__ = null
    //         }
    //     }
    // },
    props: {
        missionId: {
            type: Number,
            default: null
        },
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
        }
    },
    data() {
        return {
            showModal: false,
            roundData: null,
            historyListStatus: [0, 0, 0, 0, 0],
            openStatus1: true
        }
    },
    watch: {},
    created() {
        console.log('board created')
    },

    methods: {
        showRecord(record, roundId) {
            console.log('[showRecord]', record)
            if (record == null || roundId == null) {
                return
            }
            // if (roundId <= 0 || roundId > this.missions.length) {
            //     return
            // }
            // if (recordId <= 0 || recordId > this.history[roundId - 1].length) {
            //     return
            // }
            this.$set(this.historyListStatus, roundId, 0)
            this.roundData = record
            this.showModal = true
            return
        },
        closeRecord() {
            console.log('[closeRecord]')
            this.showModal = false
            this.roundData = null
            return
        },
        activateHistoryList(roundId) {
            console.log('[activateHistoryList]', roundId)
            if (this.historyListStatus[roundId - 1] === 0) {
                this.$set(this.historyListStatus, roundId - 1, 1)
            } else {
                this.$set(this.historyListStatus, roundId - 1, 0)
            }
        },
        closeHistoryList(roundId) {
            console.log('[closeHistoryList]')
            // this.$set(this.historyListStatus, roundId - 1, 0)
            this.historyListStatus = [0, 0, 0, 0, 0]
        }
    }
}
</script>
<style lang="scss">
@import '@/styles/variables/index.scss';

$history-item-size: 3em;
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

.round-board {
    .round-board-container {
        position: relative;
        height: 100%;
        width: 100%;
        background-color: color(white);
        border-radius: 5px;
        display: grid;
        grid-gap: 0.6em;
        grid-template-columns: repeat(5, 1fr);
        .round-item {
            align-self: center;
            .round-item-inner {
                position: relative;
                height: 3em;
                max-width: 5em;
                // background-color: blue;
                font-size: 1em;
                // border: 1px solid blue;
                margin: 0 auto;
                // border-radius: 5px;
                .shield {
                    position: absolute;
                    top: -1em;
                    right: -1em;
                    background-color: color(orange);
                    border-radius: 50%;
                    border: 2px solid color(black);
                    text-align: center;

                    padding: 0.2em 0.3em 0 0.3em;

                    z-index: 9999;
                    img {
                        max-width: 1em;
                        max-height: 1em;
                    }
                }
                .fail-counter {
                    position: absolute;
                    right: -1em;
                    bottom: -1em;
                    background-color: color(red);
                    border-radius: 50%;
                    border: 2px solid color(black);
                    text-align: center;

                    // padding: 4px 4px 0 4px;
                    padding: 0 0.4em 0 0.4em;

                    z-index: 999;
                    .fail-counter-inner {
                        // font-size: 1.2em;
                    }
                }
                .history-list {
                    position: absolute;
                    top: 0;
                    overflow: hidden;
                    height: $history-item-size;
                    width: 100%;
                    background-color: color(gray-2);
                    transition: height 0.5s;
                    z-index: 999;
                    display: grid;
                    grid-gap: 0.2em;
                    grid-template-rows: repeat(6, $history-item-size);
                    text-align: center;
                    justify-items: center;
                    align-items: center;
                    border-radius: 5px;
                    border: 1px solid color(black);

                    font-weight: bold;
                    .round-id {
                        font-size: 1.2em;
                        color: white;
                        max-width: 4em;
                        border-bottom: 1px solid white;
                    }
                    .round-id.now {
                        color: color(orange);
                        border-color: color(orange);
                    }
                    .history-item {
                        font-size: 1.2em;
                        display: inline-block;
                        margin: 0 auto;
                        color: white;
                        max-width: 4em;
                        border-bottom: 1px solid white;
                        cursor: pointer;
                    }
                    .arror {
                        position: absolute;
                        bottom: 0;
                        height: 3em;
                        width: 100%;
                        opacity: 0;
                        background-color: color(gray-3);
                        cursor: pointer;
                        img {
                            bottom: 0;
                            max-height: 1em;
                            max-width: 3em;
                        }
                        .arror-up {
                            display: none;
                        }
                    }
                    &:hover {
                        .arror {
                            opacity: 0.5;
                        }
                    }
                }
                .history-list.success {
                    border: 5px solid color(blue);
                }
                .history-list.fail {
                    border: 5px solid color(red);
                }
                &.show {
                    .history-list {
                        height: 20em;
                        .arror {
                            height: 1em;
                            .arror-down {
                                display: none;
                            }
                            .arror-up {
                                display: block;
                            }
                        }
                    }
                }
            }
        }
    }
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
