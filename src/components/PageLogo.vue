<script setup lang="ts">
    import * as pager from "../pager"
    
    function gotoTop() {
        pager.page.value = "top"
    }
</script>
<!--
    To change the page logo, copy your logo image file to the public directory, 
    then change the src attirbute of the img element below to point to your file.
    (omit /public, make sure the filename is preceded with a /  e.g. /logo,png).
    Build after making these changes to see your logo dispalyed on the web app.

    Do not change other files, elements or attributes.
    Please do not commit your logo changes to the Timeboard repository.
-->
<template>
    <button @click="gotoTop()">
        <img src="/logo-white.png" alt="Timeboard logo" class="inline h-12 p-1" />
    </button>
</template>
