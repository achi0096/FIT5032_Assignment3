<template>
  <button
    class="btn btn-outline-secondary btn-sm d-inline-flex align-items-center"
    @click="goBack"
    :title="tooltip"
  >
    ← Back
  </button>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'

const props = defineProps({
  // where to go if there’s no browser history to go back to
  fallback: { type: String, default: '/' },
  tooltip:  { type: String, default: 'Go to previous page' }
})

const router = useRouter()
const route  = useRoute()

function goBack () {
  // If there is a previous entry in the SPA history, go back.
  // Otherwise push to a safe fallback route.
  if (window.history?.state?.back || window.history.length > 1) {
    router.back()
  } else {
    // avoid pushing to the same current path
    const dest = props.fallback || '/'
    if (route.fullPath !== dest) router.push(dest)
  }
}
</script>
