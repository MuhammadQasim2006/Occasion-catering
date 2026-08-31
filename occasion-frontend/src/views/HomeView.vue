<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { categories, packages } from '@/data/mockPackages'
import CategoryFilter from '@/components/packages/CategoryFilter.vue'
import PackageCard from '@/components/packages/PackageCard.vue'

const activeCategory = ref('all')
const visibleCount = ref(4)

const filteredPackages = computed(() => {
  if (activeCategory.value === 'all') return packages
  return packages.filter((pkg) => pkg.categoryId === activeCategory.value)
})

const displayedPackages = computed(() => filteredPackages.value.slice(0, visibleCount.value))
const hasMore = computed(() => visibleCount.value < filteredPackages.value.length)

function selectCategory(id) {
  activeCategory.value = id
  visibleCount.value = 4
}

function loadMore() {
  visibleCount.value += 4
}
</script>

<template>
  <main>
    <section class="hero">
      <div class="hero__panel">
        <p class="hero__eyebrow">✦ ✦</p>
        <h1 class="hero__title">Plan Your Occasion in Minutes</h1>
        <p class="hero__subtitle">Browse curated catering packages for every event</p>
        <RouterLink to="/large-events" class="hero__cta">Browse Now →</RouterLink>
      </div>
      <img
        class="hero__image"
        src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80"
        alt="Candlelit outdoor dining table set among vineyards"
      />
    </section>

    <section class="packages">
      <CategoryFilter
        :categories="categories"
        :active-id="activeCategory"
        @select="selectCategory"
      />

      <div class="packages__grid">
        <PackageCard v-for="pkg in displayedPackages" :key="pkg.id" :pkg="pkg" />
      </div>

      <p v-if="!displayedPackages.length" class="packages__empty">
        No packages in this category yet — check back soon.
      </p>

      <button v-if="hasMore" class="packages__load-more" @click="loadMore">Load More</button>
    </section>

    <section class="tour-banner">
      <img
        class="tour-banner__image"
        src="https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1400&q=80"
        alt="African savanna at sunset"
      />
      <div class="tour-banner__overlay">
        <p class="tour-banner__eyebrow">For Tour Operators</p>
        <h2 class="tour-banner__title">Special Tour Food Packages</h2>
        <p class="tour-banner__subtitle">
          En-route dining options customised for luxury private game reserves and day-tour
          operators.
        </p>
        <RouterLink to="/tours" class="tour-banner__cta">Explore Tours →</RouterLink>
      </div>
    </section>
  </main>
</template>

<style scoped>
main {
  max-width: var(--content-width);
  margin: 0 auto;
  padding: 1.5rem;
  width: 100%;
}

/* Hero */
.hero {
  position: relative;
  border-radius: var(--radius-md);
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 340px;
}

.hero__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  grid-column: 1 / -1;
  grid-row: 1;
}

.hero__panel {
  grid-column: 1 / -1;
  grid-row: 1;
  z-index: 2;
  background: linear-gradient(
    100deg,
    rgba(20, 38, 29, 0.92) 0%,
    rgba(20, 38, 29, 0.75) 45%,
    rgba(20, 38, 29, 0) 75%
  );
  color: var(--color-cream);
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.9rem;
  max-width: 60%;
}

.hero__eyebrow {
  color: var(--color-gold);
  letter-spacing: 0.15em;
}

.hero__title {
  font-size: 2.2rem;
  color: var(--color-white);
  max-width: 12ch;
}

.hero__subtitle {
  font-size: 0.95rem;
  opacity: 0.9;
  max-width: 34ch;
}

.hero__cta {
  align-self: flex-start;
  background: var(--color-gold);
  color: var(--color-brown-deep);
  font-weight: 600;
  border-radius: var(--radius-full);
  padding: 0.75rem 1.5rem;
  margin-top: 0.5rem;
}

.hero__cta:hover {
  box-shadow: 0 4px 14px rgba(207, 157, 67, 0.4);
}

/* Packages */
.packages {
  margin-top: 3rem;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.packages__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
}

.packages__empty {
  color: var(--color-muted);
  text-align: center;
  padding: 2rem 0;
}

.packages__load-more {
  align-self: center;
  background: transparent;
  border: 1px solid var(--color-line);
  border-radius: var(--radius-full);
  padding: 0.65rem 1.75rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-brown);
}

.packages__load-more:hover {
  border-color: var(--color-gold);
  color: var(--color-gold);
}

/* Tour banner */
.tour-banner {
  margin-top: 3rem;
  position: relative;
  border-radius: var(--radius-md);
  overflow: hidden;
  min-height: 220px;
  display: flex;
  align-items: center;
}

.tour-banner__image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.tour-banner__overlay {
  position: relative;
  z-index: 2;
  background: linear-gradient(
    100deg,
    rgba(43, 29, 18, 0.88) 0%,
    rgba(43, 29, 18, 0.55) 55%,
    rgba(43, 29, 18, 0) 85%
  );
  color: var(--color-cream);
  padding: 2.25rem;
  max-width: 65%;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.tour-banner__eyebrow {
  color: var(--color-gold);
  font-size: 0.8rem;
  font-weight: 600;
}

.tour-banner__title {
  font-size: 1.6rem;
  color: var(--color-white);
}

.tour-banner__subtitle {
  font-size: 0.9rem;
  opacity: 0.9;
  max-width: 42ch;
}

.tour-banner__cta {
  align-self: flex-start;
  background: var(--color-gold);
  color: var(--color-brown-deep);
  font-weight: 600;
  border-radius: var(--radius-full);
  padding: 0.65rem 1.4rem;
  margin-top: 0.5rem;
  font-size: 0.9rem;
}

@media (max-width: 900px) {
  .packages__grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .hero__panel,
  .tour-banner__overlay {
    max-width: 85%;
  }
}

@media (max-width: 560px) {
  .packages__grid {
    grid-template-columns: 1fr;
  }
  .hero {
    min-height: 420px;
  }
  .hero__panel {
    max-width: 100%;
    background: linear-gradient(180deg, rgba(20, 38, 29, 0.92) 40%, rgba(20, 38, 29, 0.6) 100%);
  }
}
</style>
