<template>
  <section class="mx-auto" style="max-width: 860px;">
    <h2 class="h4 mb-3">Resources</h2>

    <div class="mb-3">
      <label for="q" class="form-label">Search</label>
      <input id="q" v-model="query" type="search" class="form-control" placeholder="Search by title or type">
    </div>

    <div class="row g-3">
      <div class="col-12" v-for="item in filtered" :key="item.id">
        <div class="card">
          <div class="card-body">
            <h3 class="h5 mb-1">{{ item.title }}</h3>
            <span class="badge bg-secondary me-2">{{ item.type }}</span>
            <p class="mb-0">{{ item.summary }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'ResourcesView',
  data() {
    return {
      query: '',
      // “fetch” dynamic data from a plain JS array
      resources: [
        { id: 1, title: 'Mindfulness Basics', type: 'Self-help', summary: 'Short practice to reduce stress.' },
        { id: 2, title: 'Sleep Hygiene Tips', type: 'Wellbeing', summary: 'Habits to help you sleep better.' },
        { id: 3, title: 'Local Youth Centre', type: 'Support', summary: 'Activities and meeting peers.' }
      ]
    }
  },
  computed: {
    filtered() {
      const s = this.query.toLowerCase()
      if (!s) return this.resources
      return this.resources.filter(r =>
        r.title.toLowerCase().includes(s) || r.type.toLowerCase().includes(s)
      )
    }
  }
}
</script>
