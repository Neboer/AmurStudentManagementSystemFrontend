<script setup lang="ts">
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

axios.post('/api/logout', {}, {
    withCredentials: true,
})

router.push('/login')
</script>

<template>
    <h1 style="display: flex; justify-content: center; align-items: center">正在退出</h1>
</template>
