<script setup>
import { useAuth } from '../composables/useAuth'
const { loadUsers } = useAuth()
const users = loadUsers()
</script>


<template>
      <section class="mx-auto" style="max-width: 860px;">
            <h2 class="h4 mb-3">Admin Panel</h2>
            <p class="text-muted">Only counsellors can access this page.</p>
            <div class="table-responsive">
                  <table class="table">
                        <thead>
                              <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Joined</th>
                              </tr>
                        </thead>
                        <tbody>
                              <tr v-for="u in users" :key="u.id">
                                    <td>{{ u.name }}</td>
                                    <td>{{ u.email }}</td>
                                    <td><span class="badge"
                                                :class="u.role === 'counsellor' ? 'bg-primary' : 'bg-secondary'">{{ u.role
                                                }}</span></td>
                                    <td>{{ new Date(u.createdAt).toLocaleDateString() }}</td>
                              </tr>
                        </tbody>
                  </table>
            </div>
      </section>
</template>