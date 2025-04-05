<script setup lang="ts">
import axios from 'axios'
import { ref } from 'vue'
import { FormInstance } from 'element-plus'
import useHandleError from '~/composables/axios_handle_error'
import useConfirmDeleteDialog from '~/composables/confirm_delete_dialog'

export interface ExamSubjectForm {
    id: number | null
    subject: string
    full_score: number
    isNew?: boolean
}

const update_subject_dialog_visible = ref<boolean>(false)
const exam_id = ref<number | null>(null)
const subjects = ref<ExamSubjectForm[]>([])
const loading = ref(false)
const form_ref = ref<FormInstance>()

async function fetch_subjects() {
    if (!exam_id.value) return

    await useHandleError(
        async () => {
            const response = await axios.get(`/api/exam/${exam_id.value}`)
            subjects.value = response.data.subjects.map((subject: any) => ({
                id: subject.id,
                subject: subject.subject,
                full_score: subject.full_score
            }))
        },
        null,
        loading
    )
}

async function update_subject(index: number) {
    const subject = subjects.value[index]
    if (!subject.subject) return

    await useHandleError(
        async () => {
            if (subject.isNew) {
                await axios.post(`/api/exam/${exam_id.value}/subjects`, {
                    subjects: [{
                        subject: subject.subject,
                        full_score: Number(subject.full_score)
                    }]
                })
                await refresh_subjects()
            } else {
                await axios.put(`/api/exam_subject/${subject.id}`, {
                    subject: subject.subject,
                    full_score: Number(subject.full_score)
                })
            }
        },
        subject.isNew ? '科目添加成功' : '科目信息更新成功',
        loading
    )
}

async function delete_subject(index: number) {
    const subject = subjects.value[index]
    if (subject.isNew) {
        subjects.value.splice(index, 1)
        return
    } else {
        if (!subject.id) return

        const confirmed = await useConfirmDeleteDialog('确定要删除该科目吗？')
        if (!confirmed) return

        await useHandleError(
            async () => {
                await axios.delete(`/api/exam_subject/${subject.id}`)
                subjects.value.splice(index, 1)
            },
            '科目删除成功',
            loading
        )
    }
}

async function refresh_subjects() {
    if (!exam_id.value) return
    
    await useHandleError(
        async () => {
            const response = await axios.get(`/api/exam/${exam_id.value}`)
            subjects.value = response.data.subjects.map((subject: any) => ({
                id: subject.id,
                subject: subject.subject,
                full_score: subject.full_score,
                isNew: false
            }))
        },
        null,
        loading
    )
}

function add_subject() {
    const new_subject: ExamSubjectForm = {
        id: null,
        subject: '',
        full_score: 100,
        isNew: true
    }
    subjects.value.push(new_subject)
}

function open_dialog(target_exam_id: number) {
    exam_id.value = target_exam_id
    update_subject_dialog_visible.value = true
    fetch_subjects()
}

const emit = defineEmits(['subjects-updated'])

function close_dialog() {
    update_subject_dialog_visible.value = false
    exam_id.value = null
    subjects.value = []
    emit('subjects-updated')
}

defineExpose({ open_dialog })
</script>

<template>
    <el-dialog v-model="update_subject_dialog_visible" title="编辑考试科目" width="800" @closed="close_dialog">
        <el-table :data="subjects" border>
            <el-table-column label="科目名称" min-width="200">
                <template #default="{ $index }">
                    <el-input v-model="subjects[$index].subject" required />
                </template>
            </el-table-column>

            <el-table-column label="满分分值" width="180">
                <template #default="{ $index }">
                    <el-input-number v-model.number="subjects[$index].full_score" :min="1" :controls="false" required />
                </template>
            </el-table-column>

            <el-table-column label="操作" width="180">
                <template #default="{ $index }">
                    <el-button type="primary" @click="update_subject($index)" :loading="loading">
                        {{ subjects[$index].isNew ? '添加' : '保存' }}
                    </el-button>
                    <el-button type="danger" link @click="delete_subject($index)">
                        {{ subjects[$index].isNew ? '取消' : '删除' }}
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <div style="margin-top: 10px; display: flex; gap: 10px">
            <el-button @click="add_subject">
                <i class="el-icon-plus" /> 添加科目
            </el-button>
            <el-button @click="refresh_subjects" :loading="loading">
                <i class="el-icon-refresh" /> 刷新
            </el-button>
        </div>
    </el-dialog>
</template>
