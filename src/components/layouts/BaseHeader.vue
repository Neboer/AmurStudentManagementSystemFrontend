<script lang="ts" setup>
import { repository } from '~/../package.json'

import { toggleDark } from '~/composables'
import ScholarInkLogo from '~/assets/ScholarInkLogo.svg'
import { useUserStore } from '~/app-store'
import { Identity } from '~/types/UserIdentity'
import { computed } from 'vue'
import { redirect_user_by_identity } from '~/snippets/redirect_user_by_identity'

const user_store = useUserStore()
const user_identity_string = computed(() => {
    switch (user_store.identity) {
        case Identity.Student:
            return '学生'
        case Identity.Admin:
            return '管理员'
        default:
            return '未知'
    }
})
</script>

<template>
    <el-menu class="el-menu-demo" mode="horizontal" :ellipsis="false" router>
        <el-menu-item index="#" @click="redirect_user_by_identity">
            <div class="flex items-center justify-center gap-2">
                <!-- <div class="text-xl" i-ep-element-plus /> -->
                <img :src="ScholarInkLogo" alt="笔杆logo" />
                <span>笔杆</span>
            </div>
        </el-menu-item>
        <el-sub-menu index="2">
            <template #title>
                {{ user_identity_string }} -
                {{ user_store.identity === Identity.Admin ? user_store.username : user_store.name }}
            </template>
            <el-menu-item index="2-1">
                修改密码
            </el-menu-item>
            <el-menu-item index="2-2">
                注销登录
            </el-menu-item>
        </el-sub-menu>
    </el-menu>
</template>

<style lang="scss">
.el-menu-demo {
    &.ep-menu--horizontal>.ep-menu-item:nth-child(1) {
        margin-right: auto;
    }
}
</style>
