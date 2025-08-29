<template>
  <nav class="navbar navbar-light bg-light border-bottom">
    <div class="container">
      <router-link to="/" class="navbar-brand d-flex align-items-center gap-2">
        <img src="/logo.jpeg" alt="logo" width="40" height="40" class="rounded-circle" />
        <span>Youth Mental Health and Wellbeing</span>
      </router-link>

      <ul class="nav">
        <li class="nav-item"><router-link to="/" class="nav-link" active-class="active">Home</router-link></li>
        <li class="nav-item"><router-link to="/resources" class="nav-link" active-class="active">Resources</router-link></li>
        <li class="nav-item"><router-link to="/about" class="nav-link" active-class="active">About</router-link></li>
        <li class="nav-item" v-if="isLoggedIn">
          <button class="btn btn-sm btn-outline-secondary ms-2" @click="logout">Logout</button>
        </li>
      </ul>
    </div>
  </nav>

  <main class="py-4">
    <div class="container">
      <router-view></router-view>
    </div>
  </main>
</template>

<script>
export default {
  name: 'App',
  data() {
    return { isLoggedIn: localStorage.getItem('ymhw_logged_in') === 'yes' }
  },
  methods: {
    logout() {
      localStorage.removeItem('ymhw_logged_in')
      localStorage.removeItem('ymhw_current_user')
      this.isLoggedIn = false
      this.$router.push('/')
    }
  },
  created() {
    // keep nav in sync on refresh
    window.addEventListener('storage', () => {
      this.isLoggedIn = localStorage.getItem('ymhw_logged_in') === 'yes'
    })
  }
}
</script>
