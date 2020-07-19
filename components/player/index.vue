<template lang="pug">
    //- .player(v-if="data" v-bind:class="{ selected: data.onMission }")
    .player(v-if="data")
        .player-container
            .player-container-inner
                .player-container-item.id
                    | {{(data.id||id)+1}}
                    .status-dot(v-if="data.status", v-bind:class="{ on: data.status == 'on', off: data.status == 'off' }")
                .player-container-item.name(v-if="data.name")
                    | {{data.name}}
                .player-container-item.icon.seen(v-if="isSeen()")
                    img(src="@/static/icons/eye.svg")
                .player-container-item.icon.leader(v-if="roundInfo !== null && roundInfo.leader === id")
                    img(src="@/static/icons/fist.svg")
                .player-container-item.icon.in-mission(v-if="data.onMission")
                    img(src="@/static/icons/flag.svg")
                .player-container-item.icon.lady-of-lake(v-if="roundInfo !== null && roundInfo.ladyOfLake && roundInfo.ladyOfLake === id")
                    img(src="@/static/icons/model.svg")
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
        data: {
            type: Object,
            default: () => {
                return null
            }
        },
        privateInfo: {
            type: Object,
            default: () => {
                return null
            }
        },
        roundInfo: {
            type: Object,
            default: () => {
                return null
            }
        },
        id: {
            type: Number,
            default: null
        }
    },
    data() {
        return {
            index: null
        }
    },
    watch: {},
    mounted() {},
    methods: {
        udpateIndex() {
            // if(this.data)
        },
        isSeen() {
            console.log(this.data, this.privateInfo)
            if (!this.data) {
                return false
            }
            if (!this.data.id) {
                return false
            }
            if (!this.privateInfo) {
                return false
            }
            if (!this.privateInfo.seenmap) {
                return false
            }
            if (this.data.id in this.privateInfo.seenmap) {
                return true
            } else {
                return false
            }
        }
    }
}
</script>

<style lang="scss">
@import '../../styles/variables/index.scss';

$id-size: 3em;
$icon-size: 2em;
$icon-image-size: 2em;

.player {
    position: relative;
    height: 100%;
    width: 100%;
    background-color: white;
    transition: ease 1s;

    :hover {
        opacity: 0.8;
    }
    .player-container {
        position: relative;
        height: 100%;
        width: 100%;
        .player-container-inner {
            position: relative;
            height: 100%;
            width: 100%;
            display: grid;
            grid-gap: 0.2em;
            grid-template-columns: $id-size auto $icon-size $icon-size $icon-size $icon-size;
            .player-container-item {
                text-align: center;
                font-style: italic;
                align-self: center;
            }
            .id {
                position: relative;
                margin-left: 0.1em;
                font-size: 1.6em;
                // background-color: color(blue);

                .status-dot {
                    position: absolute;
                    bottom: 0em;
                    // transform: translateY(-50%);
                    border-radius: 50%;
                    height: 0.4em;
                    width: 0.4em;
                    display: inline-block;
                }
                .on {
                    background-color: color(green);
                }
                .off {
                    background-color: color(red);
                }
            }

            .name {
                font-size: 1.6em;
                max-width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .icon {
                height: $icon-size;
                transition: width 2s;
                img {
                    max-width: $icon-image-size;
                    max-height: $icon-image-size;
                }
            }
            // .in-mission {
            //     background-color: red;
            // }
            // .leader {
            //     background-color: blue;
            // }
            // .seen {
            //     background-color: green;
            // }
            // .lady-of-lake {
            //     background-color: peru;
            // }
        }
    }
}
.selected {
    background: orange;
}
@media screen and (max-width: 1100px) {
    .player {
        font-size: 0.8em;
    }
}
@media screen and (max-width: 700px) {
    .player {
        font-size: 0.6em;
    }
}
@media screen and (max-width: 500px) {
    .player {
        .player-container {
            .player-container-inner {
                // grid-template-columns: auto, auto, auto, auto, auto;

                .name {
                    display: none;
                }
                // .icon {
                //     display: none;
                // }
            }
        }
    }
}
</style>
