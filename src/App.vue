<template>
  <div>
    <!-- Header -->
    <nav class="navbar navbar-light bg-light border-bottom sticky-top">
      <div class="container d-flex justify-content-between align-items-center">

        <!-- Left: Brand -->
        <div class="d-flex align-items-center gap-2">
          <router-link to="/" class="navbar-brand d-flex align-items-center gap-2">
            <img src="/logo.jpeg" alt="logo" width="48" height="48" class="rounded-circle" />
            <span class="fst-italic text-decoration-underline">
              Youth Mental Health and Wellbeing
            </span>
          </router-link>
        </div>

        <!-- Right side -->
        <div class="d-flex align-items-center gap-3">
          <!-- Get Support (always visible) -->
          <button class="btn btn-primary btn-sm" @click="showSupport = true">
            Get Support Now
          </button>

          <!-- Login on info pages only -->
          <router-link v-if="showLoginBtn" :to="{ name: 'Login' }" class="btn btn-outline-secondary btn-sm">
            Login
          </router-link>

          <!-- Back button on all other pages except Home/Login -->
          <BackButton v-if="!showLoginBtn && $route.name !== 'Login' && this.$route.name !== 'Login'" class="me-2"
            fallback="/resources" /> 

          <!-- User dropdown -->
          <div v-if="isLoggedIn" class="dropdown">
            <button class="btn btn-sm btn-outline-secondary dropdown-toggle d-flex align-items-center gap-1"
              type="button" data-bs-toggle="dropdown" aria-expanded="false">
              <div class="avatar">{{ userInitial }}</div>
              <span class="user-name">{{ currentUserName }}</span>
            </button>
            <ul class="dropdown-menu dropdown-menu-end">
              <li v-if="role === 'student'">
                <router-link class="dropdown-item" to="/student">Student Area</router-link>
              </li>
              <li v-if="role === 'teacher'">
                <router-link class="dropdown-item" to="/teacher">Teacher Area</router-link>
              </li>
              <li>
                <hr class="dropdown-divider" />
              </li>
              <li><button class="dropdown-item" @click="logout">Sign out</button></li>
            </ul>
          </div>
        </div>
      </div>
    </nav>

    <!-- Page content -->
    <main class="py-4">
      <div class="container">
        <router-view />
      </div>
    </main>

    <!-- Footer -->
    <footer class="border-top mt-4">
      <div class="container text-center py-3 small">
        <router-link to="/crisis" class="me-3">Crisis Help</router-link> |
        <router-link to="/accessibility" class="mx-3">Accessibility</router-link> |
        <router-link to="/privacy" class="ms-3">Privacy Policy</router-link>
      </div>
    </footer>

    <!-- Support Modal -->
    <div v-if="showSupport" class="modal fade show d-block" tabindex="-1" role="dialog" aria-modal="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Need support now?</h5>
            <button type="button" class="btn-close" @click="showSupport = false" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p class="small text-muted mb-3">
              If you or someone else is in immediate danger, call <strong>000</strong>.
            </p>
            <ul class="list-group">
              <li v-for="(r, i) in supportList" :key="i"
                class="list-group-item d-flex justify-content-between align-items-start">
                <div>
                  <div class="fw-bold">{{ r.name }}</div>
                  <div class="small text-muted">{{ r.hours }}</div>
                </div>
                <a :href="'tel:' + r.phone" class="btn btn-sm btn-success">{{ r.phone }}</a>
              </li>
            </ul>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showSupport = false">Close</button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showSupport" class="modal-backdrop fade show"></div>
  </div>
</template>

<script>
import BackButton from '@/components/BackButton.vue'

export default {
  name: 'App',
  components: { BackButton },
  data() {
    return {
      isLoggedIn: false,
      currentUserName: '',
      role: '',
      showSupport: false,
      supportList: [
        { name: 'Lifeline (24/7)', phone: '131114', hours: '24 hours' },
        { name: 'Kids Helpline', phone: '1800551800', hours: '24 hours' },
        { name: 'Beyond Blue', phone: '1300224636', hours: '24 hours' }
      ]
    }
  },
  computed: {
    // Show the Login button on info pages 
    showLoginBtn() {
      const name = this.$route?.name || ''
      const special = new Set(['Crisis Help', 'Accessibility', 'Privacy Policy'])
      return special.has(name)
    },
    userInitial() {
      const n = (this.currentUserName || '').trim()
      return n ? n.charAt(0).toUpperCase() : 'U'
    }
  },
  created() { this.checkLogin() },
  mounted() {
    window.addEventListener('auth-changed', this.checkLogin)
    window.addEventListener('storage', this.checkLogin)
  },
  beforeUnmount() {
    window.removeEventListener('auth-changed', this.checkLogin)
    window.removeEventListener('storage', this.checkLogin)
  },
  watch: { $route() { this.checkLogin() } },
  methods: {
    safeParse(json, fallback) { try { return JSON.parse(json) ?? fallback } catch { return fallback } },
    checkLogin() {
      this.isLoggedIn = localStorage.getItem('ymhw_logged_in') === 'yes'
      const u = this.safeParse(localStorage.getItem('ymhw_current_user'), {})
      this.currentUserName = (u && (u.name || u.email)) ? (u.name || u.email) : ''
      this.role = typeof u?.role === 'string' ? u.role : ''
    },
    logout() {
      localStorage.removeItem('ymhw_logged_in')
      localStorage.removeItem('ymhw_current_user')
      this.checkLogin()
      window.dispatchEvent(new Event('auth-changed'))
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
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

.dropdown-menu {
  min-width: auto !important;
  width: 100% !important;
  padding: 0.25rem 0;
  font-size: 0.85rem;
  text-align: left;
}

.dropdown-menu .dropdown-item {
  padding: 0.25rem 0.75rem;
}
</style>
