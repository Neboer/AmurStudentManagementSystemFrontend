import type { UserModule } from './types'
import axios from 'axios'
import { ViteSSG } from 'vite-ssg'
import { routes } from 'vue-router/auto-routes'
import App from './App.vue'

import '~/styles/index.scss'

import 'uno.css'
// If you want to use ElMessage, import it.
import 'element-plus/theme-chalk/src/message.scss'
import 'element-plus/theme-chalk/src/message-box.scss'

// code from https://github.com/posva/unplugin-vue-router/issues/107#issuecomment-2298388066
routes.push({
    path: '/',
    redirect: '/login',
})

export const createApp = ViteSSG(
    App,
    {
        routes,
        base: import.meta.env.BASE_URL,
    },
    (ctx) => {
        Object.values(import.meta.glob<{ install: UserModule }>('./modules/*.ts', { eager: true }))
            .forEach(i => i.install?.(ctx))

        ctx.router.beforeEach(async (to, from, next) => {
            if (to.path === '/login') {
                next()
                return
            }

            try {
                const response = await axios.get('/api/verify-session', {
                    withCredentials: true,
                })

                if (response.data.status === 'ok') {
                    next()
                }
                else {
                    next({ path: '/login' })
                }
            }
            catch (error) {
                console.error('Session verification failed', error)
                next({ path: '/login' })
            }
        })
    },
)
