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

      <!-- Email button (shown only when parent sets showEmail=true) -->
      <router-link
        v-if="showEmail"
        :to="{ name: 'Email' }"
        class="btn btn-success btn-sm d-inline-flex align-items-center">
        Email
      </router-link>
      
        <!-- Logged OUT -->
        <router-link
          v-if="showLogin"
          :to="{ name: 'Login' }"
          class="btn btn-outline-secondary btn-sm">
          Login
        </router-link>

        <!-- Logged IN -->        
        <div v-else class="dropdown">
          <button class="btn btn-outline-secondary btn-sm dropdown-toggle" data-bs-toggle="dropdown">
            <span class="badge bg-secondary rounded-circle me-1">{{ initials }}</span>
            {{ username }}
          </button>
          <ul class="dropdown-menu dropdown-menu-end">
            <li>
              <router-link class="dropdown-item" :to="roleRoute">
                My area ({{ roleLabel }})
              </router-link>
            </li>
            <li><hr class="dropdown-divider"></li>
            <li><button class="dropdown-item" @click="$emit('logout')">Sign out</button></li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  showLogin: { type: Boolean, default: false },
  username:  { type: String,  default: 'User' },
  role:      { type: String,  default: 'student' },
  showEmail: { type: Boolean, default: false }   // <-- NEW
})
defineEmits(['support', 'logout'])

const initials  = computed(() => (props.username || 'U').trim().charAt(0).toUpperCase())
const roleLabel = computed(() => (props.role === 'teacher' ? 'Teacher' : 'Student'))
const roleRoute = computed(() => (props.role === 'teacher' ? { name: 'Teacher' } : { name: 'Student' }))
</script>