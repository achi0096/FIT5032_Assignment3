<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// Normalise current page (works even if route names differ)
const page = computed(() => {
  const n = (route.name ?? '').toString().toLowerCase()
  const p = (route.path ?? '').toLowerCase()

  if (n.includes('login') || p === '/login') return 'login'
  if (n.includes('email') || p.startsWith('/email')) return 'email'
  if (n.includes('table') || p.includes('interactive-tables')) return 'tables'
  return 'other'
})

// Decide which buttons to show
const navButtons = computed(() => {
  switch (page.value) {
    case 'login':
      return [
        { to: '/email', label: 'Email' },
        { to: '/interactive-tables', label: 'Tables' },
      ]
    case 'email':
      return [
        { to: '/login', label: 'Login' },
        { to: '/interactive-tables', label: 'Tables' },
      ]
    case 'tables':
      return [
        { to: '/email', label: 'Email' },
        { to: '/login', label: 'Login' },
      ]
    default:
      // fallback (optional)
      return [
        { to: '/login', label: 'Login' },
        { to: '/email', label: 'Email' },
        { to: '/interactive-tables', label: 'Tables' },
      ]
  }
})
</script>

<template>
  <nav class="navbar navbar-light bg-light border-bottom sticky-top">
    <div class="container d-flex justify-content-between align-items-center">

      <!-- Brand -->
      <router-link to="/resources" class="navbar-brand d-flex align-items-center gap-2">
        <img src="/logo.jpeg" alt="logo" width="40" height="40" class="rounded-circle" />
        <span class="fst-italic text-decoration-underline">
          Youth Mental Health and Wellbeing
        </span>
      </router-link>

      <!-- Right -->
      <div class="d-flex align-items-center gap-2">
        <button class="btn btn-primary btn-sm" @click="$emit('support')">
          Get Support Now
        </button>

        <!-- Map  -->
        <router-link to="/map" class="btn btn-outline-secondary btn-sm">Map</router-link>


        <!-- Render the required two buttons for the current page -->
        <router-link
          v-for="b in navButtons"
          :key="b.to"
          :to="b.to"
          class="btn btn-outline-secondary btn-sm">
          {{ b.label }}
        </router-link>
      </div>
    </div>
  </nav>
</template>
