import { ref } from 'vue'
const LS_RATINGS = 'ymhw_ratings' // { [resourceId]: { sum, count, byUser: { userId: rating } } }

function loadAll() {
  try {
    return JSON.parse(localStorage.getItem(LS_RATINGS) || '{}')
  } catch {
    return {}
  }
}
function saveAll(map) {
  localStorage.setItem(LS_RATINGS, JSON.stringify(map))
}

export function useRatings() {
  const map = ref(loadAll())

  function getStats(resourceId) {
    const r = map.value[resourceId]
    if (!r || !r.count) return { avg: 0, count: 0 }
    return { avg: +(r.sum / r.count).toFixed(1), count: r.count }
  }

  function setUserRating(resourceId, userId, stars) {
    const m = map.value
    m[resourceId] ||= { sum: 0, count: 0, byUser: {} }
    const prev = m[resourceId].byUser[userId]
    if (prev) {
      m[resourceId].sum -= prev
    } else {
      m[resourceId].count += 1
    }
    m[resourceId].byUser[userId] = stars
    m[resourceId].sum += stars
    saveAll(m)
  }

  function getUserRating(resourceId, userId) {
    return map.value[resourceId]?.byUser?.[userId] || 0
  }

  return { getStats, setUserRating, getUserRating }
}
