// index.js
import { createRouter, createWebHistory } from "vue-router";
import { auth } from "@/firebase/init";
import LoginView from '@/views/LoginView.vue';
import ResourcesView from '@/views/ResourcesView.vue';
import StudentView from '@/views/StudentView.vue';
import TeacherView from '@/views/TeacherView.vue';
import EmailSendView from "@/views/EmailSendView.vue";
import InteractiveTablesView from "@/views/InteractiveTablesView.vue";
import MapView from "@/views/MapView.vue";
import { onAuthStateChanged } from "firebase/auth";



const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login',     name: 'Login',     component: LoginView },
  { path: '/resources', name: 'Resources', component: ResourcesView, meta: { requiresAuth: true } },
  { path: '/student',   name: 'Student',   component: StudentView, meta: { requiresAuth: true } },
  { path: '/teacher',   name: 'Teacher',   component: TeacherView, meta: { requiresAuth: true } },
  { path: "/email", name: "Email", component: EmailSendView },
  { path: '/interactive-tables', name: 'InteractiveTablesView', component: InteractiveTablesView },
  { path: '/map', name: 'MapView', component: MapView }

];

const router = createRouter({ history: createWebHistory(import.meta.env.BASE_URL), routes });

const authReady = new Promise((resolve) => {
  const unsub = onAuthStateChanged(auth, () => {
    try { unsub && unsub() } catch {}
    resolve()
  })
  setTimeout(resolve, 2000)   // safety net
})

router.beforeEach(async (to, from, next) => {
  // Public routes render immediately
  if (!to.meta?.requiresAuth) return next()

router.afterEach(() => {
  requestAnimationFrame(() => {
    document.getElementById('main')?.focus();
  });
});

  // 🔒 Protected routes only: wait for auth state
  await authReady
  if (auth.currentUser) next()
  else next({ name: 'Login' })
})

// Optional: simple “auth ready” gate to avoid early redirects
// let authReady = new Promise(resolve => {
//   const off = auth.onAuthStateChanged(() => { off(); resolve(); });
// });

router.beforeEach(async (to) => {
  if (!to.meta.requiresAuth) return true;
  await authReady; // wait until Firebase knows the session
  return auth.currentUser ? true : { name: "Login", query: { redirect: to.fullPath } }; // <-- fixed name
});

export default router;
