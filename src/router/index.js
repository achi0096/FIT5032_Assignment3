// index.js
import { createRouter, createWebHistory } from "vue-router";
import { auth } from "@/firebase/init";
import LoginView from '@/views/LoginView.vue';
import ResourcesView from '@/views/ResourcesView.vue';
import StudentView from '@/views/StudentView.vue';
import TeacherView from '@/views/TeacherView.vue';
import EmailSendView from "@/views/EmailSendView.vue";
import InteractiveTablesView from "@/views/InteractiveTablesView.vue";

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login',     name: 'Login',     component: LoginView },
  { path: '/resources', name: 'Resources', component: ResourcesView, meta: { requiresAuth: true } },
  { path: '/student',   name: 'Student',   component: StudentView, meta: { requiresAuth: true } },
  { path: '/teacher',   name: 'Teacher',   component: TeacherView, meta: { requiresAuth: true } },
  { path: "/email", name: "Email", component: EmailSendView },
  { path: '/interactive-tables', name: 'InteractiveTablesView', component: InteractiveTablesView }
];

const router = createRouter({ history: createWebHistory(), routes });

// Optional: simple “auth ready” gate to avoid early redirects
let authReady = new Promise(resolve => {
  const off = auth.onAuthStateChanged(() => { off(); resolve(); });
});

router.beforeEach(async (to) => {
  if (!to.meta.requiresAuth) return true;
  await authReady; // wait until Firebase knows the session
  return auth.currentUser ? true : { name: "Login", query: { redirect: to.fullPath } }; // <-- fixed name
});

export default router;
