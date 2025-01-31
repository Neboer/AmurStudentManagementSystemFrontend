<script setup lang="ts">
import type { AddStudentDialogForm } from '~/components/StudentManagementDialogs/StudentForm'
import axios from 'axios'
import { defineModel, nextTick, ref } from 'vue'
import { default_add_student_dialog_form } from '~/components/StudentManagementDialogs/StudentForm'
import axios_element_handle_error from '~/snippets/axios_handle_error'

const student_dialog_visible = defineModel<boolean>('student_dialog_visible', {
    type: Boolean,
    default: false,
})

const student_dialog_form = defineModel<AddStudentDialogForm>('student_dialog_form', {
    type: Object,
    default: () => default_add_student_dialog_form,
})

const loading = ref(false)

function reset_student_dialog_form() {
    student_dialog_form.value = default_add_student_dialog_form
}

async function add_student() {
    await axios_element_handle_error(async () => {
        return await axios.post('/api/student', {
            name: student_dialog_form.value.name,
            phone_number: student_dialog_form.value.phone_number,
            init_password: student_dialog_form.value.init_password,
        })
    }, '添加成功', loading)
    reset_student_dialog_form()
}
</script>

<template>
    <el-dialog v-model="student_dialog_visible" title="添加新学生" width="500">
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
                <el-button @click="(student_dialog_visible = false) && reset_student_dialog_form()">
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
