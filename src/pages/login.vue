<script setup lang="ts">
import {reactive} from 'vue'

// do not use same name with ref
const form = reactive({
    name: '',
    password: '',
    captcha: '',
})

function onSubmit() {
    console.log('submit!')
}
</script>

<template>
    <div class="login-container">
        <h1>系统登录</h1>
        <el-form :model="form" label-width="auto" label-position="top">
            <el-form-item label="用户名">
                <el-input v-model="form.name" placeholder="请输入用户名"/>
            </el-form-item>
            <el-form-item label="密码">
                <el-input v-model="form.password"
                          type="password"
                          placeholder="请输入密码"
                          show-password/>
            </el-form-item>
            <el-form-item label="验证码" style="align-items: center">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-input v-model="form.captcha"/>
                    </el-col>
                    <el-col :span="12">
                        <img src="https://picsum.photos/166/50"/>
                    </el-col>
                </el-row>
            </el-form-item>

            <el-form-item>
                <el-col :span="24">
                    <el-button type="primary" @click="onSubmit" class="w-full">
                        登录
                    </el-button>
                </el-col>
            </el-form-item>
        </el-form>
    </div>
</template>

<style scoped>
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80vh;
    flex-direction: column;
}
</style>
