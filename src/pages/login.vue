<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { reactive, ref } from 'vue'
import refresh_and_redirect_user_by_identity from '~/snippets/redirect_user_by_identity'

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

const captcha_url = ref('/api/captcha')

function update_captcha() {
    captcha_url.value = `${captcha_url.value}?timestamp=${Date.now()}`
}

const rules = reactive<FormRules<LoginForm>>({
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
    ],
    captcha: [
        { required: true, message: '请输入验证码', trigger: 'blur' },
    ],
})

function alert_error(message: string) {
    return ElMessageBox.alert(message, '登录错误', {
        confirmButtonText: 'OK',
    })
}

const login_button_loading = ref(false)


async function submitForm(formEl: FormInstance | undefined) {
    if (!formEl)
        return
    await formEl.validate(async (valid, _) => {
        if (valid) {
            try {
                const login_result = await axios.post('/api/login', login_form)
                if (login_result.status === 200) {
                    ElMessage({
                        message: '登录成功',
                        type: 'success',
                    })
                }
                // 成功登录，刷新用户身份，然后重定向
                await refresh_and_redirect_user_by_identity()
            }
            catch (error: any) {
                // 登录错误，检查错误原因
                const error_reasons: Record<string, string> = {
                    'Already logged in': '已经登录',
                    'Incorrect captcha': '验证码错误',
                    'Invalid username or password': '用户名或密码错误',
                }

                // 确保 error 是 axios 错误并检查其结构
                if (axios.isAxiosError(error) && error.response?.data?.error) {
                    const error_message = error.response.data.error
                    if (error_message in error_reasons) {
                        await alert_error(error_reasons[error_message])
                    }
                    else {
                        await alert_error(error_message)
                    }
                }
                else {
                    // 处理未知错误
                    await alert_error('发生未知错误，请稍后再试')
                    console.error(error)
                }
                update_captcha()
            }
        }
    })
}
</script>

<template>
    <div class="login-container">
        <h1>用户登录</h1>
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
                    <el-image
                        style="width: 166px; height: 50px; margin-top: 1rem;" :src="captcha_url" fit="fill" id="captcha-img"
                        @click="update_captcha"
                    >
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
                    30天内免登录
                </el-checkbox>
            </el-form-item>

            <el-form-item>
                <el-col :span="24">
                    <el-button
                        type="primary" class="w-full" :loading="login_button_loading"
                        @click="submitForm(login_form_ref)"
                    >
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
@media (prefers-color-scheme: dark) {
    #captcha-img {
        filter: invert(100%);
    }
}
</style>
