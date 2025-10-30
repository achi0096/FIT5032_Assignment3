<template>
  <div class="container py-3">
    <h3>Map Debug</h3>
    <pre>{{ info }}</pre>
  </div>
</template>

<script setup>
const info = {
  tokenPresent: !!import.meta.env.VITE_MAPBOX_TOKEN,
  tokenStart: (import.meta.env.VITE_MAPBOX_TOKEN || '').slice(0,8),
  ts: new Date().toISOString()
}
console.log('[MapDebug]', info)
</script>
