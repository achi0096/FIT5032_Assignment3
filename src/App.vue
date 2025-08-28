<template>
  <div>
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg bg-white border-bottom sticky-top">
  <div class="container-fluid">
    <!-- Brand: logo + small subtitle -->
    <router-link to="/" class="navbar-brand d-flex align-items-center gap-2">
      <img src="/logo.jpeg" alt="Youth Wellbeing logo" width="64" height="64" class="rounded-circle" />
      <div class="d-flex flex-column lh-1">
        <small class="text-muted text-decoration-underline">
          Youth Mental Health and Wellbeing
        </small>
      </div>
    </router-link>

    <button
      class="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navMain"
      aria-controls="navMain"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navMain">
      <ul class="navbar-nav ms-auto">
        <li class="nav-item"><router-link to="/" class="nav-link" exact-active-class="active">Home</router-link></li>
        <li class="nav-item"><router-link to="/resources" class="nav-link" exact-active-class="active">Resources</router-link></li>
        <li class="nav-item"><router-link to="/feedback" class="nav-link" exact-active-class="active">Feedback</router-link></li>
      </ul>
    </div>
  </div>
</nav>

<!-- Keep page content BELOW the navbar -->
<main class="py-4">
  <div class="container">
    <router-view />
  </div>
</main>

  </div>
</template>

<script>
export default { name: 'App' }
</script>

<style>

</style>
