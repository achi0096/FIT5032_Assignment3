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
      <button
        class="btn"
        :class="tab==='signin' ? 'btn-primary' : 'btn-outline-primary'"
        @mousedown.prevent="prepareTabSwitch('signin')"
        @click="switchTab('signin')"
      >Sign In</button>

      <button
        class="btn"
        :class="tab==='signup' ? 'btn-primary' : 'btn-outline-primary'"
        @mousedown.prevent="prepareTabSwitch('signup')"
        @click="switchTab('signup')"
      >Sign Up</button>
    </div>

    <!-- Card -->
    <div class="card shadow-sm">
      <div class="card-body">
        <p v-if="info" class="text-success small mb-2" role="status">{{ info }}</p>
        <p v-if="error" class="text-danger small mb-2" role="alert">{{ error }}</p>

        <!-- Disable browser tooltip; we show our own errors -->
        <form @submit.prevent="submitForm" class="row g-3" novalidate>
          <!-- Full Name (signup only) -->
          <div v-if="tab==='signup'" class="col-12">
            <label for="name" class="form-label">Full name</label>
            <input id="name" v-model.trim="name" type="text" class="form-control"
              autocomplete="name"
              @blur="validateName(false)"                             
              @input="touched.name = true; validateName(false); onSignUpInput()" 
            />
            <div v-if="touched.name && errors.name" class="text-danger small">{{ errors.name }}</div>
          </div>

          <!-- Email -->
          <div class="col-12">
            <label for="email" class="form-label">Email</label>
            <input id="email" v-model.trim="email" type="email" class="form-control"
              @blur="validateEmail(false)"
              @input="touched.email = true; validateEmail(false); onSignUpInput()" 
            />
            <!-- show email error ONLY on Sign Up -->
            <div v-if="tab==='signup' && touched.email && errors.email" class="text-danger small">
              {{ errors.email }}
            </div>
          </div>

          <!-- Password + eye icon -->
          <div class="col-12">
            <label for="password" class="form-label">Password</label>

            <div class="pw-wrap">
              <input id="password" v-model="password" :type="showPassword ? 'text' : 'password'"
                  class="form-control with-eye"
                  :autocomplete="tab==='signin' ? 'current-password' : 'new-password'"
                  @blur="validatePassword(false)"
                  @input="touched.password = true; validatePassword(false); onSignUpInput()" 
              />
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

            <div v-if="tab==='signup'" class="form-text">
              Use at least 8 characters with letters and numbers.
            </div>

            <div v-if="tab==='signin'" class="text-end mt-1">
              <router-link to="/reset-password" class="small text-decoration-none">Forgot password?</router-link>
            </div>
            <div v-if="touched.password && errors.password" class="text-danger small">{{ errors.password }}</div>
          </div>

          <!-- Confirm password + eye icon (signup only) -->
          <div v-if="tab==='signup'" class="col-12">
            <label for="cpw" class="form-label">Confirm password</label>

            <div class="pw-wrap">
              <input id="cpw" v-model="confirmPassword" :type="showConfirm ? 'text' : 'password'"
                  class="form-control with-eye"
                  @blur="validateConfirm(false)"
                  @input="touched.confirm = true; validateConfirm(false); onSignUpInput()" 
              />
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
            <div v-if="touched.confirm && errors.confirm" class="text-danger small">{{ errors.confirm }}</div>
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
              <a href="#" @mousedown.prevent="prepareTabSwitch(tab==='signin' ? 'signup' : 'signin')"
                 @click.prevent="switchTab(tab==='signin' ? 'signup' : 'signin')">
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
      showPassword: false,
      showConfirm: false,    
      touched: { name:false, email:false, password:false, confirm:false }, 
      signupSubmitted: false, 
      suppressErrors: false,
      errors: { name:null, email:null, password:null, confirm:null }
    }
  },
  methods: {
    prepareTabSwitch(targetTab) {      
      this.suppressErrors = true      
      this.error = ''; this.info = ''
      this.errors = { name:null, email:null, password:null, confirm:null }
      this.touched = { name:false, email:false, password:false, confirm:false }
    },

    switchTab(t) {
      this.tab = t
      // clear inputs so they don’t carry over
      this.name = ''
      this.email = ''
      this.password = ''
      this.confirmPassword = ''
      this.role = 'member'
      this.showPassword = false
      this.showConfirm = false
      this.touched = { name:false, email:false, password:false, confirm:false }
      this.signupSubmitted = false

      // focus first field for that tab
      this.$nextTick(() => {
        const firstId = t === 'signin' ? 'email' : 'name'
        const el = document.getElementById(firstId)
        if (el) el.focus()      
        setTimeout(() => { this.suppressErrors = false }, 0)
      })
    },

    // validations 
   validateName() {
    if (this.tab !== 'signup') return
    if (!(this.signupSubmitted || this.touched.name)) { this.errors.name = null; return }
    this.errors.name = (!this.name || this.name.length < 2)
      ? 'Name must be at least 2 characters' : null
  },

  validateEmail() {
    if (this.tab === 'signup') {
      if (!(this.signupSubmitted || this.touched.email)) { this.errors.email = null; return }
      this.errors.email = this.email && this.email.includes('@') ? null : 'Please enter a valid email'
    } else {
      // no per-field email error on Sign In
      this.errors.email = null
    }
  },

  validatePassword() {
    if (this.tab === 'signup') {
      if (!(this.signupSubmitted || this.touched.password)) { this.errors.password = null; return }
      const pw = this.password || ''
      const strong = pw.length >= 8 && /[A-Za-z]/.test(pw) && /\d/.test(pw)
      this.errors.password = strong ? null : 'Password needs 8+ chars with letters and numbers'
    } else {
      // Sign In: use only the top message
      this.errors.password = null
    }
  },

  validateConfirm() {
    if (this.tab !== 'signup') return
    if (!(this.signupSubmitted || this.touched.confirm)) { this.errors.confirm = null; return }
    this.errors.confirm = (this.password === this.confirmPassword) ? null : 'Passwords do not match'
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
    firstMissingSignUp() {
      if (!this.name || !this.name.trim()) return 'Full name must be entered'
      if (!this.email || !this.email.trim()) return 'Email must be entered'
      if (!this.password) return 'Password must be entered'
      if (!this.confirmPassword) return 'Confirm password must be entered'
      return ''
    },
    onSignUpInput() {
      if (this.tab !== 'signup') return
      if (!this.error) return
      const msg = this.firstMissingSignUp()
      this.error = msg   // becomes '' once all required fields are filled
    },

   submitForm() {
      this.error = ''
      this.info = ''

      if (this.tab === 'signin') {
        const hasEmail = !!(this.email && this.email.trim())
        const hasPw    = !!this.password

        if (!hasEmail && !hasPw) { this.error = 'Username and password must be entered'; return }
        if (!hasEmail)            { this.error = 'Username must be entered';            return }
        if (!hasPw)               { this.error = 'Password must be entered';            return }

        const users = this.readUsers()
        const found = users.find(u => u.email === this.email && u.password === this.password)
        if (!found) { this.error = 'Invalid username or password'; return }

        localStorage.setItem('ymhw_logged_in', 'yes')
        localStorage.setItem('ymhw_current_user', JSON.stringify({ email: found.email, name: found.name, role: found.role }))
        this.info = 'Signed in successfully.'
        this.$router.push('/resources')
        return
      }

      // Sign Up path
      // --- Sign Up path (replace your current sign-up branch with this) ---
      this.validateName(true); this.validateEmail(true); this.validatePassword(true); this.validateConfirm(true)

      // form-level required checks first (one message at a time, like Sign In)
      const missing = this.firstMissingSignUp()
      if (missing) { this.error = missing; return }

      // now format/match checks
      if (!this.email.includes('@')) { this.error = 'Please enter a valid email'; return }
      if (this.password !== this.confirmPassword) { this.error = 'Passwords do not match'; return }

      // optional simple strength check (kept from your Week 4 rules)
      const strong = this.password.length >= 8 && /[A-Za-z]/.test(this.password) && /\d/.test(this.password)
      if (!strong) { this.error = 'Password needs 8+ chars with letters and numbers'; return }

      // unique email check
      const users = this.readUsers()
      if (users.some(u => u.email === this.email)) { this.error = 'Email is already registered'; return }

      // save and switch to Sign In
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
  z-index: 2;
}
.eye-toggle:active { transform: translateY(-50%) scale(0.96); }

/* Small mobile spacing */
@media (max-width: 576px) {
  section { padding-left: 12px; padding-right: 12px; }
}
</style>
