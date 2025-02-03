import { ElMessage, ElMessageBox } from 'element-plus'

export default async function open_delete_dialog(prompt: string, success_message: string): Promise<boolean> {
    try {
        await ElMessageBox.confirm(
            prompt,
            'Warning',
            {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning',
            }
        )

        ElMessage({
            type: 'success',
            message: success_message,
        })

        return true
    } catch (error) {
        // 用户取消操作
        return false
    }
}
