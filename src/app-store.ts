import { identity, set } from '@vueuse/core'
import { defineStore } from 'pinia'
import { Identity } from '~/types/UserIdentity'

export const useUserStore = defineStore('user', {
    state: () => ({
        identity: Identity.Default,
        id: 0,
        name: '',
        phone_number: '',
        username: ''
    }),

    actions: {
        student_login(id: number, name: string, phone_number: string) {
            this.identity = Identity.Student
            this.id = id
            this.name = name
            this.phone_number = phone_number
        },
        admin_login(id: number, username: string) {
            this.identity = Identity.Admin
            this.id = id
            this.username = username
        },
        logout() {
            this.identity = Identity.Default
            this.id = 0
            this.name = ''
            this.phone_number = ''
            this.username = ''
        }
    }
})
