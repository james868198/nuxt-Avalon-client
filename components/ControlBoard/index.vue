<template lang="pug">
    .control-board
        .control-board-top
            .control-board-top-container
                .select-board
                    .select-board-container
                        .select-item(v-for="i in 10"  :class="{active: i<=numOfPlayers}")
                            .select-item-inner
                                | {{i}}
                .choice-board
                    .choice-board-container
                        .choice-item.agree
                            .choice-item-inner
                                img(src="@/static/icons/like.svg")
                        .choice-item.disagree
                            .choice-item-inner
                                img(src="@/static/icons/dislike.svg")
        .control-board-bottom
            .control-board-bottom-container
                .control-bar
                    .control-item(v-for="btn in btnList" @click="action(btn)")
                        .control-item-inner
                            | {{btn}}

</template>

<script>
import CircleToken from '@/components/commons/CircleToken'
// import Modal from '@/components/modal'

export default {
    name: 'ControlBoard',
    components: {
        CircleToken
    },
    props: {
        stage: {
            type: String,
            default: null
        },
        numOfPlayers: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            playerSelectionStatus: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            voteStatus: [0, 0],
            actionStatus: [0, 0],
            btnList: ['quest', 'vote', 'action', 'assassinate']
        }
    },
    watch: {},
    created() {
        console.log('Control board created')
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

.control-board {
    position: relative;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    .control-board-top {
        position: relative;
        height: 70%;
        width: 100%;
        display: inline-block;
        .control-board-top-container {
            position: relative;
            height: 100%;
            width: 100%;
            display: flex;
            flex-direction: row;
            .select-board {
                position: relative;
                height: 100%;
                width: 70%;
                display: inline-block;
                text-align: center;
                .select-board-container {
                    position: relative;
                    height: 100%;
                    width: 90%;
                    margin: 0 auto;
                    display: grid;
                    grid-template-columns: repeat(5, 1fr);
                    grid-template-rows: repeat(2, 1fr);
                    justify-items: center;
                    align-items: center;
                    text-align: center;
                    border-radius: 10px;
                    .select-item {
                        height: 76%;
                        width: 80%;
                        // border: 1px solid color(blue);
                        color: black;
                        background-color: color(gray-3);
                        border-radius: 5px;
                        cursor: pointer;
                        &:hover {
                            opacity: 0.6;
                        }
                        .select-item-inner {
                            padding-top: 0.2em;
                            font-size: 2em;
                            // position: absolute;
                            // width: 100%;
                            // top: 50%;
                            // transform: translateY(-50%);
                            // text-align: center;
                        }
                    }
                }
            }
            .choice-board {
                position: relative;
                height: 100%;
                width: 30%;
                display: inline-block;
                text-align: center;
                .choice-board-container {
                    position: relative;
                    height: 100%;
                    width: 90%;
                    margin: 0 auto;
                    display: grid;
                    // grid-gap: 1em;
                    grid-template-columns: repeat(2, 1fr);
                    justify-items: center;
                    align-items: center;
                    text-align: center;
                    .choice-item {
                        color: black;
                        border: 2px solid color(black);
                        height: 80%;
                        width: 60%;

                        border-radius: 10px;
                        box-shadow: 3px 4px;
                        cursor: pointer;
                        &:hover {
                            opacity: 0.6;
                        }
                        .choice-item-inner {
                            padding-top: 2em;
                            img {
                                max-height: 3em;
                                max-width: 2em;
                            }
                        }
                    }
                    .agree {
                        background-color: color(blue-1);
                    }
                    .disagree {
                        background-color: color(red-1);
                    }
                }
            }
        }
    }
    .control-board-bottom {
        position: relative;
        height: 30%;
        width: 100%;
        display: inline-block;
        .control-board-bottom-container {
            position: relative;
            height: 100%;
            width: 100%;
            text-align: center;
            .control-bar {
                position: relative;
                height: 100%;
                width: 80%;
                margin: 0 auto;
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                justify-items: center;
                text-align: center;
                align-self: center;
                background-color: color(gray-3);
                border-radius: 10px;
                .control-item {
                    height: 100%;
                    width: 100%;
                    .control-item-inner {
                        padding-top: 0.2em;
                        color: white;
                        font-size: 1.8em;
                    }
                    cursor: pointer;
                    &:hover {
                        opacity: 0.6;
                    }
                }
            }
        }
    }
}
@media screen and (max-width: 700px) {
    .control-board {
        .control-board-top {
            height: 80%;
            .control-board-top-container {
                .choice-board {
                    .choice-board-container {
                        grid-template-columns: none;
                        grid-template-rows: repeat(2, 1fr);
                        .choice-item {
                            height: 60%;
                            width: 40%;
                            .choice-item-inner {
                                padding-top: 1em;
                                img {
                                    max-height: 2em;
                                    max-width: 1.5em;
                                }
                            }
                        }
                    }
                }
            }
        }
        .control-board-bottom {
            height: 20%;
            .control-board-bottom-container {
                .control-bar {
                    .control-item {
                        .control-item-inner {
                            font-size: 1.4em;
                        }
                    }
                }
            }
        }
    }
}
</style>
