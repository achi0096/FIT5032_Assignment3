<template>
  <section class="px-3 px-sm-0">
    <!-- Greeting -->
    <p class="text-muted mb-1" v-if="currentUserName">
      Welcome, <strong>{{ currentUserName }}</strong>
    </p>
    
    <h2 class="h4">Resources</h2>

    <!-- Tip of the Day -->
    <div class="alert alert-info small d-flex align-items-center gap-2" role="status">
      <span class="fw-bold">Tip of the day:</span>
      <span>{{ featuredTip.text }}</span>
      <span class="ms-auto text-muted">({{ featuredTip.source }})</span>
    </div>

    <!-- Search + Filter -->
    <div class="row g-2 align-items-end mb-3">
      <div class="col-sm-8">
        <label for="search" class="form-label">Search</label>
        <input
          id="search"
          class="form-control"
          type="text"
          placeholder="Search by title, type, or summary"
          v-model="searchText"
        />
      </div>
      <div class="col-sm-4">
        <label for="typeSel" class="form-label">Filter by type</label>
        <select id="typeSel" class="form-select" v-model="typeFilter">
          <option value="">All</option>
          <option value="Self-help">Self-help</option>
          <option value="Wellbeing">Wellbeing</option>
          <option value="Support">Support</option>
        </select>
      </div>
    </div>

    <!-- Guides / Articles --->
    <div v-for="item in filteredList" :key="item.id" class="card mb-3">
      <div class="card-body">
        <div class="d-flex justify-content-between">
          <h5 class="card-title mb-1">{{ item.title }}</h5>
          <span class="badge bg-secondary align-self-start">{{ item.type }}</span>
        </div>
        <p class="mb-2">{{ item.summary }}</p>
        <div class="d-flex align-items-center justify-content-between mt-2">
          <div class="text-muted small">Read time: {{ item.minutes }} mins</div>
          <RatingWidget :item-id="`resource:${item.id}`" size="xs" />
        </div>
      </div>
    </div>
    <p v-if="filteredList.length === 0" class="text-muted">No results.</p>

    <!-- Quick Help (helplines) -->
    <div class="card mt-4">
      <div class="card-header fw-bold">Quick help (24/7 services)</div>
      <ul class="list-group list-group-flush">
        <li
          v-for="(h, i) in helplines"
          :key="i"
          class="list-group-item d-flex justify-content-between align-items-start"
        >
          <div>
            <div class="fw-semibold">{{ h.name }}</div>
            <div class="small text-muted">{{ h.hours }}</div>
          </div>          
          <a
            :href="'tel:' + h.phone"
            class="btn btn-sm btn-success phone-btn"
            :aria-label="`Call ${h.name} at ${h.phone}`"
          >
            {{ h.phone }}
          </a>
        </li>
      </ul>
    </div>

    <!-- Wellbeing Checklist (simple localStorage) -->
    <div class="card mt-4">
      <div class="card-header fw-bold">Daily wellbeing checklist</div>
      <div class="card-body">
        <p class="small text-muted mb-2">
          Small actions can help. Tick items as you complete them today.
        </p>
        <ul class="list-unstyled mb-2">
          <li v-for="(c, i) in checklist" :key="i" class="form-check mb-2">
            <input
              class="form-check-input"
              type="checkbox"
              :id="'c' + i"
              v-model="c.done"
              @change="saveChecklist"
            />
            <label class="form-check-label" :for="'c' + i">{{ c.text }}</label>
          </li>
        </ul>        
        <div class="small text-muted mb-2" aria-live="polite">
          Progress: {{ doneCount }} / {{ checklist.length }}
        </div>
        <button class="btn btn-outline-secondary btn-sm" @click="resetChecklist">Reset</button>
      </div>
    </div>
  </section>
</template>

<script>
import RatingWidget from '../components/RatingWidget.vue'
export default {
  name: 'ResourcesView',
  components: { RatingWidget },
  data() {
    return {
      currentUserName: '',
      searchText: '',
      typeFilter: '',
      resources: [
        { id: 1, title: 'Mindfulness Basics', type: 'Self-help', minutes: 5, summary: 'A short breathing practice to reduce stress and calm your body.' },
        { id: 2, title: 'Sleep Hygiene Tips', type: 'Wellbeing', minutes: 6, summary: 'Evening routines that help you fall asleep faster and wake up rested.' },
        { id: 3, title: 'Local Youth Centre',  type: 'Support',   minutes: 2, summary: 'Find activities and peer support groups in your local area.' },
        { id: 4, title: 'Study Stress Plan',   type: 'Self-help', minutes: 4, summary: 'A quick plan for handling assignment pressure without burnout.' },
        { id: 5, title: 'Move Your Mood',      type: 'Wellbeing', minutes: 3, summary: 'Light movement ideas to lift energy when you feel flat.' }
      ],
      tips: [
        { text: 'Take 5 slow breaths: in through the nose, out through the mouth.', source: 'Mindful Breathing' },
        { text: 'Step outside for 2 minutes of daylight and stretch your shoulders.', source: 'Wellbeing Basics' },
        { text: 'Write down one worry, then one small action you can take today.', source: 'Coping with Stress' },
        { text: 'Drink a glass of water and have a small snack if you skipped a meal.', source: 'Self-care' },
        { text: 'Message a friend or family member and say hello.', source: 'Social Support' }
      ],
      helplines: [
        { name: 'Lifeline (24/7)',   phone: '131114',     hours: 'Anytime' },
        { name: 'Kids Helpline',     phone: '1800551800', hours: '24/7 • 5–25 yrs' },
        { name: 'Beyond Blue',       phone: '1300224636', hours: '24/7' }
      ],
      checklist: [
        { text: 'Had water and a snack/meal', done: false },
        { text: 'Moved my body for 2-5 minutes', done: false },
        { text: 'Messaged or spoke to someone I trust', done: false },
        { text: 'Took 5 slow breaths', done: false }
      ]
    }
  },
  computed: {
    featuredTip() {
      const i = new Date().getDate() % this.tips.length
      return this.tips[i]
    },
    filteredList() {
      const q = (this.searchText || '').toLowerCase()
      return this.resources.filter(r => {
        const matchType = this.typeFilter ? r.type === this.typeFilter : true
        const inText =
          r.title.toLowerCase().includes(q) ||
          r.type.toLowerCase().includes(q) ||
          r.summary.toLowerCase().includes(q)
        return matchType && inText
      })
    },
    doneCount() {
      return this.checklist.filter(c => c.done).length
    }
  },
  created() {
    // greet current user
    try {
      const u = JSON.parse(localStorage.getItem('ymhw_current_user') || '{}')
      this.currentUserName = u.name || u.email || ''
    } catch (_) { this.currentUserName = '' }
 
    try {
      const saved = JSON.parse(localStorage.getItem('ymhw_checklist') || '[]')
      if (Array.isArray(saved) && saved.length === this.checklist.length) {
        this.checklist = saved
      }
    } catch (_) {}
  },
  methods: {
    saveChecklist() {
      localStorage.setItem('ymhw_checklist', JSON.stringify(this.checklist))
    },
    resetChecklist() {
      this.checklist.forEach(c => (c.done = false))
      this.saveChecklist()
    }
  }
}
</script>

<style scoped>
.phone-btn {
  min-height: 44px;
  display: inline-flex;
  align-items: center;
}
</style>
