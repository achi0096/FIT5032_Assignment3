<template>
  <section class="mx-auto" style="max-width: 680px;">
    <!-- Title -->
    <div class="d-flex align-items-center gap-3 mb-4">
      <img src="/logo.jpeg" alt="logo" width="72" height="72" class="rounded-circle" />
      <div>
        <h1 class="h4 mb-1">Welcome to Youth Mental Health & Wellbeing</h1>
        <p class="text-muted mb-0">Sign in or create an account</p>
      </div>
    </div>

    <!-- Tabs -->
    <div class="btn-group mb-3" role="group">
      <button class="btn" :class="tab==='signin' ? 'btn-primary' : 'btn-outline-primary'" @click="switchTab('signin')">Sign In</button>
      <button class="btn" :class="tab==='signup' ? 'btn-primary' : 'btn-outline-primary'" @click="switchTab('signup')">Sign Up</button>
    </div>

    <!-- Card -->
    <div class="card shadow-sm">
      <div class="card-body">
        <p v-if="info" class="text-success small mb-2" role="status">{{ info }}</p>
        <p v-if="error" class="text-danger small mb-2" role="alert">{{ error }}</p>

        <!-- Disable browser tooltip; we show our own errors -->
        <form @submit.prevent="submitForm" class="row g-3" novalidate>
          
          <!-- Name (signup only) -->
          <div v-show="tab==='signup'" class="col-12">
            <label for="name" class="form-label">Full name</label>
            <input
              id="name"
              v-model.trim="name"
              type="text"
              class="form-control"
              autocomplete="name"
              @blur="touched.name = true; validateName(true)"
              @input="validateName(false)"
            />
            <!-- show error ONLY after the field has been touched -->
            <div v-if="touched.name && errors.name" class="text-danger small">
              {{ errors.name }}
            </div>
          </div>

          <!-- Email -->
          <div class="col-12">
            <label for="email" class="form-label">Email</label>
            <input id="email" v-model.trim="email" type="email" class="form-control"
                  @blur="touched.email = true; validateEmail(true)"
                  @input="validateEmail(false); onSignInInput()">
            <div v-if="touched.email && errors.email" class="text-danger small">{{ errors.email }}</div>
          </div>

          <!-- Password + eye icon -->
          <div class="col-12">
            <label for="password" class="form-label">Password</label>

            <div class="pw-wrap">
             <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                class="form-control with-eye"
                :autocomplete="tab==='signin' ? 'current-password' : 'new-password'"
                @blur="touched.password = true; validatePassword(true)"
                @input="validatePassword(false); onSignInInput()"
              />
              <div v-if="touched.password && errors.password" class="text-danger small">{{ errors.password }}</div>
              <!-- Eye icon toggle -->
              <span class="eye-toggle"
                    @mousedown.prevent
                    @click="showPassword = !showPassword"
                    :title="showPassword ? 'Hide password' : 'Show password'"
                    role="button" tabindex="0">
                <!-- eye -->
                <svg v-if="!showPassword" width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M1.5 12s3.8-6.5 10.5-6.5S22.5 12 22.5 12s-3.8 6.5-10.5 6.5S1.5 12 1.5 12Z"
                        stroke="#6c757d" stroke-width="1.8" />
                  <circle cx="12" cy="12" r="3.5" stroke="#6c757d" stroke-width="1.8"/>
                </svg>
                <!-- eye-slash -->
                <svg v-else width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M1.5 12s3.8-6.5 10.5-6.5c2.2 0 4.1.7 5.8 1.7M22.5 12s-3.8 6.5-10.5 6.5c-2.2 0-4.1-.7-5.8-1.7"
                        stroke="#6c757d" stroke-width="1.8" stroke-linecap="round"/>
                  <circle cx="12" cy="12" r="3.5" stroke="#6c757d" stroke-width="1.8"/>
                  <path d="M3 21L21 3" stroke="#6c757d" stroke-width="1.8" stroke-linecap="round"/>
                </svg>
              </span>
            </div>

            <div v-if="tab==='signup'" class="form-text">Use at least 8 characters with letters and numbers.</div>

            <div v-if="tab==='signin'" class="text-end mt-1">
              <router-link to="/reset-password" class="small text-decoration-none">Forgot password?</router-link>
            </div>

            <div v-if="errors.password" class="text-danger small">{{ errors.password }}</div>
          </div>

          <!-- Confirm password + eye icon (signup only) -->
          <div v-if="tab==='signup'" class="col-12">
            <label for="cpw" class="form-label">Confirm password</label>

            <div class="pw-wrap">
              <input id="cpw" v-model="confirmPassword" :type="showConfirm ? 'text' : 'password'" class="form-control with-eye"
                    @blur="touched.confirm = true; validateConfirm(true)"
                    @input="validateConfirm(false)">
              <div v-if="touched.confirm && errors.confirm" class="text-danger small">{{ errors.confirm }}</div>
              <!-- Eye icon toggle -->
              <span class="eye-toggle"
                    @mousedown.prevent
                    @click="showConfirm = !showConfirm"
                    :title="showConfirm ? 'Hide password' : 'Show password'"
                    role="button" tabindex="0">
                <!-- eye -->
                <svg v-if="!showConfirm" width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M1.5 12s3.8-6.5 10.5-6.5S22.5 12 22.5 12s-3.8 6.5-10.5 6.5S1.5 12 1.5 12Z"
                        stroke="#6c757d" stroke-width="1.8" />
                  <circle cx="12" cy="12" r="3.5" stroke="#6c757d" stroke-width="1.8"/>
                </svg>
                <!-- eye-slash -->
                <svg v-else width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M1.5 12s3.8-6.5 10.5-6.5c2.2 0 4.1.7 5.8 1.7M22.5 12s-3.8 6.5-10.5 6.5c-2.2 0-4.1-.7-5.8-1.7"
                        stroke="#6c757d" stroke-width="1.8" stroke-linecap="round"/>
                  <circle cx="12" cy="12" r="3.5" stroke="#6c757d" stroke-width="1.8"/>
                  <path d="M3 21L21 3" stroke="#6c757d" stroke-width="1.8" stroke-linecap="round"/>
                </svg>
              </span>
            </div>

            <div v-if="errors.confirm" class="text-danger small">{{ errors.confirm }}</div>
          </div>

          <!-- Role (signup only) -->
          <div v-if="tab==='signup'" class="col-12">
            <label for="role" class="form-label">Role</label>
            <select id="role" v-model="role" class="form-select">
              <option value="member">Member</option>
              <option value="counsellor">Counsellor</option>
            </select>
          </div>

          <div class="col-12 d-grid">
            <button type="submit" class="btn btn-success">
              {{ tab==='signin' ? 'Sign In' : 'Create Account' }}
            </button>
          </div>

          <div class="col-12 text-center">
            <small class="text-muted">
              {{ tab==='signin' ? "Don’t have an account?" : "Already have an account?" }}
              <a href="#" @click.prevent="switchTab(tab==='signin' ? 'signup' : 'signin')">
                {{ tab==='signin' ? 'Sign up' : 'Sign in' }}
              </a>
            </small>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'HomeView',
  data() {
    return {
      tab: 'signin',
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'member',
      error: '',
      info: '',
      showPassword: false,   // for password eye
      showConfirm: false,    // for confirm eye
      touched: { name: false, email: false, password: false, confirm: false },
      errors: { name: null, email: null, password: null, confirm: null }
    }
  },
  methods: {
    switchTab(t) {
      this.tab = t
      // clear messages
      this.error = ''
      this.info = ''
      // clear inputs so they don’t carry over
      this.name = ''
      this.email = ''
      this.password = ''
      this.confirmPassword = ''
      this.role = 'member'
      this.showPassword = false
      this.showConfirm = false
      // clear inline errors
      this.errors = { name:null, email:null, password:null, confirm:null }
      this.touched = { name:false, email:false, password:false, confirm:false }
      // focus first field for that tab
      this.$nextTick(() => {
        const firstId = t === 'signin' ? 'email' : 'name'
        const el = document.getElementById(firstId)
        if (el) el.focus()
      })
    },
    
    validateName(blur) {
      if (this.tab !== 'signup') return
      if (!this.name || this.name.length < 2) {
        if (blur) this.errors.name = 'Name must be at least 2 characters'
      } else {
        this.errors.name = null
      }
    },
    validateEmail(blur) {
      const ok = this.email.includes('@')
      if (!ok) {
        if (blur) this.errors.email = 'Please enter a valid email'
      } else { this.errors.email = null }
    },
    validatePassword(blur) {
      const pw = this.password || ''
      const strong = pw.length >= 8 && /[A-Za-z]/.test(pw) && /\d/.test(pw)
      if (this.tab === 'signup') {
        if (!strong) { if (blur) this.errors.password = 'Password needs 8+ chars with letters and numbers' }
        else { this.errors.password = null }
      } else {
        if (!pw) { if (blur) this.errors.password = 'Password is required' }
        else { this.errors.password = null }
      }
    },
    validateConfirm(blur) {
      if (this.tab !== 'signup') return
      if (this.password !== this.confirmPassword) {
        if (blur) this.errors.confirm = 'Passwords do not match'
      } else { this.errors.confirm = null }
    },

    readUsers() {
      try { return JSON.parse(localStorage.getItem('ymhw_users') || '[]') } catch (e) { return [] }
    },
    writeUsers(arr) { localStorage.setItem('ymhw_users', JSON.stringify(arr)) },

    // clear “missing fields” error while typing on Sign In
    onSignInInput() {
      if (this.tab === 'signin' && this.email && this.password) {
        this.error = ''
      }
    },

    submitForm() {
      this.error = ''
      this.info = ''

      if (this.tab === 'signin') {
        if (!this.email || !this.password) {
          this.error = 'Username and password must be entered'
          return
        }
        const users = this.readUsers()
        const found = users.find(u => u.email === this.email && u.password === this.password)
        if (!found) {
          this.error = 'Invalid username or password'
          return
        }
        localStorage.setItem('ymhw_logged_in', 'yes')
        localStorage.setItem('ymhw_current_user', JSON.stringify({ email: found.email, name: found.name, role: found.role }))
        this.info = 'Signed in successfully.'
        this.$router.push('/resources')
        return
      }

      // Sign Up path
      this.validateName(true); this.validateEmail(true); this.validatePassword(true); this.validateConfirm(true)
      if (this.errors.name || this.errors.email || this.errors.password || this.errors.confirm) {
        this.error = 'Please fix the highlighted fields.'
        return
      }
      const users = this.readUsers()
      if (users.some(u => u.email === this.email)) {
        this.error = 'Email is already registered'
        return
      }
      users.push({ name: this.name.trim(), email: this.email.trim(), password: this.password, role: this.role })
      this.writeUsers(users)
      this.info = 'Account created. Please sign in.'
      this.tab = 'signin'
      this.password = ''; this.confirmPassword = ''
    }
  }
}
</script>

<style scoped>
/* Eye icon placement */
.pw-wrap { position: relative; }
.with-eye { padding-right: 2.4rem; }  
.eye-toggle {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  cursor: pointer;
  width: 24px; height: 24px;
  display: inline-flex; align-items: center; justify-content: center;
  z-index: 2; /* ensure above input */
}
.eye-toggle:active { transform: translateY(-50%) scale(0.96); }

/* Small mobile spacing */
@media (max-width: 576px) {
  section { padding-left: 12px; padding-right: 12px; }
}
</style>
