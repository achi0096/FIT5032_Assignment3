<template>
  <section class="mx-auto" style="max-width: 680px;">
    <!-- Title -->
    <div class="d-flex align-items-center gap-3 mb-4">
      <img
        src="/logo.jpeg"
        alt="Youth Mental Health & Wellbeing logo"
        width="72"
        height="72"
        class="rounded-circle"
      />
      <div>
        <h1 class="h4 mb-1">Welcome to Youth Mental Health & Wellbeing</h1>
        <p class="text-muted mb-0">Sign in or create an account</p>
      </div>
    </div>

    <!-- Tabs -->
    <div class="btn-group mb-3" role="group" aria-label="Auth tabs">
      <button
        type="button"
        class="btn"
        :class="tab === 'signin' ? 'btn-primary' : 'btn-outline-primary'"
        @mousedown.prevent="prepareTabSwitch('signin')"
        @click="switchTab('signin')"
      >
        Sign In
      </button>

      <button
        type="button"
        class="btn"
        :class="tab === 'signup' ? 'btn-primary' : 'btn-outline-primary'"
        @mousedown.prevent="prepareTabSwitch('signup')"
        @click="switchTab('signup')"
      >
        Sign Up
      </button>
    </div>

    <!-- Card -->
    <div class="card shadow-sm">
      <div class="card-body">
        <p v-if="info" class="text-success small mb-2" role="status" aria-live="polite">{{ info }}</p>
        <p v-if="error" class="text-danger small mb-2" role="alert">{{ error }}</p>

        <form @submit.prevent="submitForm" class="row g-3" novalidate>
          <!-- Full name (Sign Up only) -->
          <div v-if="tab === 'signup'" class="col-12">
            <label for="name" class="form-label">Full name</label>
            <input
              id="name"
              v-model.trim="name"
              type="text"
              class="form-control"
              autocomplete="name"
              maxlength="80"
              @blur="validateName()"
              @input="touched.name = true; validateName(); onSignUpInput()"
              :aria-invalid="!!errors.name ? 'true' : undefined"
              aria-describedby="name-err"
            />
            <div v-if="(signupSubmitted || touched.name) && errors.name" id="name-err" class="text-danger small" role="alert">
              {{ errors.name }}
            </div>
          </div>

          <!-- Email -->
          <div class="col-12">
            <label for="email" class="form-label">Email</label>
            <input
              id="email"
              v-model.trim="email"
              type="email"
              class="form-control"
              maxlength="80"
              autocomplete="email"
              @blur="validateEmail()"
              @input="touched.email = true; validateEmail(); onSignUpInput(); onSignInInput()"
              :aria-invalid="(tab==='signup' && !!errors.email) ? 'true' : undefined"
              :aria-describedby="tab==='signup' ? 'email-err' : null"
            />
            <div v-if="tab === 'signup' && (signupSubmitted || touched.email) && errors.email" id="email-err" class="text-danger small" role="alert">
              {{ errors.email }}
            </div>
          </div>

          <!-- Password -->
          <div class="col-12">
            <label for="password" class="form-label">Password</label>
            <div class="pw-wrap">
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                class="form-control with-eye"
                :autocomplete="tab === 'signin' ? 'current-password' : 'new-password'"
                maxlength="80"
                @blur="validatePassword()"
                @input="touched.password = true; validatePassword(); onSignUpInput(); onSignInInput()"
                :aria-invalid="(tab==='signup' && !!errors.password) ? 'true' : undefined"
                aria-describedby="pwd-hint pwd-err"
              />
              <span
                class="eye-toggle"
                @mousedown.prevent
                @click="showPassword = !showPassword"
                :aria-label="showPassword ? 'Hide password' : 'Show password'"
                role="button"
                tabindex="0"
              >
                <svg v-if="!showPassword" width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M1.5 12s3.8-6.5 10.5-6.5S22.5 12 22.5 12s-3.8 6.5-10.5 6.5S1.5 12 1.5 12Z" stroke="#6c757d" stroke-width="1.8"/>
                  <circle cx="12" cy="12" r="3.5" stroke="#6c757d" stroke-width="1.8"/>
                </svg>
                <svg v-else width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M1.5 12s3.8-6.5 10.5-6.5c2.2 0 4.1.7 5.8 1.7M22.5 12s-3.8 6.5-10.5 6.5c-2.2 0-4.1-.7-5.8-1.7" stroke="#6c757d" stroke-width="1.8" stroke-linecap="round"/>
                  <circle cx="12" cy="12" r="3.5" stroke="#6c757d" stroke-width="1.8"/>
                  <path d="M3 21L21 3" stroke="#6c757d" stroke-width="1.8" stroke-linecap="round"/>
                </svg>
              </span>
            </div>

            <div v-if="tab === 'signup'" id="pwd-hint" class="form-text">
              Password must contain minimum 8 characters with alphabets and numbers.
            </div>

            <div v-if="tab === 'signin'" class="text-end mt-1">
              <router-link to="/reset-password" class="small text-decoration-none">Forgot password?</router-link>
            </div>

            <div v-if="(signupSubmitted || touched.password) && errors.password" id="pwd-err" class="text-danger small" role="alert">
              {{ errors.password }}
            </div>
          </div>

          <!-- Confirm Password -->
          <div v-if="tab === 'signup'" class="col-12">
            <label for="cpw" class="form-label">Confirm password</label>
            <div class="pw-wrap">
              <input
                id="cpw"
                v-model="confirmPassword"
                :type="showConfirm ? 'text' : 'password'"
                class="form-control with-eye"
                maxlength="80"
                autocomplete="new-password"
                @blur="validateConfirm()"
                @input="touched.confirm = true; validateConfirm(); onSignUpInput()"
                :aria-invalid="!!errors.confirm ? 'true' : undefined"
                aria-describedby="cpw-err"
              />
              <span
                class="eye-toggle"
                @mousedown.prevent
                @click="showConfirm = !showConfirm"
                :aria-label="showConfirm ? 'Hide password' : 'Show password'"
                role="button"
                tabindex="0"
              >
                <svg v-if="!showConfirm" width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M1.5 12s3.8-6.5 10.5-6.5S22.5 12 22.5 12s-3.8 6.5-10.5 6.5S1.5 12 1.5 12Z" stroke="#6c757d" stroke-width="1.8"/>
                  <circle cx="12" cy="12" r="3.5" stroke="#6c757d" stroke-width="1.8"/>
                </svg>
                <svg v-else width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M1.5 12s3.8-6.5 10.5-6.5c2.2 0 4.1.7 5.8 1.7M22.5 12s-3.8 6.5-10.5 6.5c-2.2 0-4.1-.7-5.8-1.7" stroke="#6c757d" stroke-width="1.8" stroke-linecap="round"/>
                  <circle cx="12" cy="12" r="3.5" stroke="#6c757d" stroke-width="1.8"/>
                  <path d="M3 21L21 3" stroke="#6c757d" stroke-width="1.8" stroke-linecap="round"/>
                </svg>
              </span>
            </div>
            <div v-if="(signupSubmitted || touched.confirm) && errors.confirm" id="cpw-err" class="text-danger small" role="alert">
              {{ errors.confirm }}
            </div>
          </div>

          <!-- Role -->
          <div v-if="tab === 'signup'" class="col-12">
            <label for="role" class="form-label">Role</label>
            <select id="role" v-model="role" class="form-select">
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
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

          <!-- Divider + Google -->
          <div v-if="tab === 'signin'" class="col-12">
            <div class="d-flex align-items-center my-2">
              <hr class="flex-grow-1" />
              <span class="px-2 text-muted small">or</span>
              <hr class="flex-grow-1" />
            </div>
            <button type="button" class="btn btn-light border w-100" @click="signInWithGoogle" aria-label="Continue with Google">
              <span class="d-inline-flex align-items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
                  <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.9 32.6 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 3l5.7-5.7C33.7 6.1 29.1 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.1-.4-3.5z"/>
                  <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 19 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C33.7 6.1 29.1 4 24 4 16.3 4 9.6 8.5 6.3 14.7z"/>
                  <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.4l-6.3-5.2C29.2 35.5 26.8 36 24 36c-5.3 0-9.9-3.4-11.6-8.2l-6.6 5.1C9.2 39.5 16 44 24 44z"/>
                  <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.3 3.8-5.1 8-11.3 8-5.3 0-9.9-3.4-11.6-8.2l-6.6 5.1C9.2 39.5 16 44 24 44 35.1 44 44 35.1 44 24 44 22.8 43.9 21.7 43.6 20.5z"/>
                </svg>
                Continue with Google
              </span>
            </button>
          </div>

          <!-- Toggle -->
          <div class="col-12 text-center">
            <small class="text-muted">
              {{ tab === 'signin' ? "Don’t have an account?" : "Already have an account?" }}
              <a
                href="#"
                @mousedown.prevent="prepareTabSwitch(tab === 'signin' ? 'signup' : 'signin')"
                @click.prevent="switchTab(tab === 'signin' ? 'signup' : 'signin')"
              >
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
import { auth, db, googleProvider } from "@/firebase/init";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  signOut,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

export default {
  name: "LoginView",
  data() {
    return {
      tab: "signin",
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "student",
      error: "",
      info: "",
      showPassword: false,
      showConfirm: false,
      touched: { name: false, email: false, password: false, confirm: false },
      signupSubmitted: false,
      suppressErrors: false,
      errors: { name: null, email: null, password: null, confirm: null },
    };
  },

  async mounted() {
    try {
      const result = await getRedirectResult(auth);
      if (result?.user) await this.handleGoogleUser(result.user);
    } catch (e) {
      console.debug("Redirect Google error:", e);
    }
  },

  methods: {
    // ---------- session helpers ----------
    saveSession({ name, role }) {
      localStorage.setItem("ymhw_logged_in", "yes");
      localStorage.setItem("ymhw_current_user", JSON.stringify({ name, role }));
      window.dispatchEvent(new Event("auth-changed"));
    },
    clearSession() {
      localStorage.removeItem("ymhw_logged_in");
      localStorage.removeItem("ymhw_current_user");
      window.dispatchEvent(new Event("auth-changed"));
    },

    // ---------- Google Sign-In ----------
    async signInWithGoogle() {
      this.error = ""; this.info = "";
      try {
        let result;
        try {
          result = await signInWithPopup(auth, googleProvider);
        } catch (e) {
          if (e?.code === "auth/popup-blocked") {
            await signInWithRedirect(auth, googleProvider);
            return;
          }
          throw e;
        }
        await this.handleGoogleUser(result.user);
      } catch (e) {
        const map = {
          "auth/popup-closed-by-user": "Sign-in closed before completing.",
          "auth/account-exists-with-different-credential": "Account exists with a different sign-in method.",
          "auth/network-request-failed": "Network error. Try again.",
        };
        this.error = map[e?.code] || e?.message || "Google sign-in failed.";
        console.debug("Google sign-in error:", e);
      }
    },

    async handleGoogleUser(user) {
      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);
      if (!snap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          displayName: user.displayName || "",
          email: user.email || "",
          role: "student",
          provider: "google",
          createdAt: serverTimestamp(),
        });
      }
      const s2 = await getDoc(userRef);
      const role = s2.exists() && s2.data().role ? s2.data().role : "student";
      const name = user.displayName || user.email || "User";
      this.saveSession({ name, role });
      this.info = "Signed in with Google.";
      this.$router.push("/resources");
    },

    // ---------- validation ----------
    normalizeEmail(str) {
      return (str || "").trim().toLowerCase();
    },
    prepareTabSwitch() {
      this.suppressErrors = true;
      this.error = "";
      this.info = "";
      this.errors = { name: null, email: null, password: null, confirm: null };
      this.touched = { name: false, email: false, password: false, confirm: false };
    },
    switchTab(t) {
      this.tab = t;
      this.name = "";
      this.email = "";
      this.password = "";
      this.confirmPassword = "";
      this.role = "student";
      this.showPassword = false;
      this.showConfirm = false;
      this.touched = { name: false, email: false, password: false, confirm: false };
      this.signupSubmitted = false;
      this.$nextTick(() => {
        const firstId = t === "signin" ? "email" : "name";
        document.getElementById(firstId)?.focus();
        setTimeout(() => (this.suppressErrors = false), 0);
      });
    },
    clearSignUp() {
      if (this.tab !== "signup") return;
      this.name = "";
      this.email = "";
      this.password = "";
      this.confirmPassword = "";
      this.role = "student";
      this.showPassword = false;
      this.showConfirm = false;
      this.error = "";
      this.info = "";
      this.errors = { name: null, email: null, password: null, confirm: null };
      this.touched = { name: false, email: false, password: false, confirm: false };
      this.signupSubmitted = false;
      this.$nextTick(() => document.getElementById("name")?.focus());
    },

    validateName() {
      if (this.suppressErrors || this.tab !== "signup") return;
      this.errors.name = !this.name || this.name.length < 2 ? "Name must be at least 2 characters" : null;
    },
    validateEmail() {
      if (this.suppressErrors) return;
      if (this.tab === "signup") {
        this.errors.email = this.email && this.email.includes("@") ? null : "Please enter a valid email";
      } else {
        this.errors.email = null;
      }
    },
    validatePassword() {
      if (this.suppressErrors) return;
      if (this.tab === "signup") {
        const pw = this.password || "";
        const strong = pw.length >= 8 && /[A-Za-z]/.test(pw) && /\d/.test(pw);
        this.errors.password = strong ? null : "Password needs 8+ chars with letters and numbers";
      } else {
        this.errors.password = null;
      }
    },
    validateConfirm() {
      if (this.suppressErrors || this.tab !== "signup") return;
      this.errors.confirm = this.password === this.confirmPassword ? null : "Passwords do not match";
    },

    // ---------- email/password flows ----------
    async doSignInWithFirebase(email, password) {
      const map = {
        "auth/invalid-credential": "Invalid email or password",
        "auth/user-not-found": "No account with this email",
        "auth/wrong-password": "Wrong password",
        "auth/invalid-email": "Please enter a valid email",
        "auth/too-many-requests": "Too many attempts; try again later",
        "auth/email-already-in-use": "Email is already registered",
        "auth/weak-password": "Password needs 8+ chars with letters and numbers",
      };
      try {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        let role = "student";
        try {
          const snap = await getDoc(doc(db, "users", cred.user.uid));
          role = snap.exists() && typeof snap.data().role === "string" ? snap.data().role : "student";
        } catch {}
        const name = cred.user.displayName || cred.user.email || "User";
        this.saveSession({ name, role });
        this.info = "Signed in successfully.";
        this.$router.push("/resources");
      } catch (e) {
        this.error = map[e.code] ?? "Login failed. Please try again.";
        console.debug("SignIn error:", e.code, e.message);
      }
    },

    async doSignUpWithFirebase({ name, email, password, role }) {
      const map = {
        "auth/email-already-in-use": "Email is already registered",
        "auth/invalid-email": "Please enter a valid email",
        "auth/weak-password": "Password needs 8+ chars with letters and numbers",
      };
      try {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        const cleanName = (name || "").trim();
        if (cleanName) await updateProfile(cred.user, { displayName: cleanName });
        await setDoc(doc(db, "users", cred.user.uid), {
          uid: cred.user.uid,
          displayName: cleanName,
          email,
          role: role || "student",
          createdAt: serverTimestamp(),
        });
        this.info = "Account created. Please sign in.";
        this.tab = "signin";
        this.password = "";
        this.confirmPassword = "";
        this.$nextTick(() => document.getElementById("email")?.focus());
      } catch (e) {
        this.error = map[e.code] ?? (e.message || "Could not create account");
        console.debug("SignUp error:", e.code, e.message);
      }
    },

    async submitForm() {
      this.error = "";
      this.info = "";
      if (this.tab === "signin") {
        const emailN = this.normalizeEmail(this.email);
        if (!emailN && !this.password) { this.error = "Username and password must be entered"; return; }
        if (!emailN) { this.error = "Username must be entered"; return; }
        if (!this.password) { this.error = "Password must be entered"; return; }
        await this.doSignInWithFirebase(emailN, this.password);
        return;
      }

      // Sign Up path
      this.signupSubmitted = true;
      this.validateName(); this.validateEmail(); this.validatePassword(); this.validateConfirm();

      const firstMissing = () => {
        if (!this.name || !this.name.trim()) return "Full name must be entered";
        if (!this.email || !this.email.trim()) return "Email must be entered";
        if (!this.password) return "Password must be entered";
        if (!this.confirmPassword) return "Confirm password must be entered";
        return "";
      };
      const missing = firstMissing();
      if (missing) { this.error = missing; return; }
      if (!this.email.includes("@")) { this.error = "Please enter a valid email"; return; }
      if (this.password !== this.confirmPassword) { this.error = "Passwords do not match"; return; }
      const strong = this.password.length >= 8 && /[A-Za-z]/.test(this.password) && /\d/.test(this.password);
      if (!strong) { this.error = "Password needs 8+ chars with letters and numbers"; return; }

      await this.doSignUpWithFirebase({
        name: this.name,
        email: this.normalizeEmail(this.email),
        password: this.password,
        role: this.role,
      });
    },

    async sendResetEmail() {
      if (!this.email?.trim()) { this.error = "Enter your email first"; return; }
      try {
        await sendPasswordResetEmail(auth, this.normalizeEmail(this.email));
        this.info = "Password reset email sent.";
      } catch (e) {
        this.error = e.message || "Could not send reset email.";
      }
    },

    async signOutNow() {
      await signOut(auth);
      this.clearSession();
    },

    onSignInInput() { if (this.tab !== "signin") return; this.error = ""; },
    onSignUpInput() { if (this.tab !== "signup") return; },
  },
};
</script>

<style scoped>
.pw-wrap { position: relative; }
.with-eye { padding-right: 2.4rem; }
.eye-toggle {
  position: absolute; top: 50%; right: 10px; transform: translateY(-50%);
  cursor: pointer; width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; z-index: 2;
}
.eye-toggle:active { transform: translateY(-50%) scale(0.96); }

@media (max-width: 576px) {
  section { padding-left: 12px; padding-right: 12px; }
}
</style>
