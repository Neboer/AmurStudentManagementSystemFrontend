<script setup lang="ts">
import axios from 'axios'
import { FormInstance, FormRules } from 'element-plus'
import { ref, reactive } from 'vue'
import useHandleError from '~/composables/axios_handle_error'

const update_exam_dialog_visible = ref<boolean>(false)

interface UpdateExamDialogForm {
    name: string
    date: string
}

const exam_update_form = reactive<UpdateExamDialogForm>({
    name: '',
    date: ''
})

const form_ref = ref<FormInstance>()
const update_loading = ref(false)
const info_loading = ref(true)
const exam_id = ref<number | null>(null)

// 表单验证规则
const form_rules: FormRules = {
    name: [{ required: true, message: '请输入考试名称', trigger: 'blur' }],
    date: [{ required: true, message: '请选择考试日期', trigger: 'change' }]
}

const emit = defineEmits<{
    (e: 'onAfterUpdateExam'): void
}>()

// 获取考试信息
async function fetch_exam_info() {
    if (!exam_id.value) return

    await useHandleError(
        async () => {
            const response = await axios.get(`/api/exam/${exam_id.value}`)
            exam_update_form.name = response?.data.name
            exam_update_form.date = (new Date(response?.data.date)).toISOString().split('T')[0]
        },
        null,
        info_loading,
        { 'Exam not found': '考试不存在' }
    )
}

// 提交更新
async function update_exam() {
    const valid = await form_ref.value?.validate()
    if (!valid) return

    await useHandleError(
        () => axios.put(`/api/exam/${exam_id.value}`, exam_update_form),
        '考试信息更新成功',
        update_loading
    ).then(() => {
        update_exam_dialog_visible.value = false
        emit('onAfterUpdateExam')
    })
}

// 打开对话框
function open_dialog(target_exam_id: number) {
    exam_id.value = target_exam_id
    update_exam_dialog_visible.value = true
    fetch_exam_info()
}

// 关闭对话框
function close_dialog() {
    update_exam_dialog_visible.value = false
    exam_id.value = null
    exam_update_form.name = ''
    exam_update_form.date = ''
}

defineExpose({ open_dialog })
</script>

<template>
    <el-dialog v-model="update_exam_dialog_visible" title="修改考试信息" width="500" @closed="close_dialog">
        <el-form ref="form_ref" :model="exam_update_form" :rules="form_rules" label-width="100px"
            v-loading="info_loading">
            <el-form-item label="考试名称" prop="name">
                <el-input v-model="exam_update_form.name" />
            </el-form-item>

            <el-form-item label="考试日期" prop="date">
                <el-date-picker v-model="exam_update_form.date" type="date" value-format="YYYY-MM-DD"
                    placeholder="选择日期" />
            </el-form-item>
        </el-form>

        <template #footer>
            <div class="dialog-footer">
                <el-button @click="close_dialog">取消</el-button>
                <el-button type="primary" :loading="update_loading" @click="update_exam">
                    确定
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>
