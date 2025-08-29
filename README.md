# Youth Mental Health & Wellbeing – FIT5032 A1.2


## How to run
npm install 
npm run dev


## Where each requirement is met
- Vue 3 + Router: src/main.js, src/router/index.js
- Responsive: Bootstrap 5, screenshots at 360px / 768px / 1200px / 1440px
- Validations (≥2): HomeView (required + email format + password strength)
- Dynamic data: src/data/resources.js + ResourcesView.vue (search + render)
- Authentication: src/composables/useAuth.js + HomeView.vue
- Role-based auth (member/counsellor): router meta+guard; AdminView.vue; conditional nav
- Aggregated rating: src/composables/useRatings.js + components/RatingStars.vue
- Security: sanitize.js, avoid v-html, CSP meta, no eval, length limits


## Notes
- LocalStorage used for demo only. No real backend.