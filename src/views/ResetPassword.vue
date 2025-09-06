<template>
  <section class="mx-auto" style="max-width:560px;">
    <h2 class="h4 mb-3">Reset Password</h2>

    <div class="card">
      <div class="card-body">
        <p v-if="info" class="text-success small">{{ info }}</p>
        <p v-if="error" class="text-danger small">{{ error }}</p>

        <form @submit.prevent="resetNow" class="row g-3" novalidate>
          <!-- Email -->
          <div class="col-12">
            <label for="rp-email" class="form-label">Email</label>
            <input id="rp-email" v-model.trim="email" type="email" class="form-control" autocomplete="email" />
          </div>

          <!-- New password + eye -->
          <div class="col-12">
            <label for="rp-new" class="form-label">New password</label>

            <div class="pw-wrap">
              <input id="rp-new" v-model="newPassword" :type="showNew ? 'text' : 'password'"
                class="form-control with-eye" autocomplete="new-password"
                @input="clearMessages(); checkStrength(); checkMismatch()" />
              <span class="eye-toggle" @mousedown.prevent @click="showNew = !showNew"
                :title="showNew ? 'Hide password' : 'Show password'" role="button" tabindex="0">
                <!-- eye -->
                <svg v-if="!showNew" width="22" height="22" viewBox="0 0 24 24" fill="none">
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

            <div class="form-text">Password must contain minimum 8 characters with letters and numbers.</div>
            <!-- Field-level strength error -->
            <div v-if="pwError" class="text-danger small">{{ pwError }}</div>
          </div>

          <!-- Confirm password + eye -->
          <div class="col-12">
            <label for="rp-confirm" class="form-label">Confirm new password</label>

            <div class="pw-wrap">
              <input id="rp-confirm" v-model="confirmPassword" :type="showConfirm ? 'text' : 'password'"
                class="form-control with-eye" autocomplete="new-password" @input="clearMessages(); checkMismatch()" />
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

            <!-- Field-level mismatch message -->
            <div v-if="mismatch" class="text-danger small">Passwords do not match</div>
          </div>

          <!-- Buttons -->
          <div class="col-12 d-flex gap-2">
            <button class="btn btn-primary" type="submit">Reset password</button>
            <router-link class="btn btn-outline-secondary" :to="{ name: 'Login' }">Back to login</router-link>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'ResetPassword',
  data() {
    return {
      email: '',
      newPassword: '',
      confirmPassword: '',
      showNew: false,
      showConfirm: false,
      mismatch: false,
      pwError: '',
      info: '',
      error: ''
    }
  },
  methods: {
    clearMessages() {
      this.error = ''
      this.info = ''
    },
    checkMismatch() {
      this.mismatch = !!this.newPassword && !!this.confirmPassword && (this.newPassword !== this.confirmPassword)
    },
    checkStrength() {
      // Live feedback for new password strength (letters + numbers + length)
      const pw = this.newPassword || ''
      if (!pw) { this.pwError = ''; return }

      const hasLetter = /[A-Za-z]/.test(pw)
      const hasNumber = /\d/.test(pw)
      const longEnough = pw.length >= 8

      if (!longEnough) {
        this.pwError = 'Password must be at least 8 characters'
      } else if (!hasLetter && !hasNumber) {
        this.pwError = 'Password must include letters and numbers'
      } else if (!hasLetter) {
        this.pwError = 'Password must include at least one letter'
      } else if (!hasNumber) {
        this.pwError = 'Password must include at least one number'
      } else {
        this.pwError = ''
      }
    },
    strengthErrorForSubmit(pw) {
      const hasLetter = /[A-Za-z]/.test(pw)
      const hasNumber = /\d/.test(pw)
      const longEnough = (pw || '').length >= 8
      if (!longEnough) return 'Password must be at least 8 characters'
      if (!hasLetter && !hasNumber) return 'Password must include letters and numbers'
      if (!hasLetter) return 'Password must include at least one letter'
      if (!hasNumber) return 'Password must include at least one number'
      return ''
    },
    normalizeEmail(s) {
      return (s || '').trim().toLowerCase()
    },
    readUsers() {
      try { return JSON.parse(localStorage.getItem('ymhw_users') || '[]') } catch (_) { return [] }
    },
    writeUsers(arr) {
      localStorage.setItem('ymhw_users', JSON.stringify(arr))
    },
    resetNow() {
      this.info = ''; this.error = '';

      const emailN = this.normalizeEmail(this.email)
      if (!emailN || !emailN.includes('@')) { this.error = 'Please enter a valid email'; return }
      if (!this.newPassword) { this.error = 'Please enter a new password'; return }
      if (!this.confirmPassword) { this.error = 'Please confirm your new password'; return }

      // enforce mismatch and strength on submit
      this.checkMismatch()
      if (this.mismatch) { this.error = 'Passwords do not match'; return }

      const strengthMsg = this.strengthErrorForSubmit(this.newPassword)
      if (strengthMsg) { this.error = strengthMsg; return }

      const users = this.readUsers()
      const idx = users.findIndex(u => this.normalizeEmail(u.email) === emailN)
      if (idx === -1) { this.error = 'No account found for this email'; return }

      users[idx].password = this.newPassword
      this.writeUsers(users)

      // if same user is logged in, log them out so they re-login with the new password
      const current = JSON.parse(localStorage.getItem('ymhw_current_user') || 'null')
      if (current && this.normalizeEmail(current.email) === emailN) {
        localStorage.removeItem('ymhw_logged_in')
        localStorage.removeItem('ymhw_current_user')
        window.dispatchEvent(new Event('auth-changed'))
      }

      this.info = 'Your password has been reset successfully. You can now login with your new password.'
      // Clear password fields after success
      this.newPassword = ''
      this.confirmPassword = ''
      this.mismatch = false
      this.pwError = ''
    }
  }
}
</script>

<style scoped>
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
</style>
