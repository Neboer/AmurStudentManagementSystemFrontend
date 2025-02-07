// 根据当前用户的身份，重定向到用户的主页。管理员的主页是StudentManagement，。
import { useRouter } from 'vue-router'
import { useUserStore } from '../app-store'
import axios from 'axios'
import axios_element_handle_error from './axios_handle_error'
import { Identity } from '~/types/UserIdentity'


interface UserIdentityData {
    admin: boolean
    id: number
    // identity: 'student'
    name?: string
    phone_number?: string
    // identity: 'admin'
    username?: string
}

// 向服务器请求用户的身份信息，并根据身份信息更新用户的身份
export async function refresh_user_identity() {
    const userStore = useUserStore()
    
    await axios_element_handle_error(async () => {
        const response = await axios.get('/api/self')
        const user_data: UserIdentityData = response.data
        if (user_data.admin) {
            userStore.admin_login(user_data.id, user_data.username!)
        } else {
            userStore.student_login(user_data.id, user_data.name!, user_data.phone_number!)
        }
    }, null, "global", {
        "Unauthorized": "请先登录"
    })
}

// 根据用户的身份重定向到不同的页面
export function redirect_user_by_identity() {
    const router = useRouter()
    const userStore = useUserStore()

    if (userStore.identity === Identity.Admin) {
        router.push('/admin/StudentManagement')
    } else if (userStore.identity === Identity.Student) {
        router.push('/student/SomePage')
    } else {
        router.push('/login')
    }
}

export default async function refresh_and_redirect_user_by_identity() {
    await refresh_user_identity()
    redirect_user_by_identity()
}