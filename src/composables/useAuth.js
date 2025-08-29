import { ref, computed } from 'vue'
import { sanitizeText } from '../utils/sanitize'


const LS_USERS = 'ymhw_users'
const LS_SESSION = 'ymhw_session'


const currentUser = ref(JSON.parse(localStorage.getItem(LS_SESSION) || 'null'))


function loadUsers() {
try { return JSON.parse(localStorage.getItem(LS_USERS) || '[]') } catch { return [] }
}
function saveUsers(users) { localStorage.setItem(LS_USERS, JSON.stringify(users)) }


async function hashPassword(password) {
const enc = new TextEncoder().encode(password)
const buf = await crypto.subtle.digest('SHA-256', enc)
return btoa(String.fromCharCode(...new Uint8Array(buf))) // base64
}


export function useAuth() {
const isAuthenticated = computed(() => !!currentUser.value)
const role = computed(() => currentUser.value?.role ?? null)


async function register({ name, email, password, role }) {
const users = loadUsers()
email = email.trim().toLowerCase()
if (users.find(u => u.email === email)) throw new Error('Email already registered')
const passwordHash = await hashPassword(password)
const user = {
id: crypto.randomUUID?.() || Math.random().toString(36).slice(2),
name: sanitizeText(name.trim()),
email,
role,
passwordHash,
createdAt: Date.now()
}
users.push(user); saveUsers(users)
currentUser.value = { id: user.id, name: user.name, email: user.email, role: user.role }
localStorage.setItem(LS_SESSION, JSON.stringify(currentUser.value))
return currentUser.value
}


async function login({ email, password }) {
const users = loadUsers()
email = email.trim().toLowerCase()
const user = users.find(u => u.email === email)
if (!user) throw new Error('Invalid email or password')
const passwordHash = await hashPassword(password)
if (user.passwordHash !== passwordHash) throw new Error('Invalid email or password')
currentUser.value = { id: user.id, name: user.name, email: user.email, role: user.role }
localStorage.setItem(LS_SESSION, JSON.stringify(currentUser.value))
return currentUser.value
}


function logout() {
currentUser.value = null
localStorage.removeItem(LS_SESSION)
}


return { currentUser, isAuthenticated, role, register, login, logout, loadUsers }
}