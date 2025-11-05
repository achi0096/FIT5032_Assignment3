<template>
  <section class="container py-3">
    <h1 class="h4 mb-3">Book an Appointment</h1>

    <!-- Teacher + form -->
    <div class="row g-3 align-items-end mb-2">
      <div class="col-md-5">
        <label class="form-label">Teacher</label>
        <select v-model="teacherId" class="form-select" @change="reloadCalendar">
          <option disabled value="">
            {{ teachers.length ? '-- Select a teacher --' : 'No teachers found (add /users docs)' }}
          </option>
          <option v-for="t in teachers" :key="t.id" :value="t.id">
            {{ t.displayName || t.id }}
          </option>
        </select>
      </div>

      <div class="col-md-4">
        <label class="form-label">Title</label>
        <input v-model="title" class="form-control" placeholder="e.g., Counselling session" />
      </div>      
    </div>

    <div class="row g-3 mb-3">
      <div class="col-md-4">
        <label class="form-label">Start</label>
        <input v-model="start" type="datetime-local" class="form-control" />
      </div>
      <div class="col-md-4">
        <label class="form-label">End</label>
        <input v-model="end" type="datetime-local" class="form-control" />
      </div>
      <div class="col-md-4 d-flex align-items-end gap-2">
        <button class="btn btn-primary btn-sm" @click="createBooking">Book</button>
        <button class="btn btn-outline-secondary btn-sm" @click="resetForm">Reset</button>
      </div>
    </div>

    <div class="mb-2">
      <small class="text-muted">Showing bookings for: <strong>{{ currentTeacherName || '—' }}</strong></small>
    </div>
    <div ref="calendarRef" />

    <hr class="my-4" />
    <div class="alert alert-info py-2">
      <strong>Tip:</strong> Click on an event you created to cancel it.
    </div>
  </section>
</template>

<script setup>

/* ===== Vue & Firebase ===== */
import { onMounted, onBeforeUnmount, ref, computed } from 'vue'
import { auth, db } from '@/firebase/init'
import {
  collection, addDoc, getDocs, query, where, Timestamp,
  doc, updateDoc, serverTimestamp, setDoc
} from 'firebase/firestore'

/* ===== FullCalendar ===== */
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import { Calendar } from '@fullcalendar/core'

/* ----- State ----- */
const teachers = ref([])       // [{ id, displayName }]
const teacherId = ref('')      // selected teacher uid
const title = ref('')
const start = ref('')
const end = ref('')
const calendarRef = ref(null)
let calendar = null

const currentTeacherName = computed(() => {
  const t = teachers.value.find(t => t.id === teacherId.value)
  return t?.displayName || ''
})

/* ----- Utils ----- */
function parseDT(localStr) {
  if (!localStr) return null
  const d = new Date(localStr)
  return isNaN(d.getTime()) ? null : d
}
function overlap(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && aEnd > bStart
}

/* ----- Seed a couple of teachers if none exist (dev helper) ----- */
async function seedTeachersIfEmpty() {
  const snap = await getDocs(query(collection(db, 'users'), where('role', '==', 'teacher')))
  if (!snap.empty) return
  await setDoc(doc(db, 'users', 'teacher_001'), {
    displayName: 'Dr. Alice Nguyen', role: 'teacher', createdAt: serverTimestamp()
  })
  await setDoc(doc(db, 'users', 'teacher_002'), {
    displayName: 'Mr. Ben Patel', role: 'teacher', createdAt: serverTimestamp()
  })
}

/* ----- Load teachers (role == 'teacher') ----- */
async function loadTeachers() {
  const qy = query(collection(db, 'users'), where('role', '==', 'teacher'))
  const snap = await getDocs(qy)
  teachers.value = snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

/* ----- Fetch events for selected teacher (NO composite index needed) ----- */
async function fetchEventsForTeacher(tid) {
  if (!tid) return []

  // 1) Query by single field only -> avoids composite index
  const qy = query(collection(db, 'appointments'), where('teacherId', '==', tid))
  const snap = await getDocs(qy)

  // 2) Filter by date window and sort in JS
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  const future = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)

  const rows = snap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .filter(r => r.status !== 'cancelled' && r.status !== 'declined')
    .filter(r => {
      const s = r.start?.toDate?.() || new Date(r.start)
      return s >= monthStart && s < future
    })
    .sort((a, b) => {
      const as = a.start?.toDate?.() || new Date(a.start)
      const bs = b.start?.toDate?.() || new Date(b.start)
      return as - bs
    })

  return rows.map(r => ({
    id: r.id,
    title: r.title || 'Appointment',
    start: r.start?.toDate?.() || new Date(r.start),
    end: r.end?.toDate?.() || new Date(r.end),
    extendedProps: {
      studentId: r.studentId,
      teacherId: r.teacherId,
      status: r.status || 'confirmed',
      createdBy: r.createdBy
    }
  }))
}

/* ----- Minimal conflict check (no composite index) ----- */
async function hasConflictMinimal(tid, sTs, eTs) {
  const qy = query(collection(db, 'appointments'), where('teacherId', '==', tid))
  const snap = await getDocs(qy)
  return snap.docs.some(d => {
    const r = d.data()
    if (r.status === 'cancelled' || r.status === 'declined') return false
    const iStart = r.start?.toDate?.() || new Date(r.start)
    const iEnd   = r.end?.toDate?.() || new Date(r.end)
    return overlap(sTs.toDate(), eTs.toDate(), iStart, iEnd)
  })
}

/* ----- Create booking ----- */
async function createBooking() {
  try {
    const user = auth?.currentUser
    if (!user) { alert('Please sign in first.'); return }
    if (!teacherId.value) { alert('Please select a teacher.'); return }
    if (!title.value || !start.value || !end.value) { alert('Please fill Title, Start and End.'); return }

    const sDate = parseDT(start.value)
    const eDate = parseDT(end.value)
    if (!sDate || !eDate) { alert('Choose valid Start/End.'); return }
    if (eDate <= sDate) { alert('End must be after Start.'); return }

    const sTs = Timestamp.fromDate(sDate)
    const eTs = Timestamp.fromDate(eDate)

    // Check overlap for this teacher
    if (await hasConflictMinimal(teacherId.value, sTs, eTs)) {
      alert('That time conflicts with an existing booking for this teacher.')
      return
    }

    await addDoc(collection(db, 'appointments'), {
      title: title.value.trim(),
      start: sTs,
      end: eTs,
      studentId: user.uid,
      teacherId: teacherId.value,
      status: 'confirmed',
      createdBy: user.uid,
      createdAt: Timestamp.now()
    })

    resetForm()
    await reloadCalendar()
    alert('Booked!')
  } catch (e) {
    console.error(e)
    alert('Booking failed: ' + (e?.message || e))
  }
}

/* ----- Cancel by clicking your own event ----- */
async function onEventClick(info) {
  const user = auth?.currentUser
  if (!user) return
  const { id, extendedProps, title } = info.event
  if (extendedProps?.studentId !== user.uid) {
    alert('You can only cancel your own bookings.')
    return
  }
  if (!confirm(`Cancel "${title}"?`)) return

  try {
    await updateDoc(doc(db, 'appointments', id), { status: 'cancelled' })
    await reloadCalendar()
  } catch (e) {
    console.error(e)
    alert('Cancel failed: ' + (e?.message || e))
  }
}

/* ----- Calendar init/refresh ----- */
async function reloadCalendar() {
  if (!calendar) return
  const events = await fetchEventsForTeacher(teacherId.value)
  calendar.removeAllEvents()
  calendar.addEventSource(events)
}

function resetForm() {
  title.value = ''
  start.value = ''
  end.value = ''
}

onMounted(async () => {
  await seedTeachersIfEmpty()   // remove if you already have teachers in /users
  await loadTeachers()

  calendar = new Calendar(calendarRef.value, {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'timeGridWeek',
    height: 'auto',
    slotMinTime: '08:00:00',
    slotMaxTime: '18:00:00',
    nowIndicator: true,
    selectable: false,
    eventTimeFormat: { hour: '2-digit', minute: '2-digit', hour12: false },
    eventClick: onEventClick
  })
  calendar.render()

})

onBeforeUnmount(() => {
  if (calendar) {
    calendar.destroy()
    calendar = null
  }
})
</script>

<style scoped>
:deep(.fc) { font-size: 0.92rem; }
</style>
