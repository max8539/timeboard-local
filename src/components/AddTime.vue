<script setup lang="ts">
    import { ref } from 'vue'
    import * as localData from "../data"
    import * as pager from "../pager"
    import FormContainer from './FormContainer.vue';
    import ErrorBox from './ErrorBox.vue';
    import BlockButton from './BlockButton.vue';

    const formState = ref("none")
    const name = ref("")
    const time = ref("")
    const timeRegex = new RegExp("^([0-9]+:)?([0-9]+:)?[0-9]+(\\.[0-9]+)?$") 

    function validTime() {
        return timeRegex.test(time.value)
    }

    function disableForm() {
        return formState.value == "sent" || formState.value == "success"
    }
    function disableSubmit() {
        return disableForm() || name.value == "" || name.value.length > 15 || !validTime()
    }

    function submitForm() {
        formState.value = "sent"
        localData.addRecord(name.value, time.value)
        pager.page.value = "all"
    }
</script>

<template>
    <FormContainer>
        <FormHeading>Add Time</FormHeading>
        <form>
            <FieldLabel>Name:</FieldLabel>
            <input type="text" id="name" maxlength="15" v-model="name" :disabled="disableForm()" class="block w-full mt-2 px-2 py-1 bg-blue-100 focus:bg-blue-50 disabled:bg-slate-300 disabled:text-gray-600 drop-shadow-md"/>
            <p class="mb-2 text-right text-xs">{{ name.length }}/15</p>
            <FieldLabel>Time</FieldLabel>
            <input type="text" id="time" v-model="time" :disabled="disableForm()" class="block w-full my-2 px-2 py-1 bg-blue-100 focus:bg-blue-50 disabled:bg-slate-300 disabled:text-gray-600 drop-shadow-md"/>
            <BlockButton type="submit" @click.prevent="submitForm()" :disabled="disableSubmit()">Add time</BlockButton>
        </form>
        <ErrorBox v-if="time != '' && !validTime()" class="my-4 px-2 py-4 bg-red-300">
            <p>Invalid time format.</p>
            <p>Please enter a time in the same format as the leaderboard, or one of the other time formats that Timeboard supports.</p>
        </ErrorBox>
    </FormContainer>
</template>
