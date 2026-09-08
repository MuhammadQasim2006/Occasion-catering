<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useWishlistStore } from '@/stores/wishlist'
import { pseudoRating } from '@/utils/rating'
import StarRating from '@/components/common/StarRating.vue'

const props = defineProps({
  pkg: {
    type: Object,
    required: true,
  },
})

const wishlist = useWishlistStore()
const isSaved = computed(() => wishlist.has(props.pkg.package_id))
const rating = computed(() => pseudoRating(props.pkg.package_id))

function toggleWishlist() {
  wishlist.toggle(props.pkg.package_id)
}
</script>

<template>
  <article class="package-card">
    <div class="package-card__image-wrap">
      <img :src="pkg.image_url" :alt="pkg.name" class="package-card__image" loading="lazy" />
      <span v-if="pkg.badge" class="package-card__badge">{{ pkg.badge }}</span>
      <button
        type="button"
        class="package-card__wishlist"
        :class="{ 'package-card__wishlist--active': isSaved }"
        :aria-pressed="isSaved"
        :aria-label="isSaved ? 'Remove from saved packages' : 'Save package for later'"
        @click="toggleWishlist"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" :fill="isSaved ? 'currentColor' : 'none'">
          <path
            d="M12 20.5s-7.5-4.6-9.8-9.1C.6 8 1.9 4.6 5.1 3.7c2-.6 4.1.2 5.4 1.9l1.5 2 1.5-2c1.3-1.7 3.4-2.5 5.4-1.9 3.2.9 4.5 4.3 2.9 7.7-2.3 4.5-9.8 9.1-9.8 9.1Z"
            stroke="currentColor"
            stroke-width="1.7"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>
    <div class="package-card__body">
      <h3 class="package-card__name">{{ pkg.name }}</h3>
      <StarRating :rating="rating.rating" :review-count="rating.reviewCount" />
      <p class="package-card__price">From R{{ pkg.base_price }} / person</p>
      <p v-if="pkg.description" class="package-card__description">{{ pkg.description }}</p>
      <ul class="package-card__meta">
        <li>{{ pkg.guests }}</li>
        <li>{{ pkg.courses }}</li>
        <li v-if="pkg.feature" class="package-card__feature">{{ pkg.feature }}</li>
      </ul>
      <RouterLink :to="`/packages/${pkg.package_id}`" class="package-card__cta">
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

.package-card__wishlist {
  position: absolute;
  top: 0.6rem;
  right: 0.6rem;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.9);
  color: var(--color-brown-deep);
  display: flex;
  align-items: center;
  justify-content: center;
}

.package-card__wishlist--active {
  color: #c0435a;
}

.package-card__body {
  padding: 1.1rem 1.1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  flex: 1;
}

.package-card__name {
  font-size: 1.05rem;
}

.package-card__price {
  color: var(--color-gold);
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 0.2rem;
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
