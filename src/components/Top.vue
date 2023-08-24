<script setup lang="ts">
    import { ref, onMounted, onUnmounted } from 'vue';
    import * as localData from "../data"
    import * as pager from "../pager"

    const initialData = localData.getTop()
    const boardName = ref("Records")
    const records = ref<localData.clientSideRecord[]>([])
    boardName.value = initialData.boardName
    records.value = initialData.records

    let intervalId: any

    async function refreshData() {
        let newData = localData.getTop()
        boardName.value = newData.boardName
        records.value = newData.records
    }

    function gotoAll() {
        pager.page.value = "all"
    }

    onMounted(() => {
        document.body.classList.add('bg-blue-100')
        intervalId = setInterval(refreshData, 5000)
    })

    onUnmounted(() => {
        clearInterval(intervalId)
        document.body.classList.remove('bg-blue-100')
    })
</script>
<template>
    <div class="w-full sm:w-[90%] m-auto px-4 py-4 md:p-5 lg:p-6 xl:p-7 2xl:p-8">
        <h1 class="py-2 font-bold text-center text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl">{{ boardName }}</h1>
        <div v-if="records.length == 0" class="text-center my-4 px-4 py-12 sm:py-14 md:py-16 lg:py-20 xl:py-24 2xl:py-28 bg-blue-400 drop-shadow-md">
            <h2 class="font-bold text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl">Be the first to set a time!</h2>
        </div>
        <div v-else class="max-w-full overflow-auto drop-shadow-md my-4">
            <table class="w-full">
                <tbody>
                    <tr v-for="record of records" :key="record.id" class="first:font-bold sm:first:text-2xl md:first:text-3xl md:text-xl lg:first:text-4xl lg:text-2xl xl:first:text-5xl xl:text-3xl 2xl:first:text-6xl 2xl:text-4xl odd:bg-blue-400 even:bg-blue-300">
                        <td class="w-8 sm:w-10 md:w-12 lg:w-14 xl:w-16 2xl:w-18 p-2 lg:p-3 xl:p-4 2xl:p-5 text-center">{{ record.ranking }}</td>
                        <td class="">{{ record.name }}</td>
                        <td class="p-2 lg:p-3 xl:p-4 2xl:p-5 text-right">{{ record.time }}</td>
                    </tr>
                    <tr class="odd:bg-blue-400 even:bg-blue-300">
                        <td colspan="3" class="md:text-xl p-1 md:p-2 text-center">
                            <button @click="gotoAll()" class="inline text-blue-900 hover:underline ">View all</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <p>Timeboard Local | 
            <a href="https://github.com/max8539/timeboard-local" target="_blank" rel="noreferrer noopener" class=" text-blue-800 hover:underline">View source on Github</a>
        </p>
    </div>
</template>
