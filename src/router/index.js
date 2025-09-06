import { createRouter, createWebHistory } from 'vue-router'
import ResourcesView from '../views/ResourcesView.vue'
import LoginView from '@/views/LoginView.vue'
import StudentView from '../views/StudentView.vue'
import TeacherView from '../views/TeacherView.vue'
import ResetPassword from '@/views/ResetPassword.vue'

const routes = [
  { path: '/resources', name: 'Resources', component: ResourcesView },
  { path: '/reset-password', name: 'ResetPassword', component: ResetPassword },
  
  // teacher-only page
  {
    path: '/teacher', name: 'Teacher', component: TeacherView,
    meta: { requiresAuth: true, roles: ['teacher'] },
  },

  // student-only page
  {
    path: '/student', name: 'Student', component: StudentView,
    meta: { requiresAuth: true, roles: ['student'] },
  },

  { path: '/login', name: 'Login', component: LoginView },
  { path: '/', redirect: { name: 'Login' } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // always scroll to the top
    return { left: 0, top: 0 }
  },
})

function getSession() {
  try {
    const loggedIn = localStorage.getItem('ymhw_logged_in') === 'yes'
    const u = JSON.parse(localStorage.getItem('ymhw_current_user') || '{}')
    const role = typeof u?.role === 'string' ? u.role : null
    const username = u && (u.name || u.email) ? u.name || u.email : null
    return { loggedIn, role, username }
  } catch (err) {
    return { loggedIn: false, role: null, username: null }
  }
}

router.beforeEach((to, from, next) => {
  const { loggedIn, role } = getSession()

  if (loggedIn && to.name === 'Login') return next('/resources')
  
  if (to.name === 'Student' && role !== 'student') return next('/resources')
  if (to.name === 'Teacher' && role !== 'teacher') return next('/resources')
  
  if (to.name === 'Resources' && !loggedIn) return next({ name: 'Login' })

  next()
})

export default router
