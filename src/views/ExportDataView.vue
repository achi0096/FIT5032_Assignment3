<template>
  <section class="container py-3">
    <h1 class="h4 mb-3">Export demo (CSV / PDF)</h1>

    <div class="alert alert-info small" role="status">
      Use the Export buttons above the table to download CSV or PDF. (Meets BR E.4)
    </div>

    <table ref="tableRef" class="table table-striped table-bordered w-100" aria-describedby="export-help">
      <thead>
        <tr>
          <th scope="col">ID</th>
          <th scope="col">Name</th>
          <th scope="col">Email</th>
          <th scope="col">Role</th>
          <th scope="col">Joined</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.id">
          <td>{{ row.id }}</td>
          <td>{{ row.name }}</td>
          <td>{{ row.email }}</td>
          <td>{{ row.role }}</td>
          <td>{{ row.joined }}</td>
        </tr>
      </tbody>
    </table>

    <p id="export-help" class="visually-hidden">
      Table data can be exported using the CSV, PDF, or Print buttons.
    </p>
  </section>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'

// DataTables core + Bootstrap 5 styling
import DataTable from 'datatables.net-bs5'

// Buttons + file generators
import 'datatables.net-buttons-bs5'
import jszip from 'jszip'
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'

// Wire pdfMake fonts and JSZip (required by Buttons)
pdfMake.vfs = pdfFonts.pdfMake.vfs
window.JSZip = jszip

const tableRef = ref(null)
let dt = null

// demo data (you can replace with your real rows)
const rows = [
  { id: 1, name: 'Ayesha Khan', email: 'ayesha@example.com', role: 'Student', joined: '2025-08-01' },
  { id: 2, name: 'Mark Antony', email: 'mark@example.com', role: 'Volunteer', joined: '2025-08-05' },
  { id: 3, name: 'Olivia Wilson', email: 'olivia@example.com', role: 'Counsellor', joined: '2025-09-12' },
  { id: 4, name: 'Sarah Lee', email: 'sarah@example.com', role: 'Student', joined: '2025-09-20' },
  { id: 5, name: 'John Smith', email: 'john@example.com', role: 'Staff', joined: '2025-10-01' },
]

onMounted(() => {
  dt = new DataTable(tableRef.value, {
    // B = Buttons | f = filter | r = processing | t = table | i = info | p = pagination
    dom: 'Bfrtip',
    buttons: [
      { extend: 'csv', className: 'btn btn-outline-secondary btn-sm', text: 'Export CSV', titleAttr: 'Download CSV', exportOptions: { columns: ':visible' } },
      { extend: 'pdf', className: 'btn btn-outline-secondary btn-sm', text: 'Export PDF', titleAttr: 'Download PDF', exportOptions: { columns: ':visible' } },
      { extend: 'print', className: 'btn btn-outline-secondary btn-sm', text: 'Print', titleAttr: 'Print table', exportOptions: { columns: ':visible' } },
    ],
    paging: true,
    pageLength: 10,
    ordering: true,
    responsive: true,
  })
})

onBeforeUnmount(() => {
  if (dt) {
    dt.destroy()
    dt = null
  }
})
</script>
