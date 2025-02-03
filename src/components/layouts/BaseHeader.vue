<script lang="ts" setup>
import { repository } from '~/../package.json'

import { toggleDark } from '~/composables'
import ScholarInkLogo from '~/assets/ScholarInkLogo.svg'
</script>

<template>
    <el-menu class="el-menu-demo" mode="horizontal" :ellipsis="false" router>
        <el-menu-item index="/">
            <div class="flex items-center justify-center gap-2">
                <!-- <div class="text-xl" i-ep-element-plus /> -->
                 <img :src="ScholarInkLogo" alt="笔杆logo" />
                <span>笔杆</span>
            </div>
        </el-menu-item>
        <el-sub-menu index="2">
            <template #title>
                学生 - 用户名字
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
    &.ep-menu--horizontal > .ep-menu-item:nth-child(1) {
        margin-right: auto;
    }
}
</style>
