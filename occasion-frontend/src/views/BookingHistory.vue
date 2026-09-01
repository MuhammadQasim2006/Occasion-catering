<script setup>
// Shell for GET /api/bookings (logged-in customer's bookings).
// Will read from the bookings Pinia store (TICKET-006) once real data lands.
</script>

<template>
  <main class="view-shell">
    <h1>Booking History</h1>
    <p>Past and upcoming bookings go here.</p>
  </main>
</template>

<style scoped>
.view-shell {
  max-width: var(--content-width);
  margin: 0 auto;
  padding: 5rem 1.5rem;
}

.view-shell p {
  color: var(--color-muted);
  margin-top: 0.5rem;
}
</style>
