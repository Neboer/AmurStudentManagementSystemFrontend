<script lang="ts" setup>
import { repository } from '~/../package.json'

import { toggleDark } from '~/composables'
import ScholarInkLogo from '~/assets/ScholarInkLogo.svg'
import { useUserStore } from '~/app-store'
import { Identity } from '~/types/UserIdentity'
import { computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { redirect_user_by_identity, refresh_user_identity } from '~/snippets/redirect_user_by_identity'
import axios from 'axios'
import axios_element_handle_error from '~/snippets/axios_handle_error'


const user_store = useUserStore()
const router = useRouter()
const route = useRoute()

const on_home_click = () => {
    redirect_user_by_identity(router, user_store)
}

// 本来这里应该有一个onMounted钩子，但我们更需要将此钩子作用在route上，而不是组件上。

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

async function on_click_logout() {
    await axios_element_handle_error(async () => {
        await axios.post('/api/logout')
    }, "成功注销", 'global', {
        'No user logged in': '未登录，无法登出'
    })
    user_store.logout()
    router.push('/')
}


</script>

<template>
    <el-menu class="el-menu-header" mode="horizontal" :ellipsis="false" router>
        <el-menu-item @click="on_home_click" class="header-logo-container">
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
            <el-menu-item>
                修改密码
            </el-menu-item>
            <el-menu-item @click="on_click_logout">
                注销登录
            </el-menu-item>
        </el-sub-menu>
    </el-menu>
</template>

<style lang="scss">
// 让用户名等菜单项靠右显示
.el-menu-header {
    &.ep-menu--horizontal>.ep-menu-item:nth-child(1) {
        margin-right: auto;
    }
}

.header-logo-container {
    margin-left: 10px!important; // 修复logo的位置过于靠左的问题
}
</style>
