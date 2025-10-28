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

      <!-- Right side -->
      <div class="d-flex align-items-center gap-2">
        <!-- Get Support -->
        <button class="btn btn-primary btn-sm" @click="onSupport">
          Get Support Now
        </button>

        <!-- Email (only on login page) -->
        <router-link
          v-if="isLoginPage"
          :to="{ name: 'Email' }"
          class="btn btn-outline-secondary btn-sm">          
          Email
        </router-link>

        <!-- Interactive Tables link -->
        <router-link
          :to="{ name: 'InteractiveTablesView' }"
          class="btn btn-outline-secondary btn-sm">
          Tables
        </router-link>

        <!-- Login (only when logged out) -->
        <router-link
          v-if="showLoginBtn && !isLoginPage"
          :to="{ name: 'Login' }"
          class="btn btn-outline-secondary btn-sm">
          Login
        </router-link>
      </div>
    </div>
  </nav>

  <!-- Page content -->
  <main class="container my-4">
    <router-view />
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/firebase/init'

const route = useRoute()
const user = ref(null)

// Detect Firebase login state
onAuthStateChanged(auth, u => (user.value = u))

// Show login button only when logged out
const showLoginBtn = computed(() => !user.value)

// Show Email button only on login page
const isLoginPage = computed(() => route.name === 'Login')

// Example handler for Get Support
function onSupport() {
  alert('Support modal / route here')
}
</script>

<style>
body {
  background-color: #f8f9fa;
}
</style>
