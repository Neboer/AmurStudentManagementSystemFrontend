<script lang="ts" setup>
import { repository } from '~/../package.json'

import { toggleDark } from '~/composables'
import ScholarInkLogo from '~/assets/ScholarInkLogo.svg'
import { useUserStore } from '~/app-store'
import { Identity } from '~/types/UserIdentity'
import { computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { redirect_user_by_identity, refresh_user_identity } from '~/snippets/redirect_user_by_identity'


const user_store = useUserStore()
const router = useRouter()
const route = useRoute()

const on_home_click = () => {
    redirect_user_by_identity(router, user_store)
}

// 用户访问任何使用此组件的页面时，都要刷新用户的身份。
// 如果用户没有权限访问当前的页面，则强制将用户重定向到他自己的权限主页。
onMounted(async () => {
    await refresh_user_identity(user_store)
    // 刷新完用户身份后，如果用户没有权限访问当前页面，则重定向到他自己的权限主页
    const pathSegments = route.path.split('/')
    const identity = pathSegments[0]
    if (identity === 'admin' || identity === 'student') {
        if (identity !== user_store.identity) {
            // 如果用户没有权限访问当前页面，则重定向到他自己的权限主页
            redirect_user_by_identity(router, user_store)
        }
    }
})

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
    <el-menu class="el-menu-header" mode="horizontal" :ellipsis="false" router>
        <el-menu-item index="#" @click="on_home_click" class="header-logo-container">
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
