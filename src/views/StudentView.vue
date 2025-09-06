<template>
  <div class="container my-4">
    <h2 class="mb-2">Student Area</h2>
    <p class="text-muted">Hi, {{ displayName }}. This page is only for students.</p>

    <div class="card">
      <div class="card-body">
        <h5 class="card-title">Quick links</h5>
        <ul class="mb-0">
          <li><router-link to="/resources">Browse resources</router-link></li>
          <li><a href="#" @click.prevent="$router.back()">Go back</a></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StudentView',
  data() {
    return { displayName: 'Student' }
  },
  created() {
    try {
      const u = JSON.parse(localStorage.getItem('ymhw_current_user') || 'null')
      this.displayName = (u && (u.name || u.email)) ? (u.name || u.email) : 'Student'
    } catch (_) {}
  }
}
</script>
