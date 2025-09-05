<template>
  <div class="container my-4">
    <h2 class="mb-2">About this program</h2>
    <p class="text-muted">A short description about Youth Mental Health & Wellbeing.</p>

    <!-- Drop in the rating widget -->
    <RatingWidget item-id="program:youth" size="md" />
  </div>
</template>

<script setup>
import RatingWidget from '../components/RatingWidget.vue'
</script>
