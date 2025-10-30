<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import DataTable from 'datatables.net-bs5'
import Buttons from 'datatables.net-buttons-bs5'
import 'datatables.net-buttons/js/buttons.html5.mjs'
import 'datatables.net-buttons/js/buttons.print.mjs'

// File generators
import JSZip from 'jszip'
import pdfMake from 'pdfmake/build/pdfmake.js'
import pdfFonts from 'pdfmake/build/vfs_fonts.js'


window.JSZip = JSZip
pdfMake.vfs = pdfFonts.vfs
window.pdfMake = pdfMake

// Enable Buttons plugin
DataTable.use(Buttons)

const usersTableEl = ref(null)
const resourcesTableEl = ref(null)

let usersDT = null
let resourcesDT = null

async function loadJSON(path) {
  const res = await fetch(path)
  if (!res.ok) throw new Error(`Failed to load ${path}`)
  return await res.json()
}

function addColumnSearchInputs(tableEl) {
  const tfoot = tableEl.querySelector('tfoot')
  const headers = tableEl.querySelectorAll('thead th')
  if (!tfoot) {
    const newTfoot = document.createElement('tfoot')
    const tr = document.createElement('tr')
    headers.forEach((h) => {
      const th = document.createElement('th')
      const inp = document.createElement('input')
      inp.type = 'text'
      inp.className = 'form-control form-control-sm'
      inp.placeholder = 'Search...'
      inp.setAttribute('aria-label', `Search ${h.textContent?.trim() || 'column'}`)
      th.appendChild(inp)
      tr.appendChild(th)
    })
    newTfoot.appendChild(tr)
    tableEl.appendChild(newTfoot)
  }
}

onMounted(async () => {
  addColumnSearchInputs(usersTableEl.value)
  addColumnSearchInputs(resourcesTableEl.value)

  // Load data
  const [users, resources] = await Promise.all([
    loadJSON('/data/users.json'),
    loadJSON('/data/resources.json'),
  ])

  // ===== USERS TABLE =====
  usersDT = new DataTable(usersTableEl.value, {
    data: users,
    columns: [
      { title: 'ID', data: 'id', className: 'dt-head-left dt-body-left' },
      { title: 'Name', data: 'name' },
      { title: 'Email', data: 'email' },
      { title: 'Role', data: 'role' },
      { title: 'Status', data: 'status' },
      { title: 'Created', data: 'created at' },
    ],
    dom: 'Bfrtip',
    buttons: [
      {
        extend: 'csv',
        text: 'Export CSV',
        className: 'btn btn-outline-secondary btn-sm',
        title: 'Users Data',
        filename: 'users_data',
        exportOptions: { columns: ':visible' }
      },
      {
        extend: 'pdf',
        text: 'Export PDF',
        className: 'btn btn-outline-secondary btn-sm',
        title: 'Users Data',
        filename: 'users_data',
        exportOptions: { columns: ':visible' }
      },
      {
        extend: 'print',
        text: 'Print',
        className: 'btn btn-outline-secondary btn-sm',
        title: 'Users Table'
      }
    ],
    paging: true,
    pageLength: 10,
    searching: true,
    ordering: true,
    lengthChange: false
  })

  usersDT.on('draw', () => {
    const info = usersDT.page.info()
    const el = document.getElementById('users-status')
    if (el) el.textContent = `Showing ${info.start + 1}–${info.end} of ${info.recordsDisplay} users`
  })

  // ===== RESOURCES TABLE =====
  resourcesDT = new DataTable(resourcesTableEl.value, {
    data: resources,
    columns: [
      { title: 'ID', data: 'id', className: 'dt-head-left dt-body-left' },
      { title: 'Title', data: 'title' },
      { title: 'Category', data: 'category' },
      { title: 'Rating', data: 'rating', className: 'dt-head-left dt-body-left' },
      { title: 'Updated', data: 'updated at' },
    ],
    dom: 'Bfrtip',
    buttons: [
      {
        extend: 'csv',
        text: 'Export CSV',
        className: 'btn btn-outline-secondary btn-sm',
        title: 'Resources Data',
        filename: 'resources_data',
        exportOptions: { columns: ':visible' }
      },
      {
        extend: 'pdf',
        text: 'Export PDF',
        className: 'btn btn-outline-secondary btn-sm',
        title: 'Resources Data',
        filename: 'resources_data',
        exportOptions: { columns: ':visible' }
      },
      {
        extend: 'print',
        text: 'Print',
        className: 'btn btn-outline-secondary btn-sm',
        title: 'Resources Table'
      }
    ],

    paging: true,
    pageLength: 10,
    searching: true,
    ordering: true,
    lengthChange: false
  })

  resourcesDT.on('draw', () => {
    const info = resourcesDT.page.info()
    const el = document.getElementById('resources-status')
    if (el) el.textContent = `Showing ${info.start + 1}–${info.end} of ${info.recordsDisplay} resources`
  })

    ;[usersDT, resourcesDT].forEach((dt, idx) => {
      const tableEl = idx === 0 ? usersTableEl.value : resourcesTableEl.value
      dt.columns().every(function () {
        const column = this
        const input = tableEl.querySelectorAll('tfoot input')[column.index()]
        input.addEventListener('keyup', () => column.search(input.value).draw())
        input.addEventListener('change', () => column.search(input.value).draw())
      })
    })
})

onBeforeUnmount(() => {
  if (usersDT) usersDT.destroy()
  if (resourcesDT) resourcesDT.destroy()
})
</script>

<template>
  <div class="container py-4">
    <h1 class="h4 mb-3">Interactive Tables</h1>

    <!-- Users Table -->
    <div class="card mb-4">
      <div class="card-body">
        <h2 class="h6 mb-3">Users</h2>
        <table ref="usersTableEl" class="table table-striped table-bordered w-100">
          <caption class="text-start"></caption>
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Role</th>
              <th scope="col">Status</th>
              <th scope="col">Created</th>
            </tr>
          </thead>
        </table>
        <div id="users-status" class="visually-hidden" aria-live="polite"></div>
      </div>
    </div>

    <!-- Resources Table -->
    <div class="card">
      <div class="card-body">
        <h2 class="h6 mb-3">Resources</h2>
        <table ref="resourcesTableEl" class="table table-striped table-bordered w-100">
          <caption class="text-start"></caption>
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Title</th>
              <th scope="col">Category</th>
              <th scope="col">Rating</th>
              <th scope="col">Updated</th>
            </tr>
          </thead>
        </table>
        <div id="resources-status" class="visually-hidden" aria-live="polite"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
tfoot input {
  width: 100%;
}
</style>

<style scoped>
tfoot input {
  width: 100%;
}

::v-deep(div.dt-buttons .dt-button),
::v-deep(div.dt-buttons .btn) {
  display: inline-flex;
  align-items: center;
  gap: .25rem;
  background-color: #b5aaaad2;
  color: #191b1d;
  border: 1px solid #b5aaaad2;
  border-radius: .25rem;
  padding: .25rem .6rem;
  font-size: .875rem;
  line-height: 1.2;
  margin-right: .25rem;
  margin-bottom: .25rem;
}

::v-deep(div.dt-buttons .dt-button:hover),
::v-deep(div.dt-buttons .btn:hover) {
  background-color: #0d6efd;
  color: #fff;
  border-color: #0d6efd;
}
</style>
