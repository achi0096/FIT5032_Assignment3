<template>
  <section class="container py-3">
    <h1 class="h4 mb-4">Admin Dashboard</h1>

    <!-- Summary Cards -->
    <div class="row g-3 mb-4">
      <div class="col-md-3" v-for="card in cards" :key="card.label">
        <div class="card shadow-sm h-100">
          <div class="card-body text-center">
            <div class="text-muted small">{{ card.label }}</div>
            <div class="display-6 fw-bold text-success">{{ card.value }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Users -->
    <div class="card shadow-sm">
      <div class="card-body">
        <h5 class="card-title mb-3">Recent Users</h5>
        <div class="table-responsive">
          <table class="table table-sm table-striped align-middle">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!recent.length">
                <td colspan="3" class="text-muted">No users found or no access.</td>
              </tr>
              <tr v-for="u in recent" :key="u.id">
                <td>{{ u.name }}</td>
                <td>{{ u.email }}</td>
                <td><span class="badge text-bg-secondary">{{ u.role }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { db } from "@/firebase/init";
import {
  collection,
  getDocs,
  getCountFromServer,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";

// 🔧 Change to "profiles" if your collection is named that
const COLLECTION = "users";

const total = ref(0);
const student = ref(0);
const teacher = ref(0);
const admin = ref(0);
const recent = ref([]);

const cards = computed(() => [
  { label: "Total Users", value: total.value },
  { label: "Students", value: student.value },
  { label: "Teacher", value: teacher.value },
  { label: "Admins", value: admin.value },
]);

// ✅ Helper function to choose a nice display name
function formatName(data) {
  const possible =
    data.name ||
    data.displayName ||
    data.fullName ||
    data.firstName ||
    "";
  if (possible) return possible;
  const email = data.email || "";
  const local = email.split("@")[0];
  return local.charAt(0).toUpperCase() + local.slice(1);
}

async function loadCounts() {
  try {
    const col = collection(db, COLLECTION);
    total.value = (await getCountFromServer(col)).data().count;
    student.value = (await getCountFromServer(query(col, where("role", "==", "student")))).data().count;
    teacher.value = (await getCountFromServer(query(col, where("role", "==", "teacher")))).data().count;
    admin.value = (await getCountFromServer(query(col, where("role", "==", "admin")))).data().count;
  } catch (e) {
    console.warn("Count error:", e.message);
  }
}

async function loadRecent() {
  try {
    const q = query(collection(db, COLLECTION), orderBy("createdAt", "desc"), limit(5));
    const snap = await getDocs(q);
    recent.value = snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        name: formatName(data),
        email: data.email || "(no email)",
        role: data.role || "unknown",
      };
    });
  } catch {
    const snap = await getDocs(query(collection(db, COLLECTION), limit(5)));
    recent.value = snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        name: formatName(data),
        email: data.email || "(no email)",
        role: data.role || "unknown",
      };
    });
  }
}

onMounted(async () => {
  await loadCounts();
  await loadRecent();
});
</script>

<style scoped>
.display-6 {
  font-weight: 700;
}
</style>
