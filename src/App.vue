<script setup lang='ts'>
    import AppHeader from '@/components/AppHeader.vue';
</script>

<template>
    <div class="wrapper">
        <AppHeader />

        <div class="content">
            <RouterView />
        </div>
    </div>
</template>

<style>
    .wrapper {
        display: grid;
        grid-template-areas: "nav content";
        grid-template-columns: minmax(max-content, 256px) 1fr;
        height: 100%;
    }

    .content {
        grid-area: content;
    }
</style>
