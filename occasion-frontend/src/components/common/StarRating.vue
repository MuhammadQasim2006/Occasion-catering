<script setup>
defineProps({
  rating: { type: Number, required: true },
  reviewCount: { type: Number, default: null },
  size: { type: String, default: 'sm' }, // 'sm' | 'md'
})
</script>

<template>
  <span class="star-rating" :class="`star-rating--${size}`">
    <span class="star-rating__stars" aria-hidden="true">
      <svg
        v-for="n in 5"
        :key="n"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        :fill="n <= Math.round(rating) ? 'var(--color-gold)' : 'var(--color-line)'"
      >
        <path
          d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6-5.9-3.3-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8Z"
        />
      </svg>
    </span>
    <span class="star-rating__label">
      {{ rating.toFixed(1) }}<template v-if="reviewCount"> ({{ reviewCount }})</template>
    </span>
  </span>
</template>

<style scoped>
.star-rating {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.star-rating__stars {
  display: inline-flex;
  gap: 0.1rem;
}

.star-rating__label {
  font-size: 0.78rem;
  color: var(--color-muted);
  font-weight: 500;
}

.star-rating--md .star-rating__label {
  font-size: 0.85rem;
}
</style>
