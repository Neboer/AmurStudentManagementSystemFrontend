<script setup lang="ts">
import axios from 'axios'
import { defineExpose, defineModel, ref, reactive, watch, watchEffect, onMounted } from 'vue'
import useHandleError from '~/composables/axios_handle_error'

const update_student_dialog_visible = ref<boolean>(false)

export interface UpdateStudentDialogForm {
    name: string
    phone_number: string
}

const student_update_dialog_form = reactive<UpdateStudentDialogForm>({
    name: '',
    phone_number: '',
})

const update_loading = ref(false)

function reset_student_update_dialog_form() {
    student_update_dialog_form.name = ''
    student_update_dialog_form.phone_number = ''
}


const emit = defineEmits<{
    (e: 'onAfterUpdateStudent'): void
}>()

const student_id = ref<number | null>(null)

async function update_student() {
    await useHandleError(async () => {
        return await axios.put(`/api/student/${student_id.value}`, {
            name: student_update_dialog_form.name,
            phone_number: student_update_dialog_form.phone_number,
        })
    }, '成功更新学生信息', update_loading)
    reset_student_update_dialog_form()
    update_student_dialog_visible.value = false
    emit('onAfterUpdateStudent')
}

function on_exit_dialog() {
    reset_student_update_dialog_form()
    update_student_dialog_visible.value = false
}

const info_loading = ref(true)

async function get_student_info() {
    if (student_id.value === null) {
        return
    } else {
        await useHandleError(async () => {
            axios.get(`/api/student/${student_id.value}`).then((response) => {
                student_update_dialog_form.name = response.data.name
                student_update_dialog_form.phone_number = response.data.phone_number
            })
        }, null, info_loading, {
            'Student not found': '学生不存在',
        })
    }
}

function open_dialog(input_student_id: number) {
    update_student_dialog_visible.value = true
    student_id.value = input_student_id
    get_student_info()
}

function close_dialog() {
    update_student_dialog_visible.value = false
    reset_student_update_dialog_form()
}

defineExpose({
    student_update_dialog_form,
    // 打开对话框时，传入学生ID，获取学生信息，学生id不是通过props传入的，而是在打开对话框时调用openDialog传入的。
    open_dialog,
    close_dialog
})

</script>

<template>
    <el-dialog v-model="update_student_dialog_visible" title="修改学生信息" width="500">
        <el-form :model="student_update_dialog_form" v-loading="info_loading">
            <el-form-item label="学生姓名" label-width="140px" required>
                <el-input v-model="student_update_dialog_form.name" />
            </el-form-item>
            <el-form-item label="手机号码" label-width="140px" required>
                <el-input v-model="student_update_dialog_form.phone_number" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="on_exit_dialog">
                    取消
                </el-button>
                <el-button type="primary" :loading="update_loading" @click="update_student">
                    确定
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<style scoped></style>
