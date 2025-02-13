<script setup lang="ts">
import axios from 'axios'
import { defineExpose, defineModel, ref, reactive, watch } from 'vue'
// import { default_add_student_dialog_form } from '~/components/StudentManagementDialogs/StudentForm'
import useHandleError from '~/composables/axios_handle_error'

const add_student_dialog_visible = ref<boolean>(false)

export interface AddStudentDialogForm {
    name: string
    phone_number: string
    init_password: string
    set_init_password_same_as_phone_number: boolean
}

const student_dialog_form = reactive<AddStudentDialogForm>({
    name: '',
    phone_number: '',
    init_password: '',
    set_init_password_same_as_phone_number: true,
})

const loading = ref(false)

function reset_student_dialog_form() {
    student_dialog_form.name = ''
    student_dialog_form.phone_number = ''
    student_dialog_form.init_password = ''
    student_dialog_form.set_init_password_same_as_phone_number = true
}

const emit = defineEmits<{
    (e: 'onAfterAddStudent'): void
}>()

async function add_student() {
    useHandleError(async () => {
        return await axios.post('/api/student', {
            name: student_dialog_form.name,
            phone_number: student_dialog_form.phone_number,
            init_password: student_dialog_form.init_password,
        })
    }, '添加成功', loading).then(() => {
        reset_student_dialog_form()
        add_student_dialog_visible.value = false
        emit('onAfterAddStudent')
    })
}

function on_exit_dialog() {
    reset_student_dialog_form()
    add_student_dialog_visible.value = false
}

function open_dialog() {
    add_student_dialog_visible.value = true
}

function close_dialog() {
    add_student_dialog_visible.value = false
    reset_student_dialog_form()
}

defineExpose({
    student_dialog_form,
    open_dialog,
    close_dialog
})

watch(student_dialog_form, (value) => {
    if (student_dialog_form.set_init_password_same_as_phone_number) {
        student_dialog_form.init_password = student_dialog_form.phone_number
    }
})
</script>

<template>
    <el-dialog v-model="add_student_dialog_visible" title="添加新学生" width="500">
        <el-form :model="student_dialog_form">
            <el-form-item label="学生姓名" label-width="140px" required>
                <el-input v-model="student_dialog_form.name" />
            </el-form-item>
            <el-form-item label="手机号码" label-width="140px" required>
                <el-input v-model="student_dialog_form.phone_number" />
            </el-form-item>
            <el-form-item label="初始密码" label-width="140px" required>
                <el-input v-model="student_dialog_form.init_password"
                    :disabled="student_dialog_form.set_init_password_same_as_phone_number" />
            </el-form-item>
            <el-form-item>
                <el-checkbox v-model="student_dialog_form.set_init_password_same_as_phone_number" name="type">
                    设置初始密码与手机号相同
                </el-checkbox>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="on_exit_dialog">
                    取消
                </el-button>
                <el-button type="primary" :loading="loading" @click="add_student">
                    添加
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<style scoped></style>
