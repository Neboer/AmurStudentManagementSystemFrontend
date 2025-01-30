<script setup lang="ts">
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { defineModel, ref } from 'vue'
import axios_handle_error, {elmessage_report_success} from "~/snippets/axios_handle_error";

const student_dialog_visible = defineModel<boolean>({
    type: Boolean,
    default: false,
})

interface StudentDialogForm {
    name: string
    phone_number: string
    init_password: string
    set_init_password_same_as_phone_number: boolean
}

const student_dialog_form = defineModel<StudentDialogForm>({
    type: Object,
    default: () => ({
        name: '',
        phone_number: '',
        init_password: '',
        set_init_password_same_as_phone_number: false,
    }),
})

const loading = ref(false)

function reset_student_dialog_form() {
    student_dialog_form.value = {
        name: '',
        phone_number: '',
        init_password: '',
        set_init_password_same_as_phone_number: false,
    }
}

async function add_student() {
    loading.value = true
    try {
        await axios.post('/api/student', {
            name: student_dialog_form.value.name,

        })
        ElMessage({
            message: '添加成功',
            type: 'success',
        })
        loading.value = false
        reset_student_dialog_form()
    }
    catch (error) {
        ElMessage({
            message: '添加失败',
            type: 'error',
        })
        loading.value = false
    }
}
</script>

<template>
    <el-dialog v-model="student_dialog_visible" title="Shipping address" width="500">
        <el-form :model="student_dialog_form">
            <el-form-item label="学生姓名" label-width="140px" required>
                <el-input v-model="student_dialog_form.name" />
            </el-form-item>
            <el-form-item label="手机号码" label-width="140px" required>
                <el-input v-model="student_dialog_form.phone_number" />
            </el-form-item>
            <el-form-item label="初始密码" label-width="140px" required :disabled="student_dialog_form.set_init_password_same_as_phone_number">
                <el-input v-model="student_dialog_form.init_password" />
            </el-form-item>
            <el-checkbox v-model="student_dialog_form.set_init_password_same_as_phone_number" name="type">
                设置初始密码与手机号相同
            </el-checkbox>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="student_dialog_visible = false">
                    取消
                </el-button>
                <el-button type="primary" :loading="loading" @click="add_student">
                    添加
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<style scoped>

</style>
