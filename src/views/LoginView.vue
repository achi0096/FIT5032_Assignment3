<template>
  <div class="container my-4" style="max-width:520px">
    <h2 class="mb-3 text-center">Sign in / Register</h2>

    <ul class="nav nav-pills mb-3 justify-content-center">
      <li class="nav-item"><button class="nav-link" :class="{active: tab==='login'}" @click="tab='login'">Login</button></li>
      <li class="nav-item"><button class="nav-link" :class="{active: tab==='register'}" @click="tab='register'">Register</button></li>
    </ul>

    <!-- LOGIN -->
    <form v-if="tab==='login'" @submit.prevent="onLogin" novalidate>
      <div class="mb-3">
        <label class="form-label" for="luser">Username</label>
        <input id="luser" v-model.trim="login.username" class="form-control" required />
      </div>
      <div class="mb-3">
        <label class="form-label" for="lpass">Password</label>
        <input id="lpass" type="password" v-model="login.password" class="form-control" required minlength="4" />
      </div>
      <p v-if="errors.login" class="text-danger">{{ errors.login }}</p>
      <button class="btn btn-primary w-100">Login</button>
    </form>

    <!-- REGISTER -->
    <form v-else @submit.prevent="onRegister" novalidate>
      <div class="mb-3">
        <label class="form-label" for="ruser">Username</label>
        <input id="ruser" v-model.trim="register.username" class="form-control" required pattern="^[a-zA-Z0-9_]{3,20}$" />
        <div class="form-text">3–20 letters/numbers/underscore</div>
      </div>

      <div class="row g-2">
        <div class="col-sm-6">
          <label class="form-label" for="rpass">Password</label>
          <input id="rpass" type="password" v-model="register.password" class="form-control"
                 required minlength="6" maxlength="32" />
        </div>
        <div class="col-sm-6">
          <label class="form-label" for="rcpass">Confirm password</label>
          <input id="rcpass" type="password" v-model="register.confirm" class="form-control" required @blur="checkConfirm()" />
          <div v-if="errors.confirm" class="text-danger small">{{ errors.confirm }}</div>
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label">Role</label>
        <select v-model="register.role" class="form-select" required>
          <option disabled value="">-- choose --</option>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>
      </div>

      <p v-if="errors.register" class="text-danger">{{ errors.register }}</p>
      <button class="btn btn-success w-100">Create account</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const tab = ref('login')

// form models
const login = ref({ username:'', password:'' })
const register = ref({ username:'', password:'', confirm:'', role:'' })
const errors = ref({ login:'', register:'', confirm:'' })

function sanitize(str){ return String(str).replace(/[<>&"'`]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&#39;','`':'&#96;'}[c])) }

// very tiny “user DB” in localStorage (Week-2/3/4 skills + hint to use local storage from Assignment)
function loadUsers(){
  try { return JSON.parse(localStorage.getItem('ymhw_users')) || {} }
  catch (err) { return {} }
}
function saveUsers(db){
  localStorage.setItem('ymhw_users', JSON.stringify(db))
}
function loginSession({ name, role }) {
  localStorage.setItem('ymhw_logged_in', 'yes')
  localStorage.setItem('ymhw_current_user', JSON.stringify({ name, role }))
  // let App.vue navbar update immediately
  window.dispatchEvent(new Event('auth-changed'))
}

function onLogin(){
  errors.value.login = ''
  const db = loadUsers()
  const u = sanitize(login.value.username)
  const ok = db[u] && db[u].password === login.value.password
  if(!ok){ errors.value.login = 'Invalid username or password.'; return }
  saveSession({ loggedIn:true, username:u, role: db[u].role })
  // redirect to requested page or home
  const redirect = new URLSearchParams(location.search).get('redirect') || '/'
  location.href = redirect
}

function checkConfirm(){
  errors.value.confirm = (register.value.password && register.value.confirm && register.value.password !== register.value.confirm)
    ? 'Passwords do not match.' : ''
}

function onRegister(){
  errors.value.register = ''
  if(register.value.password.length < 6){ errors.value.register = 'Use at least 6 characters.'; return }
  if(register.value.password !== register.value.confirm){ errors.value.register = 'Passwords do not match.'; return }
  if(!register.value.role){ errors.value.register = 'Please choose a role.'; return }

  const db = loadUsers()
  const u = sanitize(register.value.username)
  if(db[u]){ errors.value.register = 'Username already exists.'; return }
  db[u] = { password: register.value.password, role: register.value.role }
  saveUsers(db)
  alert('Account created! Please login.')
  tab.value = 'login'
}
</script>
