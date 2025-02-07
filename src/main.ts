import type { UserModule } from './types'
import { ViteSSG } from 'vite-ssg'

import { routes } from 'vue-router/auto-routes'
import App from './App.vue'

import '~/styles/index.scss'

import 'uno.css'
// If you want to use ElMessage, import it.
import 'element-plus/theme-chalk/src/message.scss'
import 'element-plus/theme-chalk/src/message-box.scss'
import { createPinia } from 'pinia'

// code from https://github.com/posva/unplugin-vue-router/issues/107#issuecomment-2298388066
// redirect / to /login, because we have no "homepage" so ...
routes.push({
    path: '/',
    redirect: '/login',
})

const pinia = createPinia()

export const createApp = ViteSSG(
    App,
    {
        routes,
        base: import.meta.env.BASE_URL,
    },
    (ctx) => {
        ctx.app.use(pinia)
        Object.values(import.meta.glob<{ install: UserModule }>('./modules/*.ts', { eager: true }))
            .forEach(i => i.install?.(ctx))
    }
)
