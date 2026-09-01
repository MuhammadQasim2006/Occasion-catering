<script setup>
// Shell for POST /api/auth/register (see API contract, TICKET-001).
// Will call the auth Pinia store's login()-style flow once wired (TICKET-006).
</script>

<template>
  <main class="view-shell">
    <h1>Sign Up</h1>
    <p>Registration form goes here.</p>
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
