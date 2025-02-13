<script lang="ts" setup>
import axios from 'axios'
import { Action, ElMessage, ElMessageBox } from 'element-plus'
import { onMounted, ref } from 'vue'
import type AddStudentDialog from '~/components/StudentManagementDialogs/AddStudentDialog.vue'
import type UpdateStudentDialog from '~/components/StudentManagementDialogs/UpdateStudentDialog.vue'
import useHandleError from '~/composables/axios_handle_error'
import useDeleteDialog from '~/composables/configm_delete_dialog'

interface StudentInfo {
    id?: number;
    name: string;
    phone_number: string;
}

const student_table_data = ref<StudentInfo[]>([])
const table_loading = ref<boolean>(true)

// TODO: 刷新学生表格时页面会闪烁，考虑优化
async function refresh_student_table() {
    useHandleError(async () => {
        await axios.get('/api/student').then((response) => {
            student_table_data.value = response.data
            table_loading.value = false
        })
    }, null, table_loading, {})
}

onMounted(() => {
    refresh_student_table()
})

// add student dialog
const add_student_dialog_ref = ref<InstanceType<typeof AddStudentDialog> | null>(null)

// update student dialog
const update_student_dialog_student_id = ref<number | null>(null)
const update_student_dialog_ref = ref<InstanceType<typeof UpdateStudentDialog> | null>(null)
// Student: id?: number     name: string     phone_number: string     password: string

function on_click_edit_student(student_id: number) {
    update_student_dialog_student_id.value = student_id
    update_student_dialog_ref.value?.open_dialog(student_id)
}

async function on_click_delete_student(student_id: number, student_name: string) {
    useDeleteDialog(`确定删除学生${student_name}？`).then((user_confirm_delete) => {
        if (user_confirm_delete) {
            useHandleError(async () => {
                await axios.delete(`/api/student/${student_id}`)
                refresh_student_table()
            }, '成功删除', table_loading, {})
        }
    })
}
</script>

<template>
    <el-button type="primary" @click="add_student_dialog_ref?.open_dialog()">
        添加学生
    </el-button>
    <el-button type="primary" @click="refresh_student_table()">
        刷新
    </el-button>
    <add-student-dialog @on-after-add-student="refresh_student_table" ref="add_student_dialog_ref" />
    <update-student-dialog @on-after-update-student="refresh_student_table" ref="update_student_dialog_ref" />
    <el-table v-loading="table_loading" :data="student_table_data" stripe style="width: 100%" empty-text="没有学生">
        <el-table-column prop="name" label="姓名" width="180" />
        <el-table-column prop="phone_number" label="电话号码" />
        <el-table-column label="操作" min-width="120">
            <template #default="scope">
                <el-button link type="primary" size="small" @click="on_click_edit_student(scope.row.id)">
                    编辑
                </el-button>
                <el-button link type="danger" size="small"
                    @click="on_click_delete_student(scope.row.id, scope.row.name)">
                    删除
                </el-button>
            </template>
        </el-table-column>
    </el-table>
</template>
