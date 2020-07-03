<!-- Created by James on 2018/10/29. -->

<template lang="pug">
.avalon-container
    .top-side
        .top-side-container
            .top-side-container-inner
                .title(v-on:click="backToHomePage") Nuxt-Avalon
    .container
        router-view
</template>

<script>
export default {
    name: 'DefaultContainer',
    methods: {
        backToHomePage: () => {
            window.location = '/'
        }
    }
}
</script>

<style lang="scss">
$head-height: 10vh;

.avalon-container {
    padding-top: $head-height;
    // padding-bottom: $head-height;
    position: relative;
    width: 100vw;
    height: 100vh-$head-height;
    .top-side {
        position: absolute;
        top: 0%;
        width: 100vw;
        height: $head-height;
        background-color: #363636;
        color: white;
        .top-side-container {
            position: relative;
            width: 100%;
            height: 100%;
            .top-side-container-inner {
                position: absolute;
                left: 1em;
                top: 50%;
                transform: translateY(-50%);
                .title {
                    font-size: 2em;
                    cursor: pointer;
                }
            }
        }
    }
    .container {
        position: relative;
        width: 100%;
        height: 100vh-$head-height;
    }
}
</style>
