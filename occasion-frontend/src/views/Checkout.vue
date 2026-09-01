<script setup>
// Shell for the checkout/booking flow — guest count, date picker, summary,
// then POST /api/bookings. Payment (PayFast redirect) is a later, separate
// step per the plan's Section 3.1 (payment is the last swap, not the first).
</script>

<template>
  <main class="view-shell">
    <h1>Checkout</h1>
    <p>Guest count, date selection, and booking summary go here.</p>
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
