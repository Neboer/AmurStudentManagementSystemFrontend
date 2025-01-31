export interface AddStudentDialogForm {
    name: string
    phone_number: string
    init_password: string
    set_init_password_same_as_phone_number: boolean
}

export const default_add_student_dialog_form: AddStudentDialogForm = {
    name: '',
    phone_number: '',
    init_password: '',
    set_init_password_same_as_phone_number: true,
}
