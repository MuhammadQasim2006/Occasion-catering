<script setup>
// Shell for the logged-in customer dashboard. Will read from the auth and
// bookings Pinia stores (TICKET-006) once real data lands.
</script>

<template>
  <main class="view-shell">
    <h1>Dashboard</h1>
    <p>Account overview and quick links go here.</p>
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
