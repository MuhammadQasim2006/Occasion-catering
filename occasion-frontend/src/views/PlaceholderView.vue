<script setup>
defineProps({
  title: {
    type: String,
    default: 'Coming soon',
  },
})
</script>

<template>
  <main class="placeholder">
    <h1>{{ title }}</h1>
    <p>This page is being built next. Check back soon.</p>
  </main>
</template>

<style scoped>
.placeholder {
  max-width: var(--content-width);
  margin: 0 auto;
  padding: 5rem 1.5rem;
  text-align: center;
}

.placeholder h1 {
  font-size: 2rem;
  margin-bottom: 0.75rem;
}

.placeholder p {
  color: var(--color-muted);
}
</style>
