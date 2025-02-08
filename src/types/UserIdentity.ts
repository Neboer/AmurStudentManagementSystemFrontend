export enum Identity {
    Student = 'student',
    Admin = 'admin',
    Default = 'default'
}

export function allow_access_page(user_identity: Identity, target_identity: Identity): boolean {
    if (user_identity === Identity.Default) {
        return target_identity === Identity.Default
    } else if (user_identity === Identity.Student) {
        return target_identity === Identity.Default || target_identity === Identity.Student
    } else if (user_identity === Identity.Admin) {
        return target_identity === Identity.Default || target_identity === Identity.Admin
    }
    return false
}
