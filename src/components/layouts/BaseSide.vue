<script lang="ts" setup>
import { useRoute } from 'vue-router'
import {
    Document,
    Menu as IconMenu,
    Location,
    Setting,
} from '@element-plus/icons-vue'

const route = useRoute()
</script>

<template>
    <el-menu
        router
        :default-active="route.path"
        class="el-menu-vertical-demo"
    >
        <el-menu-item index="/admin/StudentManagement">
            <el-icon>
                <Setting />
            </el-icon>
            <template #title>
                学生管理
            </template>
        </el-menu-item>
        <el-menu-item index="/admin/ExamManagement">
            <el-icon>
                <Setting />
            </el-icon>
            <template #title>
                考试管理
            </template>
        </el-menu-item>
    </el-menu>
</template>
