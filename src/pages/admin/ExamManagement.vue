<script lang="ts" setup>
import axios from 'axios'
import { onMounted, ref } from 'vue'
import open_delete_dialog from '~/composables/configm_delete_dialog'
import AddExamDialog from '~/components/ExamManagementDialogs/AddExamDialog.vue'
import UpdateExamBaseInfoDialog from '~/components/ExamManagementDialogs/UpdateExamBaseInfoDialog.vue'
import useHandleError from '~/composables/axios_handle_error'
import { Plus, Refresh } from '@element-plus/icons-vue'

// 考试表格数据（包含科目信息）
const exam_table_data = ref<Array<{
    id: number
    name: string
    date: string
    subjects: Array<{ subject: string, full_score: number }>
}>>([])

const table_loading = ref(true)

// 刷新考试表格数据
async function refresh_exam_table() {
    useHandleError(async () => {
        const response = await axios.get('/api/exam')
        exam_table_data.value = response.data
    }, null, table_loading, {})
}

onMounted(() => {
    refresh_exam_table()
})

// 添加考试处理
const add_exam_dialog_ref = ref<InstanceType<typeof AddExamDialog> | null>(null)

// 删除考试处理
async function on_click_delete_exam(exam_id: number, exam_name: string) {
    const user_confirm_delete = await open_delete_dialog(
        `确定删除考试【${exam_name}】？此操作会同时删除所有关联成绩！`
    )

    useHandleError(async () => {
        if (user_confirm_delete) {
            await axios.delete(`/api/exam/${exam_id}`)
            await refresh_exam_table()
        }
    }, '成功删除', table_loading, {
        'Exam not found': '考试不存在'
    })
}

// 编辑考试基本信息处理
const update_exam_dialog_ref = ref<InstanceType<typeof UpdateExamBaseInfoDialog> | null>(null)
function on_click_edit_exam_basic_info(exam_id: number) {
    update_exam_dialog_ref.value?.open_dialog(exam_id)
}

function on_click_edit_exam_subject_info(exam_id: number) {
    console.log('待实现编辑考试科目功能，考试ID:', exam_id)
}

</script>

<template>
    <div class="exam-management">
        <!-- 添加考试按钮（暂为占位） -->
        <el-button type="primary" :icon="Plus" @click="add_exam_dialog_ref?.open_dialog()">
            添加考试
        </el-button>
        <el-button type="default" :icon="Refresh" @click="refresh_exam_table">
            刷新
        </el-button>


        <add-exam-dialog @on-after-add-exam="refresh_exam_table" ref="add_exam_dialog_ref" />
        <update-exam-base-info-dialog @on-after-update-exam="refresh_exam_table" ref="update_exam_dialog_ref"/>
        <!-- 考试数据表格 -->
        <el-table v-loading="table_loading" :data="exam_table_data" stripe style="width: 100%" empty-text="暂无考试数据" :default-sort="{ prop: 'date', order: 'ascending' }">
            <el-table-column prop="name" label="考试名称"/>

            <el-table-column prop="date" label="考试日期" sortable>
                <template #default="{ row }">
                    {{ new Date(row.date).toLocaleDateString() }}
                </template>
            </el-table-column>

            <el-table-column label="考试科目">
                <template #default="{ row }">
                    <el-tag v-for="subject in row.subjects" :key="subject.subject"
                        style="margin-right: 8px; margin-bottom: 4px">
                        {{ subject.subject }}（{{ subject.full_score }}）
                    </el-tag>
                </template>
            </el-table-column>

            <el-table-column label="操作">
                <template #default="scope">
                    <el-button link type="primary" size="small" @click="on_click_edit_exam_basic_info(scope.row.id)">
                        编辑信息
                    </el-button>

                    <el-button link type="primary" size="small" @click="on_click_edit_exam_subject_info(scope.row.id)">
                        编辑科目
                    </el-button>

                    <el-button link type="danger" size="small"
                        @click="on_click_delete_exam(scope.row.id, scope.row.name)">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<style scoped>
.exam-management {
    padding: 20px;
}

.el-tag {
    cursor: default;
}
</style>