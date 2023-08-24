<script setup lang="ts">
    import { ref } from "vue"
    import * as pager from './pager'
    import PageLogo from './components/PageLogo.vue';

    import Top from "./components/Top.vue";
    import All from "./components/All.vue";
    import AddTime from "./components/AddTime.vue";
    import Setup from "./components/Setup.vue";

    const hamburger = ref(false)

    function toggleHamburger() {
        hamburger.value = !hamburger.value
    }
    
    function gotoTop() {
        pager.page.value = "top"
    }
    function gotoAll() {
        pager.page.value = "all"
    }
    function gotoSetup() {
        pager.page.value = "setup"
    }
</script>

<template>
    <div class="hidden sm:block h-12 bg-blue-950 text-white drop-shadow-xl">
        <div class="grid grid-cols-[auto_1fr_1fr_1fr]">
            <PageLogo />
            <button @click="gotoTop()" class="block h-12 w-full py-3 hover:bg-blue-900 text-center">Home</button>
            <button @click="gotoAll()" class="block h-12 w-full py-3 hover:bg-blue-900 text-center">All Times</button>
            <button @click="gotoSetup()" class="block h-12 w-full py-3 hover:bg-blue-900 text-center">Settings</button>
        </div>
    </div>

    <div class="block sm:hidden h-12 bg-blue-950 text-white drop-shadow-xl">
        <div class="grid grid-cols-[1fr_auto]">
            <div>
                <PageLogo />
            </div>
            <div class="hover:bg-blue-900 h-12">
                <div v-if="hamburger">
                    <button class="m-0 p-0" @click="toggleHamburger()">
                        <img src="/cross.png" alt="Close menu" class="h-12 p-1 m-auto" />
                    </button>
                </div>
                <div v-else>
                    <button class="m-0 p-0" @click="toggleHamburger()">
                        <img src="/hamburger.png" alt="Open menu" class="h-12 p-1 m-auto" />
                    </button>
                </div>
            </div>
        </div>
    </div>
    <div v-if="hamburger" class="w-full block sm:hidden bg-blue-950 text-white drop-shadow-xl">
        <div>
            <button @click="gotoTop()" class="block p-2 w-full hover:bg-blue-900 text-center">Home</button>
            <button @click="gotoAll()" class="block p-2 w-full hover:bg-blue-900 text-center">All Times
            </button>
            <button @click="gotoSetup()" class="block p-2 w-full hover:bg-blue-900 text-center">Settings</button>
        </div>
    </div>
    
    <Top v-if="pager.page.value == 'top'" />
    <All v-if="pager.page.value == 'all'" />
    <AddTime v-if="pager.page.value == 'addTime'" />
    <Setup v-if="pager.page.value == 'setup'" />
</template>
