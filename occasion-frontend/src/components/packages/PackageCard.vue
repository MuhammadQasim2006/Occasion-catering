<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  pkg: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <article class="package-card">
    <img :src="pkg.image" :alt="pkg.name" class="package-card__image" loading="lazy" />
    <div class="package-card__body">
      <h3 class="package-card__name">{{ pkg.name }}</h3>
      <p class="package-card__price">From R{{ pkg.fromPrice }} / person</p>
      <ul class="package-card__meta">
        <li>{{ pkg.guests }}</li>
        <li>{{ pkg.courses }}</li>
        <li class="package-card__feature">{{ pkg.feature }}</li>
      </ul>
      <RouterLink :to="`/packages/${pkg.id}`" class="package-card__cta">View Package</RouterLink>
    </div>
  </article>
</template>

<style scoped>
.package-card {
  background: var(--color-white);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-card);
  display: flex;
  flex-direction: column;
}

.package-card__image {
  width: 100%;
  height: 160px;
  object-fit: cover;
}

.package-card__body {
  padding: 1.1rem 1.1rem 1.25rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.package-card__name {
  font-size: 1.05rem;
  margin-bottom: 0.3rem;
}

.package-card__price {
  color: var(--color-gold);
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 0.7rem;
}

.package-card__meta {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.82rem;
  color: var(--color-muted);
  margin-bottom: 1rem;
}

.package-card__feature {
  color: var(--color-gold);
}

.package-card__cta {
  margin-top: auto;
  text-align: center;
  background: var(--color-brown-deep);
  color: var(--color-cream);
  border-radius: var(--radius-sm);
  padding: 0.7rem;
  font-size: 0.9rem;
  font-weight: 600;
}

.package-card__cta:hover {
  background: var(--color-brown);
}
</style>
