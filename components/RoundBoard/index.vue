<template lang="pug">
    .round-board
        .round-board-container
            .round-item(v-for=" roundId in 5")
                .round-item-inner(:class="{ show: historyListStatus[roundId-1] }")
                    .history-list
                        .round-id
                            | R {{roundId}}
                        .history-item(v-for=" recordId in 5" @click="showRecord(recordId, roundId)")
                            | {{recordId}}
                        .arror(@click="activateHistoryList(roundId)")
                            //- | test
                            .arror-down
                                img(src="@/static/icons/down-arror.svg")
                            .arror-up
                                img(src="@/static/icons/up-arror.svg")
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
        showRecord(recordId, roundId) {
            console.log('[showRecord]', recordId, roundId, this.history)
            if (this.history === null) {
                return
            }
            const id = recordId - 1
            this.$set(this.historyListStatus, roundId - 1, 0)
            this.roundData = this.history[i]
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
        background-color: white;
        border-radius: 5px;
        display: grid;
        grid-gap: 0.2em;
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
                    .round-id {
                        color: white;
                        max-width: 4em;
                        border-bottom: 1px solid white;
                    }
                    .history-item {
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
