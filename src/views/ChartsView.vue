<template>
  <section class="container py-3">
    <h1 class="h5 mb-3">Interactive Charts</h1>

    <!-- Pie Chart -->
    <div class="card shadow-sm mb-4" style="max-width: 480px; margin: auto;">
      <div class="card-body text-center">
        <h2 class="h6 mb-3">Users by Role</h2>
        <div style="height: 220px; width: 100%; margin: auto;">
          <canvas ref="pieEl" style="max-height: 200px;"></canvas>
        </div>
        <div class="small text-muted mt-2">{{ hoverText }}</div>
      </div>
    </div>

    <!-- Line Chart -->
    <div class="card shadow-sm" style="max-width: 700px; margin: auto;">
      <div class="card-body">
        <h2 class="h6 mb-3">Sign-ups (last 7 days)</h2>
        <div style="height: 260px;">
          <canvas ref="lineEl" style="max-height: 240px;"></canvas>
        </div>
      </div>
    </div>
  </section>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { db } from '@/firebase/init'
import { collection, query, where, getCountFromServer, Timestamp, orderBy, limit, getDocs } from 'firebase/firestore'

let Chart
const pieEl = ref(null)
const lineEl = ref(null)
const hoverText = ref('')

async function countsByRole() {
  const col = collection(db, 'users') 
  const total   = (await getCountFromServer(query(col))).data().count
  const student = (await getCountFromServer(query(col, where('role','==','student')))).data().count
  const staff   = (await getCountFromServer(query(col, where('role','==','teacher')))).data().count
  const admin   = (await getCountFromServer(query(col, where('role','==','admin')))).data().count
  return { total, student, staff, admin }
}

async function signupsLast7() {
  const col = collection(db, 'users')
  const now = new Date()
  const start = new Date(now); start.setDate(now.getDate()-6)

  let snap
  try {
    snap = await getDocs(query(col, where('createdAt','>=', Timestamp.fromDate(start)), orderBy('createdAt','asc'), limit(500)))
  } catch {
    snap = await getDocs(query(col, limit(500))) // fallback
  }
  const counts = Array(7).fill(0)
  const labels = [...Array(7)].map((_,i)=> {
    const d=new Date(start); d.setDate(start.getDate()+i)
    return d.toLocaleDateString()
  })
  for (const d of snap.docs) {
    const ts = d.data().createdAt
    const dt = typeof ts?.toDate==='function' ? ts.toDate() : (ts? new Date(ts): null)
    if (!dt) continue
    const idx = Math.round((dt - start)/(24*3600*1000))
    if (idx>=0 && idx<7) counts[idx]++
  }
  return { labels, counts }
}

function onHover(evt) {
  if (!pieEl.value?._chart) return
  const points = pieEl.value._chart.getElementsAtEventForMode(evt, 'nearest', { intersect: true }, true)
  if (!points.length) { hoverText.value=''; return }
  const i = points[0].index
  const label = pieEl.value._chart.data.labels[i]
  const val = pieEl.value._chart.data.datasets[0].data[i]
  hoverText.value = `${label}: ${val}`
}

onMounted(async ()=>{
  Chart = (await import('chart.js/auto')).default
  const roles = await countsByRole()
  const s7 = await signupsLast7()

  const pie = new Chart(pieEl.value.getContext('2d'), {
    type:'pie',
    data:{ labels:['Students','Teacher','Admins'], datasets:[{ data:[roles.student, roles.staff, roles.admin] }] },
    options:{ plugins:{ legend:{ position:'bottom' } } }
  })
  pieEl.value._chart = pie

  new Chart(lineEl.value.getContext('2d'), {
    type:'line',
    data:{ labels:s7.labels, datasets:[{ label:'Sign-ups', data:s7.counts, tension:.3 }] },
    options:{ plugins:{ legend:{ display:false } }, scales:{ y:{ beginAtZero:true, precision:0 } } }
  })
})
</script>
