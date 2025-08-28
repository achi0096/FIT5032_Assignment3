<script setup>
import { ref } from 'vue'
const tab = ref('signin')
const form = ref({ name: '', email: '', password: '' })
const submit = () => {
  alert(`${tab.value === 'signin' ? 'Signing in' : 'Creating account'} for ${form.value.email}`)
}
</script>

<template>
  <section class="mx-auto" style="max-width: 680px;">
    <!-- Page heading with logo -->
    <div class="d-flex align-items-center gap-3 mb-4">
      <img src="/logo.jpeg" alt="Youth Wellbeing logo" width="72" height="72" class="rounded-circle" />
      <div>
        <h1 class="h4 mb-1">Welcome to Youth Mental Health & Wellbeing</h1>        
      </div>
    </div>

    <!-- Tabs -->
    <div class="btn-group mb-3" role="group" aria-label="Auth tabs">
      <button class="btn" :class="tab==='signin' ? 'btn-primary' : 'btn-outline-primary'"
              @click="tab='signin'">Sign In</button>
      <button class="btn" :class="tab==='signup' ? 'btn-primary' : 'btn-outline-primary'"
              @click="tab='signup'">Sign Up</button>
    </div>

    <!-- Card -->
    <div class="card shadow-sm">
      <div class="card-body">
        <form @submit.prevent="submit" class="row g-3">
          <div v-if="tab==='signup'" class="col-12">
            <label class="form-label" for="name">Full name</label>
            <input id="name" v-model="form.name" type="text" class="form-control" autocomplete="name" required />
          </div>

          <div class="col-12">
            <label class="form-label" for="email">Email</label>
            <input id="email" v-model="form.email" type="email" class="form-control" autocomplete="email" required />
          </div>

          <div class="col-12">
            <label class="form-label" for="password">Password</label>
            <input id="password" v-model="form.password" type="password" class="form-control"
                   :autocomplete="tab==='signin' ? 'current-password' : 'new-password'" required />
            <div v-if="tab==='signup'" class="form-text">
                  Password must be minimum 8 characters and contains:
                  - numbers, alphabets and special characters
            </div>
            <!-- Forgot password link (only for Sign In tab) -->
            <div v-if="tab==='signin'" class="text-end mt-1">
            <a href="#" class="small text-decoration-none text-primary">Forgot password?</a>
            </div>
          </div>

      

          <div class="col-12 d-grid">
            <button type="submit" class="btn btn-success">
              {{ tab === 'signin' ? 'Sign In' : 'Create Account' }}
            </button>
          </div>

          <div class="col-12 text-center">
            <small class="text-muted">
              {{ tab==='signin' ? "Don’t have an account?" : "Already have an account?" }}
              <a href="#" @click.prevent="tab = tab==='signin' ? 'signup' : 'signin'">
                {{ tab==='signin' ? 'Sign up' : 'Sign in' }}
              </a>
            </small>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>
