<script lang="ts" setup>
import axios from 'axios'
import { onMounted, ref } from 'vue'
import open_delete_dialog from '~/composables/configm_delete_dialog'
import AddExamDialog from '~/components/ExamManagementDialogs/AddExamDialog.vue'

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
    try {
        const response = await axios.get('/api/exam')
        exam_table_data.value = response.data
    } catch (error) {
        console.error('获取考试数据失败:', error)
    } finally {
        table_loading.value = false
    }
}

onMounted(() => {
    refresh_exam_table()
})

// 添加考试处理
const add_exam_dialog_ref = ref<InstanceType<typeof AddExamDialog> | null>(null)

// 删除考试处理
async function on_click_delete_exam(exam_id: number, exam_name: string) {
    const user_confirm_delete = await open_delete_dialog(
        `确定删除考试【${exam_name}】？此操作会同时删除所有关联成绩！`,
        '成功删除考试'
    )

    if (user_confirm_delete) {
        try {
            await axios.delete(`/api/exam/${exam_id}`)
            await refresh_exam_table()
        } catch (error) {
            console.error('删除考试失败:', error)
        }
    }
}

// 初始化编辑功能占位（后续添加Dialog时实现）
function on_click_edit_exam(exam_id: number) {
    console.log('待实现编辑功能，考试ID:', exam_id)
}
</script>

<template>
    <div class="exam-management">
        <!-- 添加考试按钮（暂为占位） -->
        <el-button type="primary" @click="add_exam_dialog_ref?.open_dialog()">
            添加考试
        </el-button>

        <add-exam-dialog @on-after-add-exam="refresh_exam_table" ref="add_exam_dialog_ref" />
        <!-- 考试数据表格 -->
        <el-table v-loading="table_loading" :data="exam_table_data" stripe style="width: 100%" empty-text="暂无考试数据">
            <el-table-column prop="name" label="考试名称" width="220" />

            <el-table-column prop="date" label="考试日期" width="150">
                <template #default="{ row }">
                    {{ new Date(row.date).toLocaleDateString() }}
                </template>
            </el-table-column>

            <el-table-column label="考试科目" min-width="300">
                <template #default="{ row }">
                    <el-tag v-for="subject in row.subjects" :key="subject.subject"
                        style="margin-right: 8px; margin-bottom: 4px">
                        {{ subject.subject }}（满分 {{ subject.full_score }}）
                    </el-tag>
                </template>
            </el-table-column>

            <el-table-column label="操作" width="150">
                <template #default="scope">
                    <el-button link type="primary" size="small" @click="on_click_edit_exam(scope.row.id)">
                        编辑
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