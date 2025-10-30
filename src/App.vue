<template>
  <!-- Skip link (keyboard accessible) -->
  <a class="skip-link" href="#main">Skip to main content</a>

  <div>
    <!-- Header / Navbar -->
    <nav
      class="navbar navbar-light bg-light border-bottom sticky-top"
      aria-label="Primary"
    >
      <div class="container d-flex justify-content-between align-items-center">
        <!-- Left: Brand -->
        <div class="d-flex align-items-center gap-2">
          <router-link
            to="/"
            class="navbar-brand d-flex align-items-center gap-2 text-decoration-none"
          >
            <img
              src="/logo.jpeg"
              alt="Youth Mental Health and Wellbeing logo"
              width="48"
              height="48"
              class="rounded-circle"
            />
            <span class="fst-italic text-decoration-underline">
              Youth Mental Health and Wellbeing
            </span>
          </router-link>
        </div>

        <!-- Right: Buttons -->
        <div class="d-flex align-items-center gap-3">
          <!-- Get Support (always visible) -->
          <button class="btn btn-primary btn-sm" @click="showSupport = true">
            Get Support Now
          </button>

          <!-- Dynamic top-right nav buttons -->
          <router-link
            v-for="b in navButtons"
            :key="b.to"
            :to="b.to"
            class="btn btn-outline-secondary btn-sm">
            {{ b.label }}
          </router-link>

          <!-- Back button on Student/Teacher pages -->
          <BackButton v-if="showBackBtn" class="me-2" fallback="/resources" />

          <!-- User dropdown when logged in -->
          <div v-if="isLoggedIn" class="dropdown">
            <button
              class="btn btn-sm btn-outline-secondary dropdown-toggle d-flex align-items-center gap-1"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <div class="avatar">{{ userInitial }}</div>
              <span class="user-name">
                {{ currentUserName }}
                <span
                  v-if="role"
                  class="role-badge text-uppercase ms-1 px-2 py-0 rounded-pill"
                >
                  {{ role }}
                </span>
              </span>
            </button>
            <ul class="dropdown-menu dropdown-menu-end">
              <li v-if="role === 'student'">
                <router-link class="dropdown-item" to="/student"
                  >Student Area</router-link
                >
              </li>
              <li v-if="role === 'teacher'">
                <router-link class="dropdown-item" to="/teacher"
                  >Teacher Area</router-link
                >
              </li>
              <li><hr class="dropdown-divider" /></li>
              <li>
                <a href="#" class="dropdown-item" @click.prevent="logout"
                  >Sign out</a
                >
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main content landmark -->
    <main id="main" tabindex="-1" class="py-4">
      <div class="container">
        <router-view />
      </div>
    </main>

    <!-- Footer -->
    <footer class="border-top mt-4">
      <div class="container text-center py-3 small">
        <button class="btn btn-link p-0 me-3" @click="showCrisis = true">
          Crisis Help
        </button>
        |
        <button class="btn btn-link p-0 mx-3" @click="showAccessibility = true">
          Accessibility
        </button>
        |
        <button class="btn btn-link p-0 ms-3" @click="showPrivacy = true">
          Privacy Policy
        </button>
      </div>
    </footer>

    <!-- Support Modal -->
    <div
      v-if="showSupport"
      class="modal fade show d-block"
      tabindex="-1"
      role="dialog"
      aria-modal="true"
    >
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Need support now?</h5>
            <button
              type="button"
              class="btn-close"
              @click="showSupport = false"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <p class="small text-muted mb-3">
              If you or someone else is in immediate danger, call
              <strong>000</strong>.
            </p>
            <ul class="list-group">
              <li
                v-for="(r, i) in supportList"
                :key="i"
                class="list-group-item d-flex justify-content-between align-items-start"
              >
                <div>
                  <div class="fw-bold">{{ r.name }}</div>
                  <div class="small text-muted">{{ r.hours }}</div>
                </div>
                <a :href="'tel:' + r.phone" class="btn btn-sm btn-success">{{
                  r.phone
                }}</a>
              </li>
            </ul>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="showSupport = false"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showSupport" class="modal-backdrop fade show"></div>

    <!-- Crisis Modal -->
    <div
      v-if="showCrisis"
      class="modal fade show d-block"
      tabindex="-1"
      role="dialog"
      aria-modal="true"
    >
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Crisis Help</h5>
            <button
              type="button"
              class="btn-close"
              @click="showCrisis = false"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <p class="small text-muted mb-3">
              If you or someone else is in immediate danger, call
              <strong>000</strong>.
            </p>
            <ul class="list-group">
              <li
                class="list-group-item d-flex justify-content-between align-items-start"
              >
                <div>
                  <div class="fw-bold">Lifeline (24/7)</div>
                  <div class="small text-muted">24 hours</div>
                </div>
                <a href="tel:131114" class="btn btn-sm btn-success">13 11 14</a>
              </li>
              <li
                class="list-group-item d-flex justify-content-between align-items-start"
              >
                <div>
                  <div class="fw-bold">Beyond Blue</div>
                  <div class="small text-muted">24 hours</div>
                </div>
                <a href="tel:1300224636" class="btn btn-sm btn-success"
                  >1300 224 636</a
                >
              </li>
              <li
                class="list-group-item d-flex justify-content-between align-items-start"
              >
                <div>
                  <div class="fw-bold">Kids Helpline</div>
                  <div class="small text-muted">24 hours</div>
                </div>
                <a href="tel:1800551800" class="btn btn-sm btn-success"
                  >1800 55 1800</a
                >
              </li>
            </ul>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="showCrisis = false"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showCrisis" class="modal-backdrop fade show"></div>

    <!-- Accessibility Modal -->
    <div
      v-if="showAccessibility"
      class="modal fade show d-block"
      tabindex="-1"
      role="dialog"
      aria-modal="true"
    >
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Accessibility</h5>
            <button
              type="button"
              class="btn-close"
              @click="showAccessibility = false"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <ul class="small">
              <li>Keyboard accessible navigation and forms</li>
              <li>High-contrast text and sufficient color contrast</li>
              <li>Descriptive labels and ARIA attributes where needed</li>
              <li>Responsive layout for mobile and desktop</li>
            </ul>
            <p class="small text-muted mb-0">
              If you need adjustments, let us know.
            </p>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="showAccessibility = false"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showAccessibility" class="modal-backdrop fade show"></div>

    <!-- Privacy Modal -->
    <div
      v-if="showPrivacy"
      class="modal fade show d-block"
      tabindex="-1"
      role="dialog"
      aria-modal="true"
    >
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Privacy Policy</h5>
            <button
              type="button"
              class="btn-close"
              @click="showPrivacy = false"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <p class="small">
              We store your account details locally in your browser
              (LocalStorage) for demo purposes. No data is sent to a server. You
              can remove your data by signing out and clearing your browser
              storage.
            </p>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="showPrivacy = false"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showPrivacy" class="modal-backdrop fade show"></div>
  </div>
</template>

<script>
import BackButton from "@/components/BackButton.vue";

export default {
  name: "App",
  components: { BackButton },
  data() {
    return {
      isLoggedIn: false,
      currentUserName: "",
      role: "",
      showSupport: false,
      showCrisis: false,
      showAccessibility: false,
      showPrivacy: false,
      supportList: [
        { name: "Lifeline (24/7)", phone: "131114", hours: "24 hours" },
        { name: "Kids Helpline", phone: "1800551800", hours: "24 hours" },
        { name: "Beyond Blue", phone: "1300224636", hours: "24 hours" },
      ],
    };
  },
  computed: {
    showBackBtn() {
      const name = this.$route?.name || "";
      return name === "Student" || name === "Teacher";
    },
    userInitial() {
      const n = (this.currentUserName || "").trim();
      return n ? n.charAt(0).toUpperCase() : "U";
    },
    page() {
      const n = (this.$route?.name || "").toString().toLowerCase();
      const p = (this.$route?.path || "").toString().toLowerCase();
      if (n.includes("login") || p === "/login") return "login";
      if (n.includes("email") || p.startsWith("/email")) return "email";
      if (n.includes("table") || p.includes("/interactive-tables"))
        return "tables"; 
      return "other";
    },
    navButtons() {
      let items = [];
      switch (this.page) {
        case "login":
          items = [
            { to: "/email", label: "Email" },
            { to: "/interactive-tables", label: "Tables" },
          ];
          break;
        case "email":
          items = [
            { to: "/login", label: "Login" },
            { to: "/interactive-tables", label: "Tables" },
          ];
          break;
        case "tables":
          items = [
            { to: "/email", label: "Email" },
            { to: "/login", label: "Login" },
          ];
          break;
        default:
          items = [];
      }
      if (this.isLoggedIn) items = items.filter((b) => b.label !== "Login");
      return items;
    },
  },
  created() {
    this.checkLogin();
  },
  mounted() {
    window.addEventListener("auth-changed", this.checkLogin);
    window.addEventListener("storage", this.checkLogin);
  },
  beforeUnmount() {
    window.removeEventListener("auth-changed", this.checkLogin);
    window.removeEventListener("storage", this.checkLogin);
  },
  watch: { $route() { this.checkLogin(); } },
  methods: {
    safeParse(json, fallback) {
      try {
        return JSON.parse(json) ?? fallback;
      } catch {
        return fallback;
      }
    },
    checkLogin() {
      this.isLoggedIn = localStorage.getItem("ymhw_logged_in") === "yes";
      const u = this.safeParse(localStorage.getItem("ymhw_current_user"), {});
      this.currentUserName =
        u && (u.name || u.email) ? u.name || u.email : "";
      this.role = typeof u?.role === "string" ? u.role : "";
    },
    logout() {
      localStorage.removeItem("ymhw_logged_in");
      localStorage.removeItem("ymhw_current_user");
      this.checkLogin();
      window.dispatchEvent(new Event("auth-changed"));
      this.$router.push("/");
    },
  },
};
</script>

<style>
/* --- accessibility additions (global) --- */
:focus {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}

.skip-link {
  position: absolute;
  left: -9999px;
  top: auto;
}
.skip-link:focus {
  left: 1rem;
  top: 1rem;
  background: #fff;
  border: 1px solid;
  padding: 0.5rem 1rem;
  z-index: 9999;
}

@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}

/* --- component-scoped styles --- */
.avatar {
  width: 22px;
  height: 22px;
  line-height: 22px;
  text-align: center;
  border-radius: 50%;
  background: #e9ecef;
  font-weight: 600;
}
.user-name {
  max-width: 140px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.dropdown-menu .dropdown-item {
  font-size: 0.875rem;
  text-decoration: none;
  padding: 0.25rem 0.75rem;
}
.role-badge {
  background-color: #28a745;
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.5px;
}
.dropdown-menu .dropdown-item:hover,
.dropdown-menu .dropdown-item:focus {
  text-decoration: underline;
}
</style>
