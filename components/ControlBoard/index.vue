<template lang="pug">
    .control-board
        .control-board-top
            .control-board-top-container
                .select-board
                    .select-board-container
                        .select-item(v-for="itemId in numOfPlayers" :class="{selected: selectedStatus[itemId-1] === 1 }" @click="select(itemId)")
                            .select-item-inner
                                | {{itemId}}
                .choice-board
                    .choice-board-container
                        .choice-item.agree(:class="{selected: voteStatus === 1}" @click="agree(1)")
                            .choice-item-inner
                                img(src="@/static/icons/like-blue.svg")
                        .choice-item.disagree(:class="{selected: voteStatus === 0}" @click="agree(0)")
                            .choice-item-inner
                                img(src="@/static/icons/dislike-red.svg")
        .control-board-bottom
            .control-board-bottom-container
                .control-bar
                    .control-item(v-for="(btn,btnId) in btnList" @click="action(btn)")
                        img(src="@/static/icons/fist.svg" v-show="btn == 'quest'")
                        img(src="@/static/icons/like.svg" v-show="btn == 'vote'")
                        img(src="@/static/icons/flag.svg" v-show="btn == 'action'")
                        img(src="@/static/icons/sword.svg" v-show="btn == 'assassinate'")
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
        selectionNumber: {
            type: Number,
            default: null
        },
        numOfPlayers: {
            type: Number,
            default: null
        }
    },
    data() {
        return {
            selectedStatus: Array(10).fill(0),
            numberOfSelection: 0,
            voteStatus: -1,
            actionStatus: -1,
            btnList: ['quest', 'vote', 'action', 'assassinate']
        }
    },
    watch: {},
    created() {
        console.log('Control board created')
    },

    methods: {
        action(type) {
            console.log('[action]', type, this.stage)
            switch (type) {
                case 'quest':
                    if (this.stage !== 'questing') {
                        return
                    }
                    if (this.numberOfSelection == 0) {
                        alert('You need to select enough players!')
                        return
                    }
                    const selection = []
                    this.selectedStatus.forEach((status, index) => {
                        if (status === 1) {
                            selection.push(index)
                        }
                    })
                    this.resetSelection()
                    this.numberOfSelection = 0
                    this.$emit('quest', selection)
                    break
                case 'vote':
                    if (this.stage !== 'voting') {
                        return
                    }
                    let voteResult = 1
                    if (this.voteStatus === 0) {
                        voteResult = 0
                    }
                    this.voteStatus = -1
                    this.$emit('vote', voteResult)
                    break
                case 'action':
                    if (this.stage !== 'action') {
                        return
                    }
                    let actionResult = 1
                    if (this.voteStatus === 0) {
                        actionResult = 0
                    }
                    this.voteStatus = -1
                    this.$emit('action', actionResult)
                    break
                case 'assassinate':
                    let target = 0
                    if (this.stage !== 'assassinating') {
                        this.resetSelection()
                        return
                    }
                    for (let i = 0; i < this.selectedStatus.length; i++) {
                        if (this.selectedStatus[i] === 1) {
                            target = i
                            break
                        }
                    }
                    this.resetSelection()
                    this.$emit('assassinate', target)
                    break
                default:
                    break
            }
        },
        select(itemId) {
            console.log('[select]', itemId)
            if (this.selectedStatus[itemId - 1] == 0) {
                if (this.numberOfSelection >= this.selectionNumber) {
                    console.log('[select] amount over limit')
                    return
                }
                this.$set(this.selectedStatus, itemId - 1, 1)
                this.numberOfSelection++
            } else {
                this.$set(this.selectedStatus, itemId - 1, 0)
                this.numberOfSelection--
            }
        },
        agree(status) {
            console.log(typeof status)
            if (status !== 0 && status !== 1) {
                return
            }
            if (this.voteStatus === status) {
                this.voteStatus = -1
            } else {
                this.voteStatus = status
            }
            console.log(this.voteStatus)
        },
        resetSelection() {
            this.selectedStatus = Array(10).fill(0)
            this.numberOfSelection = 0
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
                        background-color: color(white);
                        border-radius: 5px;
                        border: 1px solid color(black);
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
                    .selected {
                        color: color(orange);
                        border: 3px solid color(orange);
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
                        border: 1px solid color(black);
                        background-color: color(white);
                        box-shadow: 3px 4px;
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
                    }
                    .disagree {
                    }
                    .agree.selected {
                        background-color: color(blue);
                    }
                    .disagree.selected {
                        background-color: color(red);
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
                align-items: center;
                justify-items: center;
                background-color: color(gray-4);
                border-radius: 10px;
                .control-item {
                    // height: 100%;
                    width: 100%;
                    text-align: center;
                    // border-right: 2px solid color(black);
                    img {
                        max-height: 1.4em;
                        max-width: 1.4em;
                    }
                    .control-item-inner {
                        padding-left: 0.2em;
                        padding-right: 0.6em;
                        // color: white;
                        font-size: 1.6em;
                        display: inline;
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
                    width: 100%;
                    .control-item {
                        img {
                            max-height: 1.8em;
                            max-width: 1.8em;
                        }
                        .control-item-inner {
                            // font-size: 1em;
                            display: None;
                        }
                    }
                }
            }
        }
    }
}
</style>
