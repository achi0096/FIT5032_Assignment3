<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue';
// DataTables 
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
    headers.forEach(() => {
      const th = document.createElement('th');
      th.innerHTML = '<input type="text" class="form-control form-control-sm" placeholder="Search..." />';
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
    pageLength: 10,     // <= limit to 10 rows per page
    searching: true,    // global search box
    ordering: true,     // column sort
    lengthChange: false 
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

  // Hook up per-column filtering (both tables)
  [usersDT, resourcesDT].forEach((dt, idx) => {
    const tableEl = idx === 0 ? usersTableEl.value : resourcesTableEl.value;
    dt.columns().every(function () {
      const column = this;
      // Find the input in the corresponding footer cell (same index)
      const input = tableEl.querySelectorAll('tfoot input')[column.index()];
      input.addEventListener('keyup', () => {
        column.search(input.value).draw();
      });
      input.addEventListener('change', () => {
        column.search(input.value).draw();
      });
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
          <thead>
            <tr>
              <th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Created</th>
            </tr>
          </thead>         
        </table>
      </div>
    </div>

    <!-- Resources Table -->
    <div class="card">
      <div class="card-body">
        <h2 class="h6 mb-3">Resources</h2>
        <table ref="resourcesTableEl" class="table table-striped table-bordered w-100">
          <thead>
            <tr>
              <th>ID</th><th>Title</th><th>Category</th><th>Rating</th><th>Updated</th>
            </tr>
          </thead>        
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Keep the footer inputs compact */
tfoot input {
  width: 100%;
}
</style>
