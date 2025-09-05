<template>
  <div>
    <!-- Header -->
    <nav class="navbar navbar-light bg-light border-bottom sticky-top">
      <div class="container d-flex align-items-center">
        <!-- Brand (left) -->
        <router-link to="/" class="navbar-brand d-flex align-items-center gap-2">
          <img src="/logo.jpeg" alt="logo" width="48" height="48" class="rounded-circle" />
          <span class="fst-italic text-decoration-underline">
            Youth Mental Health and Wellbeing
          </span>
        </router-link>

        <!-- Right side (consistent on all pages) -->
        <div class="ms-auto d-flex align-items-center gap-2">
          <!-- Get Support (always visible) -->
          <button class="btn btn-primary btn-sm" @click="showSupport = true">
            Get Support Now
          </button>
          
          <!-- Role links -->
          <router-link
            v-if="isLoggedIn && role === 'student'"
            class="btn btn-outline-primary btn-sm"
            to="/student"
          >
            Student
          </router-link>
          <router-link
            v-if="isLoggedIn && role === 'teacher'"
            class="btn btn-outline-primary btn-sm"
            to="/teacher"
          >
            Teacher
          </router-link>
          
          <!-- User chip (only when logged in) -->
          <div v-if="isLoggedIn" class="user-chip">
            <div class="avatar">{{ userInitial }}</div>
            <span class="user-name">{{ currentUserName }}</span>
          </div>

          <!-- Sign out (only when logged in) -->
          <button v-if="isLoggedIn" class="btn btn-sm btn-outline-secondary" @click="logout">
            Sign out
          </button>
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
        <a href="#" class="me-3">Crisis Help</a> |
        <a href="#" class="mx-3">Accessibility</a> |
        <a href="#" class="ms-3">Privacy Policy</a>
      </div>
    </footer>

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
            <router-link to="/resources" class="btn btn-link">More resources</router-link>
            <button type="button" class="btn btn-secondary" @click="showSupport = false">Close</button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showSupport" class="modal-backdrop fade show"></div>
  </div>
</template>

<script>
export default {
  name: 'App',
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
    userInitial() {
      const n = (this.currentUserName || '').trim()
      return n ? n.charAt(0).toUpperCase() : 'U'
    }
  },
  created() {
    this.checkLogin()
  },
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
    safeParse(json, fallback) {
      try { return JSON.parse(json) ?? fallback } catch (err) { return fallback }
    },
    checkLogin() {
      this.isLoggedIn = localStorage.getItem('ymhw_logged_in') === 'yes'
      const u = this.safeParse(localStorage.getItem('ymhw_current_user'), {})
      this.currentUserName = (u && (u.name || u.email)) ? (u.name || u.email) : ''
      this.role = typeof u?.role === 'string' ? u.role : ''     // <- expose role
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
/* Small pill with initial + name at top right corner*/
.user-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.2rem 0.5rem;
  border: 1px solid #dee2e6;
  border-radius: 9999px;
  background: #fff;
  font-size: 0.875rem;
}

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
  max-width: 180px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
