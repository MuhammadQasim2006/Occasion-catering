<script setup>
import { RouterLink } from 'vue-router'
import { useCartStore } from '@/stores/cart'

const props = defineProps({
  pkg: {
    type: Object,
    required: true,
  },
})

const cart = useCartStore()

function handleViewPackage() {
  cart.addItem(props.pkg)
}
</script>

<template>
  <article class="package-card">
    <div class="package-card__image-wrap">
      <img :src="pkg.image" :alt="pkg.name" class="package-card__image" loading="lazy" />
      <span v-if="pkg.badge" class="package-card__badge">{{ pkg.badge }}</span>
    </div>
    <div class="package-card__body">
      <h3 class="package-card__name">{{ pkg.name }}</h3>
      <p class="package-card__price">From R{{ pkg.fromPrice }} / person</p>
      <p v-if="pkg.description" class="package-card__description">{{ pkg.description }}</p>
      <ul class="package-card__meta">
        <li>{{ pkg.guests }}</li>
        <li>{{ pkg.courses }}</li>
        <li class="package-card__feature">{{ pkg.feature }}</li>
      </ul>
      <RouterLink
        :to="`/packages/${pkg.id}`"
        class="package-card__cta"
        @click="handleViewPackage"
      >
        View Package
      </RouterLink>
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
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.package-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 24px rgba(43, 29, 18, 0.14);
}

.package-card__image-wrap {
  position: relative;
  overflow: hidden;
}

.package-card__image {
  width: 100%;
  height: 160px;
  object-fit: cover;
  transition: transform 0.35s ease;
}

.package-card:hover .package-card__image {
  transform: scale(1.05);
}

.package-card__badge {
  position: absolute;
  top: 0.7rem;
  left: 0.7rem;
  background: var(--color-gold);
  color: var(--color-brown-deep);
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.25rem 0.6rem;
  border-radius: var(--radius-full);
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
  margin-bottom: 0.5rem;
}

.package-card__description {
  font-size: 0.83rem;
  color: var(--color-muted);
  margin-bottom: 0.75rem;
  line-height: 1.45;
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
