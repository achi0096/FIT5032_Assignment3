<template>
  <div class="container my-4">
    <h2 class="mb-2">Teacher Area</h2>
    <p class="text-muted">Hi, {{ displayName }}. This page is only for teachers.</p>

    <div class="card">
      <div class="card-body">
        <h5 class="card-title">Quick links</h5>
        <ul class="mb-0">
          <li><router-link to="/resources">Manage / view resources</router-link></li>
          <li><a href="#" @click.prevent="$router.back()">Go back</a></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TeacherView',
  data() {
    return { displayName: 'Teacher' }
  },
  created() {
    try {
      const u = JSON.parse(localStorage.getItem('ymhw_current_user') || 'null')
      this.displayName = (u && (u.name || u.email)) ? (u.name || u.email) : 'Teacher'
    } catch (_) {}
  }
}
</script>
