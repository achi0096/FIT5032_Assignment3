import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ResourcesView from '../views/ResourcesView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/resources', name: 'resources', component: ResourcesView }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
