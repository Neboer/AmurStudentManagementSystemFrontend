<script setup lang="ts">
import type { ComponentSize, FormInstance, FormRules } from 'element-plus'
import { reactive, ref } from 'vue'

const login_form_ref = ref<FormInstance>()

interface LoginForm {
    username: string
    password: string
    captcha: string
    remember_me?: boolean
}

// do not use same name with ref
const login_form = reactive<LoginForm>({
    username: '',
    password: '',
    captcha: '',
    remember_me: false,
})

const rules = reactive<FormRules<LoginForm>>({
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
    ],
    password: [
        {
            required: true,
            message: '请输入密码',
            trigger: 'blur',
        },
    ],
    captcha: [
        {
            required: true,
            message: '请输入验证码',
            trigger: 'blur',
        },
    ],
})

async function submitForm(formEl: FormInstance | undefined) {
    if (!formEl)
        return
    await formEl.validate((valid, fields) => {
        if (valid) {
            console.log('submit!')
        }
        else {
            console.log('error submit!', fields)
        }
    })
}
</script>

<template>
    <div class="login-container">
        <h1>登录笔管</h1>
        <el-form
            ref="login_form_ref"
            :model="login_form" label-width="auto" label-position="top" status-icon
            :rules="rules"
        >
            <el-form-item label="用户名" prop="username">
                <el-input v-model="login_form.username" placeholder="请输入用户名" />
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input
                    v-model="login_form.password"
                    type="password"
                    placeholder="请输入密码"
                    show-password
                />
            </el-form-item>

            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="验证码" style="align-items: center" prop="captcha">
                        <el-input
                            v-model="login_form.captcha"
                            placeholder="请输入右侧图像中内容"
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-image style="width: 166px; height: 50px; margin-top: 1rem;" src="https://picsum.photos/166/50" fit="fill">
                        <template #placeholder>
                            加载中...
                        </template>
                        <template #error>
                            加载失败
                        </template>
                    </el-image>
                </el-col>
            </el-row>
            <el-form-item>
                <el-checkbox v-model="login_form.remember_me">
                    记住我
                </el-checkbox>
            </el-form-item>

            <el-form-item>
                <el-col :span="24">
                    <el-button type="primary" class="w-full" @click="submitForm(login_form_ref)">
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
