<template>
  <div class="container my-4">
    <h2 class="mb-2">Student Area</h2>

    <p v-if="displayName" class="text-muted">
      Hi, {{ displayName }}. This page is only for students.
    </p>
    <p v-else class="text-muted">
      Loading user info...
    </p>

    <div class="card mt-3">
      <div class="card-body">
        <h5 class="card-title">Quick links</h5>
        <ul class="mb-0">
          <li><router-link to="/resources">Browse resources</router-link></li>
          <li><a href="#" @click.prevent="$router.back()">Go back</a></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { auth, db } from "@/firebase/init";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default {
  name: "StudentView",
  data() {
    return {
      displayName: "",
    };
  },
  async created() {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        this.displayName = "Guest";
        return;
      }

      // Try to read user's display name from Auth
      let name = user.displayName || user.email || "Student";

      // Try to read name from Firestore users/{uid} (if stored there)
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
          const data = snap.data();
          name = data.displayName || data.name || name;
        }
      } catch (e) {
        console.warn("Could not load Firestore user:", e.message);
      }

      this.displayName = name;
    });
  },
};
</script>
