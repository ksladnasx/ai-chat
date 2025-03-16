import { createRouter, createWebHistory } from 'vue-router'
import Wrong from '../views/Wrong.vue'
import Chat from '../views/Chat.vue'
import Login from '../views/Login.vue'



const routes = [
  {
    path: '/',
    redirect: '/chat'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/chat',
    name: 'Chat',
    component:Chat,
    meta: { requiresAuth: true }
  },
  {
    path:'/wrong',
    name: 'Wrong',
    component: Wrong
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach ((to, _from, next) => {
  const isAuthenticated = localStorage.getItem('userInfo')
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router