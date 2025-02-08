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
import { useUserStore } from '~/app-store'
import redirect_user_by_identity, { refresh_user_identity, get_default_route_by_identity } from './snippets/redirect_user_by_identity'
import { Identity } from './types/UserIdentity'
import { allow_access_page } from './types/UserIdentity'

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
        ctx.router.beforeEach(async (to, from, next) => {
            const user_store = useUserStore(pinia)
            const route = ctx.router.currentRoute.value
            const router = ctx.router
            // 如果用户访问的路由所需权限发生了变化，则执行一次权限刷新检查用户是否有权访问此页面，否则根据默认规则重定向。
            const get_uri_identity = (uri: string): Identity => {
                const pathSegments = uri.split('/')
                const uri_identity_str = pathSegments[1]
                let uri_identity: Identity = Identity.Default
                if (uri_identity_str === 'admin') {
                    uri_identity = Identity.Admin
                } else if (uri_identity_str === 'student') {
                    uri_identity = Identity.Student
                }
                return uri_identity
            }

            if (get_uri_identity(from.path) !== get_uri_identity(to.path)) {
                // 用户访问的路由所需权限发生了变化，执行一次权限刷新，并判断用户是否有权访问此页面。
                await refresh_user_identity(user_store)
                // 刷新完用户身份后，如果用户没有权限访问当前页面，则重定向到他自己的权限主页
                // 权限的对应规则：学生可以访问学生页面和默认页面，管理员可以访问管理员页面和默认页面，默认用户只能访问默认页面。
                const target_identity = get_uri_identity(to.path)
                const user_identity = user_store.identity
                if (!allow_access_page(user_identity, target_identity)) {
                    const default_route = get_default_route_by_identity(user_store)
                    next(default_route)
                } else {
                    next()
                }
            } else {
                next()
            }
        })
        Object.values(import.meta.glob<{ install: UserModule }>('./modules/*.ts', { eager: true }))
            .forEach(i => i.install?.(ctx))
    }
)
