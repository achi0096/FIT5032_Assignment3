<template>
  <section class="container py-3">
    <h1 class="h4 mb-3">Bulk Email</h1>

    <div class="row g-2 align-items-center mb-3">
      <div class="col-auto">
        <select v-model="roleFilter" class="form-select form-select-sm" aria-label="Filter by role">
          <option value="">All roles</option>
          <option value="student">Students</option>
          <option value="teacher">Teachers</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      <div class="col-auto">
        <button class="btn btn-outline-secondary btn-sm" @click="loadAndAddRecipients">
          Load Users (add to Recipients)
        </button>
      </div>

      <div class="col-auto" v-if="users.length">
        <span class="badge text-bg-light">Showing {{ users.length }} user(s)</span>
      </div>
    </div>

    <!-- Simple preview list -->
    <div class="mb-3" v-if="users.length">
      <div class="small text-muted mb-1">Users found</div>
      <div class="border rounded p-2" style="max-height: 220px; overflow:auto;">
        <ul class="list-unstyled mb-0">
          <li v-for="u in users" :key="u.id" class="d-flex justify-content-between align-items-center py-1">
            <span>
              <strong>{{ u.name || '(no name)' }}</strong>
              <span class="text-muted"> — {{ u.email }}</span>
            </span>
            <span class="badge text-bg-secondary">{{ u.role || 'unknown' }}</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Recipients -->
    <div class="mb-3">
      <div class="d-flex justify-content-between align-items-center mb-1">
        <div class="small text-muted">Recipients ({{ recipients.length }})</div>
        <button v-if="recipients.length" class="btn btn-link btn-sm p-0" @click="recipients = []">Clear all</button>
      </div>

      <div class="border rounded p-2" style="min-height:48px;">
        <span
          v-for="email in recipients"
          :key="email"
          class="badge text-bg-primary me-1 mb-1"
          style="font-weight:500;"
        >
          {{ email }}
          <button
            type="button"
            class="btn-close btn-close-white btn-sm ms-1"
            aria-label="Remove"
            @click="removeRecipient(email)"
            style="transform: scale(.8);"
          ></button>
        </span>

        <span v-if="!recipients.length" class="text-muted small">
          No recipients yet. Choose a role and click <em>Load Users</em>.
        </span>
      </div>
    </div>

    <div class="mb-3">
      <input v-model="subject" class="form-control mb-2" placeholder="Subject" />
      <textarea v-model="body" rows="6" class="form-control" placeholder="Message"></textarea>
    </div>

    <button
      class="btn btn-primary btn-sm"
      :disabled="!recipients.length || sending || !subject || !body"
      @click="sendBulk"
    >
      {{ sending ? 'Sending…' : `Send to ${recipients.length} user(s)` }}
    </button>
    
  </section>
</template>

<script setup>
import { ref, watch } from 'vue'
import { db } from '@/firebase/init'
import { collection, getDocs, query, where } from 'firebase/firestore'

const roleFilter = ref('')         // '', 'student', 'teacher', 'admin'
const users = ref([])              // visible users (from DB)
const recipients = ref([])         // list of emails to send
const subject = ref('')
const body = ref('')
const sending = ref(false)

const dedupe = (arr) => [...new Set(arr.filter(Boolean))]

function removeRecipient(email) {
  recipients.value = recipients.value.filter(e => e !== email)
}


async function fetchUsersForRole() {
  users.value = []

  const collectionsToTry = ['profiles', 'users']  
  let found = []

  for (const collName of collectionsToTry) {
    let qRef = collection(db, collName)

  
    if (roleFilter.value) {
      try {
        const byRole = query(qRef, where('role', '==', roleFilter.value))
        const snap = await getDocs(byRole)
        found = snap.docs.map(d => mapUserDoc(d))
      } catch (e) {
        console.warn(`[${collName}] where('role','==','${roleFilter.value}') failed or no index:`, e?.message)
        const snap = await getDocs(qRef)
        found = snap.docs.map(d => mapUserDoc(d))
          .filter(u => (u.role || '').toLowerCase() === roleFilter.value)
      }
    } else {
      const snap = await getDocs(qRef)
      found = snap.docs.map(d => mapUserDoc(d))
    }

    if (found.length) {
      console.info(`Loaded ${found.length} from '${collName}'`)
      break
    }
  }

  users.value = found
}

function mapUserDoc(d) {
  const data = d.data() || {}
  const email = data.email || data.userEmail || data.contactEmail || ''
  const name  = data.name || data.displayName || data.fullName || ''
  const role  = (data.role || data.userRole || '').toString()
  return { id: d.id, email, name, role }
}

async function loadAndAddRecipients() { 
  if (!users.value.length) {
    await fetchUsersForRole()
  }
  const emails = users.value.map(u => u.email).filter(Boolean)
  if (!emails.length) {
    alert('No users found for this selection.')
    return
  }
  recipients.value = dedupe([...recipients.value, ...emails])
}

watch(roleFilter, async () => {  
  await fetchUsersForRole()
}, { immediate: true })

const sleep = (ms) => new Promise(r => setTimeout(r, ms))

async function sendBulk() {
  if (!subject.value || !body.value || !recipients.value.length) return
  sending.value = true
  try {
    const results = []
    for (const to of recipients.value) {
      const res = await fetch(window.SENDMAIL_URL || '/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Origin': location.origin },
        body: JSON.stringify({ to, subject: subject.value, text: body.value })
      })
      results.push({ to, ok: res.ok })
      await sleep(150)
    }
    const okCount = results.filter(r => r.ok).length
    alert(`Sent ${okCount}/${recipients.value.length} emails.`)
  } catch (e) {
    console.error(e)
    alert('Sending failed. See console.')
  } finally {
    sending.value = false
  }
}
</script>
