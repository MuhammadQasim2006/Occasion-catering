<script setup>
// Shell for the post-booking / post-payment confirmation screen.
// Later polls GET /api/payments/:bookingId per the plan's payment flow note.
</script>

<template>
  <main class="view-shell">
    <h1>Confirmation</h1>
    <p>Booking &amp; payment confirmation details go here.</p>
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
