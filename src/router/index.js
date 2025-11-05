// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import { auth } from "../firebase/init";
import { onAuthStateChanged } from "firebase/auth";

// ====== VIEWS ======
import LoginView from "@/views/LoginView.vue";
import ResourcesView from "@/views/ResourcesView.vue";
import StudentView from "@/views/StudentView.vue";
import TeacherView from "@/views/TeacherView.vue";
import AdminView from "@/views/AdminView.vue";
import EmailSendView from "@/views/EmailSendView.vue";
import InteractiveTablesView from "@/views/InteractiveTablesView.vue";
import MapView from "@/views/MapView.vue";
import ExportDataView from "@/views/ExportDataView.vue";
import ChartsView from "@/views/ChartsView.vue";
import BulkEmailView from "@/views/BulkEmailView.vue";
import AppointmentsView from "@/views/AppointmentsView.vue"; 
import AdminDashboardView from "@/views/AdminDashboardView.vue";

// ====== ROUTES ======
const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", name: "Login", component: LoginView },

  { path: "/resources", name: "Resources", component: ResourcesView, meta: { requiresAuth: true } },
  { path: "/student", name: "Student", component: StudentView, meta: { requiresAuth: true } },

  { path: "/student/appointment", name: "StudentAppointment", component: AppointmentsView, meta: { requiresAuth: true } },
  { path: "/teacher", name: "Teacher", component: TeacherView, meta: { requiresAuth: true } },
  { path: "/admin", name: "Admin", component: AdminView, meta: { requiresAuth: true } },

  { path: "/admin", name: "Admin", component: AdminView, meta: { requiresAuth: true, requireRole: "admin" } },
  { path: "/admin-dashboard", name: "AdminDashboardView", component: AdminDashboardView, 
    meta: { requiresAuth: true, requireRole: "admin" } },
  
  { path: "/email", name: "Email", component: EmailSendView },
  { path: "/interactive-tables", name: "InteractiveTablesView", component: InteractiveTablesView },
  { path: "/map", name: "MapView", component: MapView },
  { path: "/export", name: "ExportData", component: ExportDataView },
  { path: "/charts", name: "Charts", component: ChartsView },

  { path: "/appointments", redirect: "/student/appointment" },
  { path: "/bulk-email", name: "BulkEmail", component: BulkEmailView, meta: { requiresAuth: true, requireRole: "admin" } },

];

// ====== ROUTER SETUP ======
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// ====== Wait for Firebase Auth ======
const authReady = new Promise((resolve) => {
  const unsub = onAuthStateChanged(auth, () => {
    try {
      unsub && unsub();
    } catch {}
    resolve();
  });
  setTimeout(resolve, 2000); 
});


// Authentication guard for routes that require login
router.beforeEach(async (to, from, next) => {
  if (!to.meta?.requiresAuth) return next();

  // Wait for Firebase to initialize
  await authReady;

  if (auth.currentUser) next();
  else next({ name: "Login" });
});

// Accessibility: focus main after navigation
router.afterEach(() => {
  requestAnimationFrame(() => {
    document.getElementById("main")?.focus();
  });
});

export default router;
