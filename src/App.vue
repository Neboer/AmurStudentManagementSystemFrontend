<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'

import 'element-plus/es/components/message/style/css';
import 'element-plus/es/components/message-box/style/css';

const route = useRoute()
const showHeader = computed(() => route.path !== '/login')
const showSide = computed(() => route.path !== '/login')


</script>

<template>
    <el-config-provider namespace="ep">
        <BaseHeader v-if="showHeader" />
        <div class="main-container flex">
            <BaseSide v-if="showSide" />
            <div w="full" py="4" class="p-5">
                <RouterView />
            </div>
        </div>
    </el-config-provider>
</template>

<style>
#app {
    color: var(--ep-text-color-primary);
}

.main-container {
    height: calc(100vh - var(--ep-menu-item-height) - 4px);
}
</style>
