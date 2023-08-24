<script setup lang="ts">
    import { ref } from 'vue'
    import * as pager from "../pager"
    import * as localData from "../data"
    import FormContainer from './FormContainer.vue';
    import FormHeading from './FormHeading.vue';
    import FieldLabel from './FieldLabel.vue';
    import BlockButton from './BlockButton.vue';
    import SuccessBox from './SuccessBox.vue';
    import RedButton from './RedButton.vue';

    const formState = ref("none")
    const resetMenu = ref(false)
   
    let currentVals = localData.getSetup()
    
    const rankOrder = ref(currentVals.rankOrder)
    const boardName = ref(currentVals.boardName)
    const timeFormat = ref(currentVals.timeFormat)
    const numShow = ref(currentVals.numShow)

    function disableForm() {
        return formState.value == "sent"
    }

    function disableSubmit() {
        return disableForm() ||
        (rankOrder.value == currentVals.rankOrder &&
        boardName.value == currentVals.boardName &&
        timeFormat.value == currentVals.timeFormat &&
        numShow.value == currentVals.numShow)
    }

    function showSuccess() {
        return formState.value == "success" && 
        rankOrder.value == rankOrder.value && boardName.value == boardName.value
    }

    async function submitForm() {
        localData.updateSetup(rankOrder.value, boardName.value, timeFormat.value, numShow.value)
        formState.value = "success"
        currentVals.rankOrder = rankOrder.value
        currentVals.boardName = boardName.value
        currentVals.timeFormat = timeFormat.value
        currentVals.numShow = numShow.value
    }

    function toggleResetMenu() {
        resetMenu.value = !resetMenu.value
    }

    function reset() {
        formState.value = "sent"
        localData.reset()
        pager.page.value = "top"
    }
</script>

<template>
    <FormContainer>
        <div class="mb-8 p-4 bg-blue-300 drop-shadow-md">
            <p class="text-justify">
            You are using Timebaord Local, which runs entirely in your browser. Times and settings are stored locally in your browser. They are not uploaded to any server, and cannot be accessed by others.
            </p>
            <p class="text-justify">
                If you are looking for the full version of Timeboard, which is made to be run on a web server, <a href="https://github.com/max8539/timeboard" target="_blank" rel="noreferrer noopener" class=" text-blue-800 hover:underline">check out the Timeboard Github repository.</a>
            </p>
        </div>

        <FormHeading>Timeboard Settings</FormHeading>
        <form>
            <div>
                <FieldLabel for="rank-order">Set ranking order:</FieldLabel>
                <p>
                    Rank the
                    <select id="rank-order" v-model="rankOrder" :disabled="disableForm()" class="span px-2 py-1 bg-blue-100 focus:bg-blue-50 disabled:bg-slate-300 disabled:text-gray-600 drop-shadow-md">
                        <option value="shortest">shortest</option>
                        <option value="longest">longest</option>
                    </select>
                    times first.
                </p>
            </div>
            <div>
                <FieldLabel for="board-name">Set leaderboard title:</FieldLabel>
                <input type="text" id="board-name" v-model="boardName" :disabled="disableForm()" class="block w-full my-2 px-2 py-1 bg-blue-100 focus:bg-blue-50 disabled:bg-slate-300 disabled:text-gray-600 drop-shadow-md" />
            </div>
            <div>
                <FieldLabel for="time-format">Set time display format</FieldLabel>
                <select id="time-format" v-model="timeFormat" :disabled="disableForm()" class="block w-full my-2 px-2 py-1 bg-blue-100 focus:bg-blue-50 disabled:bg-slate-300 disabled:text-gray-600 drop-shadow-md">
                    <option value="ss.mss">ss.mss</option>
                    <option value="mm:ss.mss">mm:ss.mss</option>
                    <option value="mm:ss">mm:ss</option>
                    <option value="hh:mm:ss.mss">hh:mm:ss.mss</option>
                    <option value="hh:mm:ss">hh:mm:ss</option>
                </select>
            </div>
            <div>
                <FieldLabel for="num-sho2">Set the number of times to show on the main leaderboard:</FieldLabel>
                <input type="number" min="1" v-model="numShow" :disabled="disableForm()" class="block w-full my-2 px-2 py-1 bg-blue-100 focus:bg-blue-50 disabled:bg-slate-300 disabled:text-gray-600 drop-shadow-md" />
            </div>
            <BlockButton type="submit" @click.prevent="submitForm()" :disabled="disableSubmit()">Save changes</BlockButton>
        </form>
        <SuccessBox v-if="showSuccess()">Changes saved.</SuccessBox>
        <br>

        <FormHeading>Other Timeboard Actions</FormHeading>
        <RedButton @click="toggleResetMenu()" :disabled="resetMenu">Delete all times</RedButton>
        <div v-if="resetMenu">
            <p>You are about to clear the leaderboard and delete all times that are saved on the system. This cannot be undone, and you cannot restore these times later. Continue?</p>
            <div class="w-full flex space-x-2 sm:space-x-4">
                <BlockButton @click="toggleResetMenu()">Cancel</BlockButton>
                <RedButton @click="reset()">Delete all times</RedButton>
            </div>
        </div>
    </FormContainer>
</template>
