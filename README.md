# Youth Mental Health & Wellbeing — A1.2 (FIT5032)

A small Vue 3 app that helps young people find support and self-help resources.
- Vue 3 basics (components, data binding)
- Events & simple routing
- HTML/JS form validation
- Styling with Bootstrap (responsive)

---

## How A1.2 requirements are met
- **BR-A (Vue + Responsive):** Vue 3 app, Bootstrap layout; verified on mobile & desktop.
- **BR-B.1 (Validations):** HomeView — required fields, email format, password rules (8+ with letters & numbers), confirm password; errors show on submit (not while typing).
- **BR-B.2 (Dynamic Data):** ResourcesView — Tip of the day (array), Resources list with search/filter (array), Helplines (array, tel: links), Checklist persisted in localStorage.

### BR-A: Vue + Responsive UI
- **Vue 3** app scaffold (Vite).
- **Responsive** layout using Bootstrap utility classes and grid.

### BR-B.1: At least two input validations
Implemented on **Sign In / Sign Up** (Home page):
- Required fields with clear messages (top message logic).
- Email format check (`@`).
- Password rules (min 8 chars + letters + numbers).
- Confirm password matches (Sign Up).
- Case-insensitive email handling.

### BR-B.2: Dynamic data from JavaScript
Implemented on **Resources** page:
- **Tip of the day** from a JS array.
- **Resources list** (cards) from a JS array with **search** and **type filter**.
- **Helplines** (tel: links) from a JS array.
- **Daily wellbeing checklist** stored/read from **localStorage**.

> Notes:  
> - Roles and role-protected routes are prepared but **not required** for A1.2.  
> - No advanced libraries or patterns used; only Vue, Vue Router, Bootstrap classes.

---

## Run locally

```bash
# 1) Install deps
npm install

# 2) Start dev server
npm run dev
# Open the URL shown (e.g. http://localhost:5173)
