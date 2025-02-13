<script setup lang="ts">
import axios from 'axios'
import { FormInstance, FormRules } from 'element-plus'
import { ref, reactive, watch } from 'vue'
import useHandleError from '~/composables/axios_handle_error'

const add_exam_dialog_visible = ref<boolean>(false)

export interface ExamSubjectForm {
    subject: string
    full_score: number | null
}

interface AddExamDialogForm {
    name: string
    date: string
    subjects: ExamSubjectForm[]
}

// 默认科目模板
const DEFAULT_SUBJECTS: ExamSubjectForm[] = [
    { subject: '语文', full_score: 100 },
    { subject: '数学', full_score: 100 },
    { subject: '英语', full_score: 100 }
]

const exam_dialog_form = reactive<AddExamDialogForm>({
    name: '',
    date: '',
    subjects: [...DEFAULT_SUBJECTS]
})

const loading = ref(false)
const form_ref = ref<FormInstance>()

// 表单验证规则
const form_rules: FormRules = {
    name: [{ required: true, message: '请输入考试名称', trigger: 'blur' }],
    date: [{ required: true, message: '请选择考试日期', trigger: 'change' }],
    subjects: {
        validator: (_, value, callback) => {
            const hasEmpty = value.some((item: ExamSubjectForm) =>
                !item.subject.trim() || item.full_score === null
            )
            hasEmpty ? callback(new Error('请填写完整科目信息')) : callback()
        },
        trigger: 'change'
    }
}

const emit = defineEmits<{
    (e: 'onAfterAddExam'): void
}>()

function reset_exam_dialog_form() {
    exam_dialog_form.name = ''
    exam_dialog_form.date = ''
    exam_dialog_form.subjects = [...DEFAULT_SUBJECTS]
}

async function add_exam() {
    // 1. 表单验证
    const valid = await new Promise(resolve =>
        form_ref.value?.validate((isValid: boolean) => resolve(isValid))
    )
    if (!valid) return

    // 2. 处理请求逻辑
    useHandleError(
        () => axios.post('/api/exam', {  // 使用自动返回Promise的箭头函数
            name: exam_dialog_form.name,
            date: exam_dialog_form.date,
            subjects: exam_dialog_form.subjects
        }),
        '考试创建成功',
        loading,
        {}
    )

    // 3. 请求成功后执行后续操作
    reset_exam_dialog_form()
    add_exam_dialog_visible.value = false
    emit('onAfterAddExam')
}

function add_subject() {
    exam_dialog_form.subjects.push({ subject: '', full_score: null })
}

function remove_subject(index: number) {
    exam_dialog_form.subjects.splice(index, 1)
}

function open_dialog() {
    add_exam_dialog_visible.value = true
}

function close_dialog() {
    add_exam_dialog_visible.value = false
    reset_exam_dialog_form()
}

defineExpose({
    open_dialog,
    close_dialog
})
</script>

<template>
    <el-dialog v-model="add_exam_dialog_visible" title="创建新考试" width="800" @closed="reset_exam_dialog_form">
        <el-form ref="form_ref" :model="exam_dialog_form" :rules="form_rules" label-width="100px">
            <el-form-item label="考试名称" prop="name">
                <el-input v-model="exam_dialog_form.name" />
            </el-form-item>

            <el-form-item label="考试日期" prop="date">
                <el-date-picker v-model="exam_dialog_form.date" type="date" value-format="YYYY-MM-DD"
                    placeholder="选择日期" />
            </el-form-item>

            <el-form-item label="考试科目" prop="subjects">
                <el-table :data="exam_dialog_form.subjects" border>
                    <el-table-column label="科目名称" min-width="200">
                        <template #default="{ $index }">
                            <el-form-item :prop="`subjects.${$index}.subject`"
                                :rules="{ required: true, message: '科目名称不能为空', trigger: 'blur' }">
                                <el-input v-model="exam_dialog_form.subjects[$index].subject" />
                            </el-form-item>
                        </template>
                    </el-table-column>

                    <el-table-column label="满分分值" width="200">
                        <template #default="{ $index }">
                            <el-form-item :prop="`subjects.${$index}.full_score`"
                                :rules="{ required: true, message: '满分分值不能为空', trigger: 'blur' }">
                                <el-input-number v-model="exam_dialog_form.subjects[$index].full_score" :min="1"
                                    :controls="false" />
                            </el-form-item>
                        </template>
                    </el-table-column>

                    <el-table-column label="操作" width="80">
                        <template #default="{ $index }">
                            <el-button type="danger" link @click="remove_subject($index)"
                                :disabled="exam_dialog_form.subjects.length <= 1">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <div style="margin-top: 10px">
                    <el-button @click="add_subject">
                        <i class="el-icon-plus" /> 添加科目
                    </el-button>
                </div>
            </el-form-item>
        </el-form>

        <template #footer>
            <div class="dialog-footer">
                <el-button @click="close_dialog">取消</el-button>
                <el-button type="primary" :loading="loading" @click="add_exam">
                    创建考试
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<style scoped>
.el-form-item {
    margin-bottom: 16px;
}

:deep(.el-form-item__error) {
    position: static;
}
</style>