<template>
  <!-- Compact inline rating widget -->
  <div class="rating-inline" :class="sizeClass" role="group" :aria-label="`Rate ${itemId}`">
    <!-- 1–5 buttons (editable: user can change rating) -->
    <button v-for="n in 5" :key="n" type="button" class="rating-btn" :class="{ active: myRating === n }"
      @click="rate(n)" :aria-label="`Rate ${n} out of 5`" :title="`Rate ${n}/5`">
      {{ n }}
    </button>

    <!-- average + votes -->
    <span class="rating-meta">
      {{ avg.toFixed(1) }} / 5 · {{ count }} votes
    </span>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  itemId: { type: String, required: true },
  size: { type: String, default: 'sm' }
})

const myRating = ref(0)
const version = ref(0)

const sizeClass = computed(() => `rating-${props.size}`)

function safeParse(json, fallback) {
  try { return JSON.parse(json) ?? fallback } catch { return fallback }
}
function loadAll() {
  return safeParse(localStorage.getItem('ratings'), {})  
}
function saveAll(obj) {
  localStorage.setItem('ratings', JSON.stringify(obj))
}
function currentUserName() {
  const u = safeParse(localStorage.getItem('ymhw_current_user'), {})
  return (u && (u.name || u.email)) ? String(u.name || u.email) : 'anon'
}

const avg = computed(() => {
  version.value 
  const votes = loadAll()[props.itemId] || {}
  const vals = Object.values(votes).map(Number).filter(v => Number.isFinite(v))
  if (!vals.length) return 0
  return vals.reduce((a, b) => a + b, 0) / vals.length
})

const count = computed(() => {
  version.value 
  const votes = loadAll()[props.itemId] || {}
  return Object.keys(votes).length
})

function rate(n) {
  if (![1, 2, 3, 4, 5].includes(n)) return
  const store = loadAll()
  const u = currentUserName()
  const bucket = store[props.itemId] || {}
  bucket[u] = n                  
  store[props.itemId] = bucket
  saveAll(store)
  myRating.value = n
  version.value++                
}

function refreshMine() {
  const votes = loadAll()[props.itemId] || {}
  const mine = votes[currentUserName()]
  myRating.value = typeof mine === 'number' ? mine : 0
}
function onStorage(e) {
  if (e.key === 'ratings') version.value++ 
}

onMounted(() => {
  refreshMine()
  window.addEventListener('storage', onStorage)
})
onBeforeUnmount(() => {
  window.removeEventListener('storage', onStorage)
})
</script>

<style scoped>
.rating-inline {
  display: inline-flex;
  align-items: center;
  gap: .5rem;
}

.rating-meta {
  font-size: .8rem;
  color: #6c757d;
  white-space: nowrap;
}

/* Button styles */
.rating-btn {
  border: 1px solid #0d6efd;
  background: #fff;
  color: #0d6efd;
  line-height: 1;
  cursor: pointer;
}

.rating-btn:hover {
  background: #e7f1ff;
}

.rating-btn.active {
  background: #0d6efd;
  color: #fff;
}

/* Sizes */
.rating-xs .rating-btn {
  padding: .1rem .35rem;
  font-size: .7rem;
  border-radius: .35rem;
}

.rating-sm .rating-btn {
  padding: .15rem .45rem;
  font-size: .8rem;
  border-radius: .4rem;
}

.rating-md .rating-btn {
  padding: .25rem .55rem;
  font-size: .9rem;
  border-radius: .45rem;
}
</style>
