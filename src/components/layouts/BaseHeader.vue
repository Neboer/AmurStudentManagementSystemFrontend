<script lang="ts" setup>
import axios from 'axios'
import { ElMessage } from 'element-plus'

import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { toggleDark } from '~/composables'

const router = useRouter()

async function logout() {
    try {
        const response = await axios.post('/api/logout', {}, {
            withCredentials: true,
        })

        if (response.status === 200) {
            ElMessage({
                message: '退出成功',
                type: 'success',
            })
            router.push('/login')
        }
        else {
            ElMessage({
                message: '退出失败',
                type: 'error',
            })
        }
    }
    catch (error) {
        ElMessage({
            message: '退出失败',
            type: 'error',
        })
        console.error('Error during logout:', error)
    }
}

const username = ref<string>('')
const isadmin = ref<string>('')

onMounted(async () => {
    try {
        const response = await axios.get('/api/self', {
            withCredentials: true,
        })
        console.log(response)
        if (response.data && response.data.username) {
            username.value = response.data.username
        }
        if (response.data && response.data.admin) {
            if (response.data.admin === true) {
                isadmin.value = '管理员'
            }
            else {
                isadmin.value = '' // 非管理员不显示此内容，也可改为显示普通用户
            }
        }
    }
    catch (error) {
        console.error('Error fetching user data:', error)
    }
})
const logoutIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="svg-inline--fa fa-sign-out-alt fa-w-16" role="img" viewBox="0 0 512 512" id="icon-logout" width="24" height="24">
    <path fill="currentColor" d="M497 273L329 441c-15 15-41 4.5-41-17v-96H152c-13.3 0-24-10.7-24-24v-96c0-13.3 10.7-24 24-24h136V88c0-21.4 25.9-32 41-17l168 168c9.3 9.4 9.3 24.6 0 34zM192 436v-40c0-6.6-5.4-12-12-12H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h84c6.6 0 12-5.4 12-12V76c0-6.6-5.4-12-12-12H96c-53 0-96 43-96 96v192c0 53 43 96 96 96h84c6.6 0 12-5.4 12-12z"></path>
  </svg>
`;
</script>

<template>
    <el-menu class="el-menu-demo" mode="horizontal" :ellipsis="false" router>
        <el-menu-item index="/">
            <div class="flex items-center justify-center gap-2">
                <div class="text-xl" i-ep-element-plus />
                <span>Element Plus</span>
            </div>
        </el-menu-item>
        <el-sub-menu index="2">
            <template #title>
                Workspace
            </template>
            <el-menu-item index="2-1">
                item one
            </el-menu-item>
            <el-menu-item index="2-2">
                item two
            </el-menu-item>
            <el-menu-item index="2-3">
                item three
            </el-menu-item>
            <el-sub-menu index="2-4">
                <template #title>
                    item four
                </template>
                <el-menu-item index="2-4-1">
                    item one
                </el-menu-item>
                <el-menu-item index="2-4-2">
                    item two
                </el-menu-item>
                <el-menu-item index="2-4-3">
                    item three
                </el-menu-item>
            </el-sub-menu>
        </el-sub-menu>
        <el-menu-item index="3" disabled>
            Info
        </el-menu-item>
        <el-menu-item index="4">
            Orders
        </el-menu-item>

        <el-menu-item h="full" @click="toggleDark()">
            <button
                class="w-full cursor-pointer border-none bg-transparent"
                style="height: var(--ep-menu-item-height)"
            >
                <i inline-flex i="dark:ep-moon ep-sunny" />
            </button>
        </el-menu-item>

        <el-menu-item h="full" id="nohover">
            <el-space direction="vertical" alignment="flex-start" style="line-height: normal;gap: 0">
                <el-text>
                    {{ username }}
                </el-text>
                <el-text size="small">
                    {{ isadmin }}
                </el-text>
            </el-space>
        </el-menu-item>

        <el-menu-item @click="logout()">
            <el-tooltip
                class="box-item"
                effect="light"
                content="登出"
                placement="bottom-end"
            >
                <span style="display: flex; justify-content: center;" v-html="logoutIcon"/>
            </el-tooltip>
        </el-menu-item>
    </el-menu>
</template>

<style lang="scss">
.el-menu-demo {
    &.ep-menu--horizontal > .ep-menu-item:nth-child(1) {
        margin-right: auto;
    }
}
#nohover:hover {
    background-color: transparent !important;
}
</style>
