<template>
  <div>
    <nav class="navbar navbar-light bg-light border-bottom sticky-top">
      <div class="container d-flex align-items-center">
        <!-- Brand (left) -->
        <router-link to="/" class="navbar-brand d-flex align-items-center gap-2">
          <img src="/logo.jpeg" alt="logo" width="40" height="40" class="rounded-circle" />
          <span>Youth Mental Health and Wellbeing</span>
        </router-link>

        <!-- Right side: links + Sign out -->
        <div class="ms-auto d-flex align-items-center gap-2">
          <ul class="nav">
            <li class="nav-item"><router-link to="/" class="nav-link" active-class="active">Home</router-link></li>
            <li class="nav-item"><router-link to="/resources" class="nav-link" active-class="active">Resources</router-link></li>
            <li class="nav-item"><router-link to="/about" class="nav-link" active-class="active">About</router-link></li>
          </ul>

          <!-- Sign out (rightmost) -->
          <button
            v-if="isLoggedIn"
            class="btn btn-sm btn-outline-secondary"
            @click="logout"
          >
            Sign out
          </button>
        </div>
      </div>
    </nav>

    <main class="py-4">
      <div class="container">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return { isLoggedIn: false }
  },
  created() {
    this.checkLogin()
  },
  mounted() {
    window.addEventListener('auth-changed', this.checkLogin) // same tab
    window.addEventListener('storage', this.checkLogin)      // other tabs
  },
  beforeUnmount() {
    window.removeEventListener('auth-changed', this.checkLogin)
    window.removeEventListener('storage', this.checkLogin)
  },
  watch: { $route() { this.checkLogin() } },
  methods: {
    checkLogin() {
      this.isLoggedIn = localStorage.getItem('ymhw_logged_in') === 'yes'
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
