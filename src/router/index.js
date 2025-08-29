import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ResourcesView from '../views/ResourcesView.vue'

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/resources', name: 'Resources', component: ResourcesView, meta: { needLogin: true } }
]

const router = createRouter({
  history: createWebHashHistory(), // URL like http://localhost:5173/#/
  routes
})

// very simple guard using localStorage flag 
router.beforeEach((to) => {
  const loggedIn = localStorage.getItem('ymhw_logged_in') === 'yes'
  if (to.meta && to.meta.needLogin && !loggedIn) {
    return { path: '/' }
  }
})

export default router
