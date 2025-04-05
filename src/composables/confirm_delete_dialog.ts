import { ElMessage, ElMessageBox } from 'element-plus'
import { getCurrentInstance } from 'vue'


export default function useDeleteDialog(prompt: string): Promise<boolean> {

    return ElMessageBox.confirm(
        prompt,
        'Warning',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(() => {
        return true
    }).catch((error) => {
        // 用户取消操作
        return false
    })
}
