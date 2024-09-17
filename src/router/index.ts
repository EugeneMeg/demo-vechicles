import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'Home',
            component: () => import('../views/HomeView.vue')
        },
        {
            path: '/profile',
            name: 'About',
            component: () => import('../views/ProfileView.vue')
        },
        {
            path: '/settings',
            name: 'Settings',
            component: () => import('../views/SettingView.vue')
        },
    ]
})

export default router
