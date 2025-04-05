import type { Ref } from 'vue'
import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ElLoading } from 'element-plus'
import { LoadingInstance } from 'element-plus/lib/components/loading/src/loading.js'

type ErrorCodeTable = Record<string, string>

type RequestFunc<T> = () => Promise<T>
type AlertErrorFunc = (title: string, message: string) => void

const status_code_table: Record<number, string> = {
    400: '请求格式错误',
    401: '未授权访问',
    403: '禁止访问',
    404: '资源未找到',
    500: '服务器内部错误',
    502: '网关错误',
    503: '服务不可用',
    504: '网关超时',
}

const element_alert_error: AlertErrorFunc = (title: string, message: string) => {
    return ElMessageBox.alert(message, title, {
        confirmButtonText: '确认',
    })
}

export default function useHandleError<T>(
    request_func: RequestFunc<T>,
    success_message: string | null = null,
    loading_ref_control: Ref<boolean> | null | 'global' = null,
    error_code_table: ErrorCodeTable = {},
) {
    // if (loading_ref_control && loading_ref_control !== 'global') {
    const loading_ref_control_is_global = loading_ref_control === 'global'
    let global_loading_instance: LoadingInstance | null = null

    if (loading_ref_control_is_global) {
        global_loading_instance = ElLoading.service({ fullscreen: true })
    } else if (loading_ref_control) {
        loading_ref_control.value = true
    }

    return (async () => {
        try {
            const result = await request_func()
            if (success_message)
                ElMessage({
                    message: success_message,
                    type: 'success',
                })
            return result
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                if (!error.response) {
                    // 网络错误
                    element_alert_error('网络错误', '无法连接到服务器，请检查您的网络。')
                }
                else {
                    const { status, data } = error.response
                    if (data && data.error) {
                        // 如果 error_code_table[data.error] 为''，则说明此错误被显式的忽略，不显示错误信息
                        if (error_code_table[data.error] === '') {
                            return null
                        } else {
                            // 使用 error_code_table 查找错误信息
                            const real_error_msg = error_code_table[data.error] || data.error
                            element_alert_error('请求错误', real_error_msg)
                        }
                    }
                    else {
                        // 根据 status_code_table 查找错误信息
                        const message = status_code_table[status] || `服务器响应错误: ${status}`
                        element_alert_error('请求错误', message)
                    }
                }
            }
            else {
                // 其他未知错误
                element_alert_error('未知错误', '发生了未知错误，请稍后重试。')
                console.error(error)
            }
            return null
        }
        finally {
            if (loading_ref_control_is_global) {
                global_loading_instance?.close()
            } else if (loading_ref_control) {
                loading_ref_control.value = false
            }
        }
    })()
}
