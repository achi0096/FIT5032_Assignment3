<script setup>
import { computed } from 'vue'
import { useRatings } from '../composables/useRatings'
import { useAuth } from '../composables/useAuth'


const props = defineProps({ resourceId: { type: String, required: true } })
const { currentUser, isAuthenticated } = useAuth()
const { getStats, setUserRating, getUserRating } = useRatings()


const stats = computed(() => getStats(props.resourceId))
const my = computed(() => currentUser.value ? getUserRating(props.resourceId, currentUser.value.id) : 0)


function rate(n) {
      if (!isAuthenticated.value) return
      setUserRating(props.resourceId, currentUser.value.id, n)
}
</script>


<template>
      <div class="d-flex align-items-center gap-2">
            <div>
                  <button v-for="n in 5" :key="n" type="button" class="btn btn-sm"
                        :class="n <= my ? 'btn-warning' : 'btn-outline-secondary'" @click="rate(n)"
                        :aria-label="`Rate ${n} star`">
                        ★
                  </button>
            </div>
            <div class="small text-muted">{{ stats.avg }} ({{ stats.count }})</div>
      </div>
      <div v-if="!isAuthenticated" class="small text-muted">Sign in to rate</div>
</template>