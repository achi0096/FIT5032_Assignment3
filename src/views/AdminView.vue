<template>
  <div class="container my-4">
    <h2 class="mb-2">Admin Area</h2>

    <p v-if="displayName" class="text-muted">
      Hi, {{ displayName }}. This page is only for Admins.
    </p>
    <p v-else class="text-muted">Loading user info...</p>

    <div class="card mt-3">
      <div class="card-body">
        <h5 class="card-title">Quick links</h5>
        <ul class="mb-0">
          <li><router-link :to="{ name: 'AdminDashboardView' }">Admin Dashboard</router-link></li>
          <li><router-link to="/resources">Browse resources</router-link></li>
          <li><a href="#" @click.prevent="$router.back()">Go back</a></li>
          
          <!-- Bulk Email link visible only for admins -->
          <li v-if="userRole === 'admin'">
            <router-link to="/bulk-email">Bulk Email Management</router-link>
          </li>
          <li v-if="userRole === 'admin'">
            <router-link to="/charts">Charts</router-link>
          </li>
        </ul>
      </div>
    </div>

    <!-- Dashboard (child route) renders here -->
    <div class="mt-4">
      <router-view />
    </div>
  </div>
</template>

<script>
import { auth, db } from "@/firebase/init";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default {
  name: "AdminView",
  data() {
    return {
      displayName: "",
      userRole: null,
    };
  },
  async created() {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        this.displayName = "Guest";
        this.userRole = null;
        return;
      }

      let name = user.displayName || user.email || "Admin";
      try {        
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
          const data = snap.data();
          name = data.displayName || data.name || name;
          this.userRole = (data.role || "").toLowerCase();
        }
      } catch (e) {
        console.warn("Could not load Firestore user:", e.message);
      }

      this.displayName = name;
    });
  },
};
</script>
