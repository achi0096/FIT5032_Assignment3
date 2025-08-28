import { createRouter, createWebHashHistory } from 'vue-router'

// Correct import paths
import HomeView from '../views/HomeView.vue'
// import ResourcesView from '../views/ResourcesView.vue'
// import FeedbackView from '../views/FeedbackView.vue'

const routes = [
  { path: '/', name: 'Home', component: HomeView }
  // { path: '/resources', name: 'Resources', component: ResourcesView },
  // { path: '/feedback', name: 'Feedback', component: FeedbackView }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
