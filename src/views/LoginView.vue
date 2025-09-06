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
      <button class="btn" :class="tab === 'signin' ? 'btn-primary' : 'btn-outline-primary'"
        @mousedown.prevent="prepareTabSwitch('signin')" @click="switchTab('signin')">Sign In</button>

      <button class="btn" :class="tab === 'signup' ? 'btn-primary' : 'btn-outline-primary'"
        @mousedown.prevent="prepareTabSwitch('signup')" @click="switchTab('signup')">Sign Up</button>
    </div>

    <!-- Card -->
    <div class="card shadow-sm">
      <div class="card-body">
        <p v-if="info" class="text-success small mb-2" role="status">{{ info }}</p>
        <p v-if="error" class="text-danger small mb-2" role="alert">{{ error }}</p>
      
        <form @submit.prevent="submitForm" class="row g-3" novalidate>
          <!-- Full name (Sign Up only) -->
          <div v-if="tab === 'signup'" class="col-12">
            <label for="name" class="form-label">Full name</label>
            <input id="name" v-model.trim="name" type="text" class="form-control" autocomplete="name" maxlength="80"
              @blur="validateName()" @input="touched.name = true; validateName(); onSignUpInput()" 
            />
            <div v-if="(signupSubmitted || touched.name) && errors.name" class="text-danger small">
              {{ errors.name }}
            </div>
          </div>

          <!-- Email -->
          <div class="col-12">
            <label for="email" class="form-label">Email</label>
            <input id="email" v-model.trim="email" type="email" class="form-control" maxlength="80" 
              @blur="validateEmail()" @input="touched.email = true; validateEmail(); onSignUpInput(); onSignInInput()" 
            />
            <!-- show email error ONLY on Sign Up -->
            <div v-if="tab === 'signup' && (signupSubmitted || touched.email) && errors.email"
              class="text-danger small">
              {{ errors.email }}
            </div>
          </div>

          <!-- Password + eye icon -->
          <div class="col-12">
            <label for="password" class="form-label">Password</label>

            <div class="pw-wrap">
              <input id="password" v-model="password" :type="showPassword ? 'text' : 'password'"
                class="form-control with-eye" :autocomplete="tab === 'signin' ? 'current-password' : 'new-password'"
                maxlength="80"
                @blur="validatePassword()"
                @input="touched.password = true; validatePassword(); onSignUpInput(); onSignInInput()" 
              />
              <!-- Eye icon toggle -->
              <span class="eye-toggle" @mousedown.prevent @click="showPassword = !showPassword"
                :title="showPassword ? 'Hide password' : 'Show password'" role="button" tabindex="0">
                <!-- eye -->
                <svg v-if="!showPassword" width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M1.5 12s3.8-6.5 10.5-6.5S22.5 12 22.5 12s-3.8 6.5-10.5 6.5S1.5 12 1.5 12Z" stroke="#6c757d"
                    stroke-width="1.8" />
                  <circle cx="12" cy="12" r="3.5" stroke="#6c757d" stroke-width="1.8" />
                </svg>
                <!-- eye-slash -->
                <svg v-else width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M1.5 12s3.8-6.5 10.5-6.5c2.2 0 4.1.7 5.8 1.7M22.5 12s-3.8 6.5-10.5 6.5c-2.2 0-4.1-.7-5.8-1.7"
                    stroke="#6c757d" stroke-width="1.8" stroke-linecap="round" />
                  <circle cx="12" cy="12" r="3.5" stroke="#6c757d" stroke-width="1.8" />
                  <path d="M3 21L21 3" stroke="#6c757d" stroke-width="1.8" stroke-linecap="round" />
                </svg>
              </span>
            </div>

            <div v-if="tab === 'signup'" class="form-text">
              Password must contain minimum 8 characters with alphabets and numbers.
            </div>

            <div v-if="tab === 'signin'" class="text-end mt-1">
              <router-link to="/reset-password" class="small text-decoration-none">Forgot password?</router-link>
            </div>

            <!-- field-level password error only on Sign Up -->
            <div v-if="(signupSubmitted || touched.password) && errors.password" class="text-danger small">
              {{ errors.password }}
            </div>
          </div>

          <!-- Confirm password + eye (Sign Up only) -->
          <div v-if="tab === 'signup'" class="col-12">
            <label for="cpw" class="form-label">Confirm password</label>

            <div class="pw-wrap">
              <input id="cpw" v-model="confirmPassword" :type="showConfirm ? 'text' : 'password'"
                class="form-control with-eye" maxlength="80" 
                @blur="validateConfirm()" @input="touched.confirm = true; validateConfirm(); onSignUpInput()"
              />
              <!-- Eye icon toggle -->
              <span class="eye-toggle" @mousedown.prevent @click="showConfirm = !showConfirm"
                :title="showConfirm ? 'Hide password' : 'Show password'" role="button" tabindex="0">
                <!-- eye -->
                <svg v-if="!showConfirm" width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M1.5 12s3.8-6.5 10.5-6.5S22.5 12 22.5 12s-3.8 6.5-10.5 6.5S1.5 12 1.5 12Z" stroke="#6c757d"
                    stroke-width="1.8" />
                  <circle cx="12" cy="12" r="3.5" stroke="#6c757d" stroke-width="1.8" />
                </svg>
                <!-- eye-slash -->
                <svg v-else width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M1.5 12s3.8-6.5 10.5-6.5c2.2 0 4.1.7 5.8 1.7M22.5 12s-3.8 6.5-10.5 6.5c-2.2 0-4.1-.7-5.8-1.7"
                    stroke="#6c757d" stroke-width="1.8" stroke-linecap="round" />
                  <circle cx="12" cy="12" r="3.5" stroke="#6c757d" stroke-width="1.8" />
                  <path d="M3 21L21 3" stroke="#6c757d" stroke-width="1.8" stroke-linecap="round" />
                </svg>
              </span>
            </div>

            <div v-if="(signupSubmitted || touched.confirm) && errors.confirm" class="text-danger small">
              {{ errors.confirm }}
            </div>
          </div>

          <!-- Role (Sign Up only) -->
          <div v-if="tab === 'signup'" class="col-12">
            <label for="role" class="form-label">Role</label>
            <select id="role" v-model="role" class="form-select">
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>

          <!-- Buttons -->
          <div v-if="tab === 'signin'" class="col-12 d-grid">
            <button type="submit" class="btn btn-success">Sign In</button>
          </div>
          <div v-else class="col-12 d-flex gap-2 justify-content-between">
            <button type="button" class="btn btn-outline-secondary" @click="clearSignUp">Clear</button>
            <button type="submit" class="btn btn-success">Create Account</button>
          </div>

          <!-- Switch link -->
          <div class="col-12 text-center">
            <small class="text-muted">
              {{ tab === 'signin' ? "Don’t have an account?" : "Already have an account?" }}
              <a href="#" @mousedown.prevent="prepareTabSwitch(tab === 'signin' ? 'signup' : 'signin')"
                @click.prevent="switchTab(tab === 'signin' ? 'signup' : 'signin')">
                {{ tab === 'signin' ? 'Sign up' : 'Sign in' }}
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
  name: 'LoginView',
  data() {
    return {
      tab: 'signin',
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'student',
      error: '',
      info: '',
      showPassword: false,
      showConfirm: false,
      touched: { name: false, email: false, password: false, confirm: false },
      signupSubmitted: false,
      suppressErrors: false,
      errors: { name: null, email: null, password: null, confirm: null }
    }
  },
  methods: {
    // tab switching helpers
    prepareTabSwitch() {
      this.suppressErrors = true
      this.error = ''; this.info = ''
      this.errors = { name: null, email: null, password: null, confirm: null }
      this.touched = { name: false, email: false, password: false, confirm: false }
    },
    switchTab(t) {
      this.tab = t
      // clear inputs
      this.name = ''; this.email = ''; this.password = ''; this.confirmPassword = ''
      this.role = 'member'
      this.showPassword = false; this.showConfirm = false
      this.touched = { name: false, email: false, password: false, confirm: false }
      this.signupSubmitted = false
      // focus first field
      this.$nextTick(() => {
        const firstId = t === 'signin' ? 'email' : 'name'
        const el = document.getElementById(firstId)
        if (el) el.focus()
        setTimeout(() => { this.suppressErrors = false }, 0)
      })
    },

    clearSignUp() {
      if (this.tab !== 'signup') return
      this.name = ''; this.email = ''; this.password = ''; this.confirmPassword = ''
      this.role = 'member'
      this.showPassword = false; this.showConfirm = false
      this.error = ''; this.info = ''
      this.errors = { name: null, email: null, password: null, confirm: null }
      this.touched = { name: false, email: false, password: false, confirm: false }
      this.signupSubmitted = false
      this.$nextTick(() => document.getElementById('name')?.focus())
    },

    // simple validators (gated by touched/submitted; no flicker)
    validateName() {
      if (this.suppressErrors || this.tab !== 'signup') return
      if (!(this.signupSubmitted || this.touched.name)) { this.errors.name = null; return }
      this.errors.name = (!this.name || this.name.length < 2) ? 'Name must be at least 2 characters' : null
    },
    validateEmail() {
      if (this.suppressErrors) return
      if (this.tab === 'signup') {
        if (!(this.signupSubmitted || this.touched.email)) { this.errors.email = null; return }
        this.errors.email = this.email && this.email.includes('@') ? null : 'Please enter a valid email'
      } else {
        this.errors.email = null
      }
    },
    validatePassword() {
      if (this.suppressErrors) return
      if (this.tab === 'signup') {
        if (!(this.signupSubmitted || this.touched.password)) { this.errors.password = null; return }
        const pw = this.password || ''
        const strong = pw.length >= 8 && /[A-Za-z]/.test(pw) && /\d/.test(pw)
        this.errors.password = strong ? null : 'Password needs 8+ chars with letters and numbers'
      } else {
        this.errors.password = null
      }
    },
    validateConfirm() {
      if (this.suppressErrors || this.tab !== 'signup') return
      if (!(this.signupSubmitted || this.touched.confirm)) { this.errors.confirm = null; return }
      this.errors.confirm = (this.password === this.confirmPassword) ? null : 'Passwords do not match'
    },

    // helpers
    normalizeEmail(str) {
      return (str || '').trim().toLowerCase()
    },
    readUsers() {
      try { return JSON.parse(localStorage.getItem('ymhw_users') || '[]') } catch (_) { return [] }
    },
    writeUsers(arr) { localStorage.setItem('ymhw_users', JSON.stringify(arr)) },

    
   onSignInInput() {
      if (this.tab !== 'signin') return;
      this.error = '';
    },
    
    onSignUpInput() {
      if (this.tab !== 'signup') return
      if (!this.error) return
      const msg = this.firstMissingSignUp()
      this.error = msg
    },
    firstMissingSignUp() {
      if (!this.name || !this.name.trim()) return 'Full name must be entered'
      if (!this.email || !this.email.trim()) return 'Email must be entered'
      if (!this.password) return 'Password must be entered'
      if (!this.confirmPassword) return 'Confirm password must be entered'
      return ''
    },

    // submit
    submitForm() {
      this.error = ''; this.info = ''

      if (this.tab === 'signin') {
        const emailN = this.normalizeEmail(this.email)
        const hasEmail = !!emailN
        const hasPw = !!this.password

        if (!hasEmail && !hasPw) { this.error = 'Username and password must be entered'; return }
        if (!hasEmail) { this.error = 'Username must be entered'; return }
        if (!hasPw) { this.error = 'Password must be entered'; return }

        const users = this.readUsers()
        const found = users.find(u => this.normalizeEmail(u.email) === emailN && u.password === this.password)
        if (!found) { this.error = 'Invalid username or password'; return }

        localStorage.setItem('ymhw_logged_in', 'yes')
        localStorage.setItem('ymhw_current_user', JSON.stringify({ email: found.email, name: found.name, role: found.role }))
        this.info = 'Signed in successfully.'
        window.dispatchEvent(new Event('auth-changed'))
        this.$router.push('/resources')
        return
      }

      // --- Sign Up path ---
      this.signupSubmitted = true
      this.validateName(); this.validateEmail(); this.validatePassword(); this.validateConfirm()

      const missing = this.firstMissingSignUp()
      if (missing) { this.error = missing; return }

      if (!this.email.includes('@')) { this.error = 'Please enter a valid email'; return }
      if (this.password !== this.confirmPassword) { this.error = 'Passwords do not match'; return }
      const strong = this.password.length >= 8 && /[A-Za-z]/.test(this.password) && /\d/.test(this.password)
      if (!strong) { this.error = 'Password needs 8+ chars with letters and numbers'; return }

      const users = this.readUsers()
      const emailN = this.normalizeEmail(this.email)
      if (users.some(u => this.normalizeEmail(u.email) === emailN)) { this.error = 'Email is already registered'; return }

      users.push({ name: this.name.trim(), email: emailN, password: this.password, role: this.role })
      this.writeUsers(users)
      this.info = 'Account created. Please sign in.'
      this.tab = 'signin'
      this.password = ''; this.confirmPassword = ''
      this.$nextTick(() => document.getElementById('email')?.focus())
    }
  }
}
</script>

<style scoped>
/* eye icon positioning */
.pw-wrap {
  position: relative;
}

.with-eye {
  padding-right: 2.4rem;
}

.eye-toggle {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  cursor: pointer;
  width: 24px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.eye-toggle:active {
  transform: translateY(-50%) scale(0.96);
}

/* small mobile padding */
@media (max-width: 576px) {
  section {
    padding-left: 12px;
    padding-right: 12px;
  }
}
</style>
