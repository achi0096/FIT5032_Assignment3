<template>
  <div>
    <!-- Header -->
    <nav class="navbar navbar-light bg-light border-bottom sticky-top">
      <div class="container d-flex justify-content-between align-items-center">

        <!-- Left: Brand -->
        <div class="d-flex align-items-center gap-2">
          <router-link to="/resources" class="navbar-brand d-flex align-items-center gap-2">
            <img src="/logo.jpeg" alt="logo" width="48" height="48" class="rounded-circle" />
            <span class="fst-italic text-decoration-underline">
              Youth Mental Health and Wellbeing
            </span>
          </router-link>
        </div>        

        <!-- Right side -->
        <div class="d-flex align-items-center gap-3">
          <!-- Get Support (always visible) -->
          <button class="btn btn-primary btn-sm" @click="showSupport = true">
            Get Support Now
          </button>

          <!-- Login (only when logged out) -->
          <router-link v-if="showLoginBtn" :to="{ name: 'Login' }" class="btn btn-outline-secondary btn-sm">
            Login
          </router-link>

          <!-- Back button -->
          <BackButton v-if="showBackBtn" class="me-2" fallback="/resources" />

          <!-- User dropdown (when logged in) -->
          <div v-if="isLoggedIn && $route.name !== 'Login'" class="dropdown">
            <button class="btn btn-sm btn-outline-secondary dropdown-toggle d-flex align-items-center gap-1"
              type="button" data-bs-toggle="dropdown" aria-expanded="false">
              <div class="avatar">{{ userInitial }}</div>
              <span class="user-name">{{ currentUserName }}</span>
              <span v-if="role" class="badge bg-success text-uppercase">{{ role }}</span>
            </button>
            <ul class="dropdown-menu dropdown-menu-end">
              <li v-if="role === 'student'">
                <router-link class="dropdown-item" to="/student">Student Area</router-link>
              </li>
              <li v-if="role === 'teacher'">
                <router-link class="dropdown-item" to="/teacher">Teacher Area</router-link>
              </li>
              <li><hr class="dropdown-divider" /></li>
              <li><a href="#" class="dropdown-item" @click.prevent="logout">Sign out</a></li>
            </ul>
          </div>
        </div>
      </div>
    </nav>

    <!-- Page content -->
    <main class="py-4">
      <div class="container">
        <router-view />
      </div>
    </main>

    <!-- Footer -->
    <footer class="border-top mt-4">
      <div class="container text-center py-3 small">
        <button class="btn btn-link p-0 me-3" @click="showCrisis = true">Crisis Help</button> |
        <button class="btn btn-link p-0 mx-3" @click="showAccessibility = true">Accessibility</button> |
        <button class="btn btn-link p-0 ms-3" @click="showPrivacy = true">Privacy Policy</button>
      </div>
    </footer>

    <!-- Support Modal -->
    <div v-if="showSupport" class="modal fade show d-block" tabindex="-1" role="dialog" aria-modal="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Need support now?</h5>
            <button type="button" class="btn-close" @click="showSupport = false" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p class="small text-muted mb-3">
              If you or someone else is in immediate danger, call <strong>000</strong>.
            </p>
            <ul class="list-group">
              <li v-for="(r, i) in supportList" :key="i"
                  class="list-group-item d-flex justify-content-between align-items-start">
                <div>
                  <div class="fw-bold">{{ r.name }}</div>
                  <div class="small text-muted">{{ r.hours }}</div>
                </div>
                <a :href="'tel:' + r.phone" class="btn btn-sm btn-success">{{ r.phone }}</a>
              </li>
            </ul>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showSupport = false">Close</button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showSupport" class="modal-backdrop fade show"></div>

    <!-- Crisis Modal -->
    <div v-if="showCrisis" class="modal fade show d-block" tabindex="-1" role="dialog" aria-modal="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Crisis Help</h5>
            <button type="button" class="btn-close" @click="showCrisis = false" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p class="small text-muted mb-3">
              If you or someone else is in immediate danger, call <strong>000</strong>.
            </p>
            <ul class="list-group">
              <li class="list-group-item d-flex justify-content-between align-items-start">
                <div>
                  <div class="fw-bold">Lifeline (24/7)</div>
                  <div class="small text-muted">24 hours</div>
                </div>
                <a href="tel:131114" class="btn btn-sm btn-success">13 11 14</a>
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-start">
                <div>
                  <div class="fw-bold">Beyond Blue</div>
                  <div class="small text-muted">24 hours</div>
                </div>
                <a href="tel:1300224636" class="btn btn-sm btn-success">1300 224 636</a>
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-start">
                <div>
                  <div class="fw-bold">Kids Helpline</div>
                  <div class="small text-muted">24 hours</div>
                </div>
                <a href="tel:1800551800" class="btn btn-sm btn-success">1800 55 1800</a>
              </li>
            </ul>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showCrisis = false">Close</button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showCrisis" class="modal-backdrop fade show"></div>

    <!-- Accessibility Modal -->
    <div v-if="showAccessibility" class="modal fade show d-block" tabindex="-1" role="dialog" aria-modal="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Accessibility</h5>
            <button type="button" class="btn-close" @click="showAccessibility = false" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <ul class="small">
              <li>Keyboard accessible navigation and forms</li>
              <li>High-contrast text and sufficient color contrast</li>
              <li>Descriptive labels and ARIA attributes where needed</li>
              <li>Responsive layout for mobile and desktop</li>
            </ul>
            <p class="small text-muted mb-0">If you need adjustments, let us know.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showAccessibility = false">Close</button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showAccessibility" class="modal-backdrop fade show"></div>

    <!-- Privacy Modal -->
    <div v-if="showPrivacy" class="modal fade show d-block" tabindex="-1" role="dialog" aria-modal="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Privacy Policy</h5>
            <button type="button" class="btn-close" @click="showPrivacy = false" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p class="small">
              We now use Firebase Authentication & Firestore for accounts.
            </p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showPrivacy = false">Close</button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showPrivacy" class="modal-backdrop fade show"></div>

  </div>
</template>

<script>
import BackButton from '@/components/BackButton.vue'
import { auth, db } from '@/firebase/init'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

export default {
  name: 'App',
  components: { BackButton },

  data() {
    return {
      isLoggedIn: false,
      currentUserName: '',
      role: '',
      showSupport: false,
      showCrisis: false,
      showAccessibility: false,
      showPrivacy: false,
      supportList: [
        { name: 'Lifeline (24/7)', phone: '131114',   hours: '24 hours' },
        { name: 'Kids Helpline',   phone: '1800551800', hours: '24 hours' },
        { name: 'Beyond Blue',     phone: '1300224636', hours: '24 hours' }
      ],
      _unsubAuth: null,
    }
  },

  computed: {
    showBackBtn() {
      const name = this.$route?.name || ''
      return name === 'Student' || name === 'Teacher'
    },
    showLoginBtn() {
      const routeName = this.$route?.name || ''
      return !this.isLoggedIn && routeName !== 'Login'
    },
    userInitial() {
      const n = (this.currentUserName || '').trim()
      return n ? n.charAt(0).toUpperCase() : 'U'
    }
  },

  async created() {
    // 1) Listen for future changes
    this._unsubAuth = onAuthStateChanged(auth, (u) => this.applyUser(u))

    // 2) Also apply immediately if user already known (after redirect from login)
    await this.applyUser(auth.currentUser)
  },

  beforeUnmount() {
    if (this._unsubAuth) this._unsubAuth()
  },

  methods: {
    async applyUser(u) {
      if (!u) {
        this.isLoggedIn = false
        this.currentUserName = ''
        this.role = ''
        return
      }

      // Prefer Firestore profile name; then Auth displayName; finally email
      let nameFromProfile = ''
      let roleFromProfile = 'student'

      try {
        const snap = await getDoc(doc(db, "users", u.uid));
        if (snap.exists()) {
          const p = snap.data()
          nameFromProfile = (p?.name || '').trim()
          roleFromProfile = p?.role || roleFromProfile
        }
      } catch (e) {
        console.warn('Profile read failed:', e?.message || e)
      }

      const display = u.displayName || u.email || 'User'
      this.isLoggedIn = true
      this.currentUserName = nameFromProfile || display
      this.role = roleFromProfile
    },

    async logout() {
      try { await signOut(auth) } finally {
        this.isLoggedIn = false
        this.currentUserName = ''
        this.role = ''
        this.$router.push('/login')
      }
    }
  }
}
</script>


<style scoped>
.avatar {
  width: 22px;
  height: 22px;
  line-height: 22px;
  text-align: center;
  border-radius: 50%;
  background: #e9ecef;
  font-weight: 600;
}

.user-name {
  max-width: 140px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dropdown-menu .dropdown-item {
  font-size: 0.875rem;
  text-decoration: none;
  padding: 0.25rem 0.75rem;
}

.dropdown-menu .dropdown-item:hover,
.dropdown-menu .dropdown-item:focus {
  text-decoration: underline;
}
</style>
