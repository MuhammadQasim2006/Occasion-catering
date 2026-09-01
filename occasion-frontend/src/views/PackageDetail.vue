<script setup>
// Shell for GET /api/packages/:id (see API contract, TICKET-001).
// Route: /packages/:id — id available via useRoute().params.id once wired.
// Rushin's package detail Figma (TICKET-007) lands here next.
</script>

<template>
  <main class="view-shell">
    <h1>Package Detail</h1>
    <p>Package info, menu customisation, and "Add to Cart" go here.</p>
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
