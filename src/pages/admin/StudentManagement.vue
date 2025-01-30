<script lang="ts" setup>
import axios from 'axios'
import { onMounted, reactive, ref } from 'vue'

const student_table_data = ref([])
const table_loading = ref(true)

async function refresh_student_table() {
    await axios.get('/api/student').then((response) => {
        student_table_data.value = response.data
        table_loading.value = false
    })
}

onMounted(() => {
    refresh_student_table()
})

// Student: id?: number     name: string     phone_number: string     password: string
</script>

<template>
    <el-button type="primary" @click="student_dialog_visible = true">
        添加学生
    </el-button>

    <el-table v-loading="table_loading" :data="student_table_data" stripe style="width: 100%" empty-text="没有学生">
        <el-table-column prop="name" label="姓名" width="180" />
        <el-table-column prop="phone_number" label="电话号码" />
        <el-table-column label="操作" min-width="120">
            <template #default>
                <el-button link type="primary" size="small" @click="add_student">
                    编辑
                </el-button>
                <el-button link type="danger" size="small">
                    删除
                </el-button>
            </template>
        </el-table-column>
    </el-table>
</template>
