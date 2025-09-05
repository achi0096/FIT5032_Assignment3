import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ResourcesView from '../views/ResourcesView.vue'
import LoginView from '../views/LoginView.vue'
import StudentView from '../views/StudentView.vue'
import TeacherView from '../views/TeacherView.vue'
import AboutView from '../views/AboutView.vue' // ratings page (both roles)

const routes = [
  { path: '/', name: 'Home', component: HomeView },
   { path: '/resources', name: 'Resources', component: ResourcesView },
  // pages for any logged-in user (student OR teacher)
  {
    path: '/about',
    name: 'About',
    component: AboutView,
    meta: { requiresAuth: true, roles: ['student', 'teacher'] },
  },

  // teacher-only page
  {
    path: '/teacher',
    name: 'Teacher',
    component: TeacherView,
    meta: { requiresAuth: true, roles: ['teacher'] },
  },

  // student-only page 
  {
    path: '/student',
    name: 'Student',
    component: StudentView,
    meta: { requiresAuth: true, roles: ['student'] },
  },

  { path: '/login', name: 'Login', component: LoginView },
]

const router = createRouter({ history: createWebHistory(), routes })

function getSession () {
  try {
    const loggedIn = localStorage.getItem('ymhw_logged_in') === 'yes'
    const u = JSON.parse(localStorage.getItem('ymhw_current_user') || '{}')
    const role = typeof u?.role === 'string' ? u.role : null
    const username = (u && (u.name || u.email)) ? (u.name || u.email) : null
    return { loggedIn, role, username }
  } catch (err) {
    return { loggedIn: false, role: null, username: null }
  }
}

router.beforeEach((to, from, next) => {
  const { loggedIn, role } = getSession()
  if (to.meta?.requiresAuth && !loggedIn)
    return next({ name: 'Login', query: { redirect: to.fullPath } })
  if (to.meta?.roles && !to.meta.roles.includes(role)) return next({ name: 'Home' })
  next()
})

export default router
