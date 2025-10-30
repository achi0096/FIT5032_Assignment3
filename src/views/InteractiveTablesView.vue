<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue';
import DataTable from 'datatables.net-bs5';

const usersTableEl = ref(null);
const resourcesTableEl = ref(null);

let usersDT = null;
let resourcesDT = null;

async function loadJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  return await res.json();
}

function addColumnSearchInputs(tableEl) {
  // Add a text input to each footer cell for per-column search
  const tfoot = tableEl.querySelector('tfoot');
  const headers = tableEl.querySelectorAll('thead th');
  if (!tfoot) {
    const newTfoot = document.createElement('tfoot');
    const tr = document.createElement('tr');
    headers.forEach((h) => {
      const th = document.createElement('th');
      const inp = document.createElement('input');
      inp.type = 'text';
      inp.className = 'form-control form-control-sm';
      inp.placeholder = 'Search...';
      inp.setAttribute('aria-label', `Search ${h.textContent?.trim() || 'column'}`); // a11y
      th.appendChild(inp);
      tr.appendChild(th);
    });
    newTfoot.appendChild(tr);
    tableEl.appendChild(newTfoot);
  }
}

onMounted(async () => {
  // Prepare per-column search rows before init
  addColumnSearchInputs(usersTableEl.value);
  addColumnSearchInputs(resourcesTableEl.value);

  // Load mocked data
  const [users, resources] = await Promise.all([
    loadJSON('/data/users.json'),
    loadJSON('/data/resources.json'),
  ]);

  // USERS TABLE
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
    paging: true,
    pageLength: 10,
    searching: true,
    ordering: true,
    lengthChange: false
  });

  // Announce page range politely
  usersDT.on('draw', function () {
    const info = usersDT.page.info();
    const el = document.getElementById('users-status');
    if (el) el.textContent = `Showing ${info.start + 1}–${info.end} of ${info.recordsDisplay} users`;
  });

  // RESOURCES TABLE
  resourcesDT = new DataTable(resourcesTableEl.value, {
    data: resources,
    columns: [
      { title: 'ID', data: 'id', className: 'dt-head-left dt-body-left' },
      { title: 'Title', data: 'title' },
      { title: 'Category', data: 'category' },
      { title: 'Rating', data: 'rating', className: 'dt-head-left dt-body-left' },
      { title: 'Updated', data: 'updated at' },
    ],
    paging: true,
    pageLength: 10,
    searching: true,
    ordering: true,
    lengthChange: false
  });

  resourcesDT.on('draw', function () {
    const info = resourcesDT.page.info();
    const el = document.getElementById('resources-status');
    if (el) el.textContent = `Showing ${info.start + 1}–${info.end} of ${info.recordsDisplay} resources`;
  });

  // Hook up per-column filtering (both tables)
  [usersDT, resourcesDT].forEach((dt, idx) => {
    const tableEl = idx === 0 ? usersTableEl.value : resourcesTableEl.value;
    dt.columns().every(function () {
      const column = this;
      const input = tableEl.querySelectorAll('tfoot input')[column.index()];
      input.addEventListener('keyup', () => column.search(input.value).draw());
      input.addEventListener('change', () => column.search(input.value).draw());
    });
  });
});

onBeforeUnmount(() => {
  if (usersDT) usersDT.destroy();
  if (resourcesDT) resourcesDT.destroy();
});
</script>

<template>
  <div class="container py-4">
    <h1 class="h4 mb-3">Interactive Tables</h1>

    <!-- Users Table -->
    <div class="card mb-4">
      <div class="card-body">
        <h2 class="h6 mb-3">Users</h2>
        <table ref="usersTableEl" class="table table-striped table-bordered w-100">
          <caption class="text-start">Users</caption>
          <thead>
            <tr>
              <th scope="col">ID</th><th scope="col">Name</th><th scope="col">Email</th>
              <th scope="col">Role</th><th scope="col">Status</th><th scope="col">Created</th>
            </tr>
          </thead>
          <!-- tfoot with inputs is added by script -->
        </table>
        <div id="users-status" class="visually-hidden" aria-live="polite"></div>
      </div>
    </div>

    <!-- Resources Table -->
    <div class="card">
      <div class="card-body">
        <h2 class="h6 mb-3">Resources</h2>
        <table ref="resourcesTableEl" class="table table-striped table-bordered w-100">
          <caption class="text-start">Resources</caption>
          <thead>
            <tr>
              <th scope="col">ID</th><th scope="col">Title</th><th scope="col">Category</th>
              <th scope="col">Rating</th><th scope="col">Updated</th>
            </tr>
          </thead>
        </table>
        <div id="resources-status" class="visually-hidden" aria-live="polite"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
tfoot input { width: 100%; }
</style>
