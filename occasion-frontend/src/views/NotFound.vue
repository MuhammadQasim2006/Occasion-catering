<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <main id="main-content" class="not-found">
    <p class="not-found__eyebrow">404</p>
    <h1 class="not-found__title">We couldn't find that page</h1>
    <p class="not-found__subtitle">
      The link may be broken, or the page may have moved. Let's get you back on track.
    </p>
    <div class="not-found__actions">
      <RouterLink to="/" class="not-found__primary">Back to Home</RouterLink>
      <RouterLink to="/packages" class="not-found__secondary">Browse Packages</RouterLink>
    </div>
  </main>
</template>

<style scoped>
.not-found {
  max-width: 32rem;
  margin: 0 auto;
  padding: 6rem 1.5rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.not-found__eyebrow {
  font-family: var(--font-display);
  font-size: 3.5rem;
  font-weight: 700;
  color: var(--color-gold);
  line-height: 1;
}

.not-found__title {
  font-size: 1.6rem;
  margin-top: 0.5rem;
}

.not-found__subtitle {
  color: var(--color-muted);
  margin-top: 0.25rem;
}

.not-found__actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.75rem;
  flex-wrap: wrap;
  justify-content: center;
}

.not-found__primary {
  background: var(--color-gold);
  color: var(--color-brown-deep);
  font-weight: 700;
  border-radius: var(--radius-full);
  padding: 0.75rem 1.5rem;
}

.not-found__secondary {
  border: 1px solid var(--color-line);
  border-radius: var(--radius-full);
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  color: var(--color-brown);
}

.not-found__secondary:hover {
  border-color: var(--color-gold);
  color: var(--color-gold);
}
</style>
