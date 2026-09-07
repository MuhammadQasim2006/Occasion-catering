<script setup>
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import PackageCard from '@/components/packages/PackageCard.vue'
import CategoryFilter from '@/components/packages/CategoryFilter.vue'
import { packages } from '@/data/mockPackages'

// Filter tour packages
const tourPackages = computed(() => 
  packages.filter(pkg => pkg.event_size === 'tour')
)

// Category filter
const categories = [
  { category_id: 'all', name: 'All' },
  { category_id: 4, name: 'Tours' },
]

const activeCategory = ref('all')
const searchQuery = ref('')

const filteredPackages = computed(() => {
  let result = tourPackages.value

  // Filter by category
  if (activeCategory.value !== 'all') {
    result = result.filter(pkg => pkg.category_id === activeCategory.value)
  }

  // Filter by search
  const query = searchQuery.value.trim().toLowerCase()
  if (query) {
    result = result.filter(pkg => 
      pkg.name.toLowerCase().includes(query) ||
      pkg.description?.toLowerCase().includes(query)
    )
  }

  return result
})

function selectCategory(id) {
  activeCategory.value = id
}
</script>

<template>
  <main id="main-content" class="tours">

    <!-- HERO -->
    <section class="tours__hero">
      <div class="tours__hero-overlay"></div>
      <div class="tours__hero-content">
        <span class="tours__hero-eyebrow">TOUR PACKAGES</span>
        <h1 class="tours__hero-title">
          Delicious Food.<br>
          <em>Unforgettable Journeys.</em>
        </h1>
        <p class="tours__hero-description">
          Specially crafted catering for safari lodges, tour groups and adventures.
        </p>
        <RouterLink to="/packages?size=tour" class="tours__hero-cta">
          Explore Tour Packages →
        </RouterLink>
      </div>
    </section>

    <!-- BREADCRUMB -->
    <nav class="tours__breadcrumb" aria-label="Breadcrumb">
      <RouterLink to="/">Home</RouterLink>
      <span aria-hidden="true">›</span>
      <span class="tours__breadcrumb-current">Tours</span>
    </nav>

    <!-- PACKAGES -->
    <section class="tours__section">
      <div class="tours__header">
        <div>
          <span class="tours__eyebrow">TOUR FOOD PACKAGES</span>
          <h2 class="tours__title">Choose a package for your journey</h2>
          <p class="tours__subtitle">
            Options for day trips, groups and longer adventures.
          </p>
        </div>
      </div>

      <!-- Search -->
      <div class="tours__search-wrap">
        <label class="tours__search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="11" cy="11" r="7" stroke="var(--color-muted)" stroke-width="1.8"/>
            <path d="m20 20-3.2-3.2" stroke="var(--color-muted)" stroke-width="1.8" stroke-linecap="round"/>
          </svg>
          <input
            v-model="searchQuery"
            type="search"
            placeholder="Search tour packages..."
          />
        </label>
      </div>

      <!-- Category Filter -->
      <CategoryFilter
        :categories="categories"
        :active-id="activeCategory"
        @select="selectCategory"
      />

      <!-- Results count -->
      <p v-if="filteredPackages.length" class="tours__count">
        {{ filteredPackages.length }} package{{ filteredPackages.length === 1 ? '' : 's' }} found
      </p>

      <!-- Package Grid -->
      <div v-if="filteredPackages.length" class="tours__grid">
        <PackageCard
          v-for="pkg in filteredPackages"
          :key="pkg.package_id"
          :pkg="pkg"
        />
      </div>

      <!-- Empty state -->
      <div v-else class="tours__empty">
        <p>No packages match your filters.</p>
        <button class="tours__reset" @click="activeCategory = 'all'; searchQuery = ''">
          Reset Filters
        </button>
      </div>
    </section>

    <!-- CTA BANNER -->
    <section class="tours__cta">
      <div class="tours__cta-content">
        <span class="tours__cta-eyebrow">FOR TOUR OPERATORS</span>
        <h2 class="tours__cta-title">Partner With Occasion</h2>
        <p class="tours__cta-description">
          Let us handle the food while you focus on creating amazing experiences.
        </p>
        <RouterLink to="/about" class="tours__cta-button">
          Partner With Us →
        </RouterLink>
      </div>
      <div class="tours__cta-image"></div>
    </section>

  </main>
</template>

<style scoped>
/* ============================================================
   PAGE CONTAINER
============================================================ */
.tours {
  background: var(--color-cream);
  color: var(--color-ink);
  min-height: 100vh;
  padding: 0 1.5rem 4rem;
  max-width: var(--content-width);
  margin: 0 auto;
}

/* ============================================================
   HERO
============================================================ */
.tours__hero {
  position: relative;
  border-radius: var(--radius-md);
  overflow: hidden;
  min-height: 400px;
  margin-top: 0.5rem;
  background-image: url('https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1500&q=85');
  background-size: cover;
  background-position: center;
}

.tours__hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    rgba(20, 38, 29, 0.94) 0%,
    rgba(20, 38, 29, 0.78) 40%,
    rgba(20, 38, 29, 0.15) 75%,
    rgba(20, 38, 29, 0.05) 100%
  );
}

.tours__hero-content {
  position: relative;
  z-index: 2;
  padding: 4rem 3rem;
  max-width: 580px;
  color: var(--color-cream);
}

.tours__hero-eyebrow {
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  color: var(--color-gold);
  margin-bottom: 0.75rem;
}

.tours__hero-title {
  font-size: clamp(2.4rem, 5vw, 3.8rem);
  color: var(--color-cream);
  margin-bottom: 1rem;
  line-height: 1.05;
}

.tours__hero-title em {
  display: block;
  color: var(--color-gold);
  font-style: italic;
  font-weight: 700;
}

.tours__hero-description {
  font-size: 1rem;
  line-height: 1.7;
  color: rgba(250, 246, 238, 0.92);
  margin-bottom: 1.5rem;
  max-width: 440px;
}

.tours__hero-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  background: var(--color-gold);
  color: var(--color-brown-deep);
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-sm);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.tours__hero-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 14px rgba(207, 157, 67, 0.4);
}

/* ============================================================
   BREADCRUMB
============================================================ */
.tours__breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--color-muted);
  padding: 1.25rem 0 0.5rem;
}

.tours__breadcrumb a {
  color: var(--color-muted);
}

.tours__breadcrumb a:hover {
  color: var(--color-gold);
}

.tours__breadcrumb-current {
  color: var(--color-ink);
  font-weight: 500;
}

/* ============================================================
   SECTION HEADER
============================================================ */
.tours__section {
  padding: 2.5rem 0 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.tours__header {
  text-align: center;
}

.tours__eyebrow {
  display: block;
  color: var(--color-gold);
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.tours__title {
  font-size: clamp(1.8rem, 3.5vw, 2.6rem);
  margin: 0.5rem 0 0.3rem;
}

.tours__subtitle {
  color: var(--color-muted);
  font-size: 0.95rem;
  max-width: 520px;
  margin: 0 auto;
}

/* ============================================================
   SEARCH
============================================================ */
.tours__search-wrap {
  display: flex;
  justify-content: center;
}

.tours__search {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background: var(--color-white);
  border: 1px solid var(--color-line);
  border-radius: var(--radius-full);
  padding: 0.6rem 1.2rem;
  width: 100%;
  max-width: 420px;
}

.tours__search input {
  border: none;
  outline: none;
  background: transparent;
  font-family: var(--font-body);
  font-size: 0.9rem;
  width: 100%;
  color: var(--color-ink);
}

.tours__search input::placeholder {
  color: var(--color-muted);
}

/* ============================================================
   RESULTS COUNT
============================================================ */
.tours__count {
  font-size: 0.85rem;
  color: var(--color-muted);
  margin-top: -0.5rem;
}

/* ============================================================
   PACKAGE GRID
============================================================ */
.tours__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
}

/* ============================================================
   EMPTY STATE
============================================================ */
.tours__empty {
  text-align: center;
  padding: 3rem 0;
  color: var(--color-muted);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.tours__reset {
  background: transparent;
  border: 1px solid var(--color-line);
  border-radius: var(--radius-full);
  padding: 0.6rem 1.5rem;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--color-brown);
  cursor: pointer;
}

.tours__reset:hover {
  border-color: var(--color-gold);
  color: var(--color-gold);
}

/* ============================================================
   CTA BANNER
============================================================ */
.tours__cta {
  position: relative;
  border-radius: var(--radius-md);
  overflow: hidden;
  min-height: 240px;
  margin-top: 1.5rem;
  display: flex;
  align-items: center;
  background: var(--color-cream-soft);
}

.tours__cta-content {
  position: relative;
  z-index: 2;
  padding: 2.5rem 3rem;
  width: 55%;
}

.tours__cta-eyebrow {
  display: block;
  color: var(--color-gold);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.tours__cta-title {
  font-size: clamp(1.6rem, 3vw, 2.2rem);
  margin: 0.5rem 0;
}

.tours__cta-description {
  color: var(--color-muted);
  font-size: 0.95rem;
  max-width: 400px;
  margin-bottom: 1.25rem;
}

.tours__cta-button {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  background: var(--color-gold);
  color: var(--color-brown-deep);
  font-weight: 600;
  padding: 0.7rem 1.4rem;
  border-radius: var(--radius-sm);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.tours__cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 14px rgba(207, 157, 67, 0.4);
}

.tours__cta-image {
  position: absolute;
  inset: 0 0 0 45%;
  background-image: 
    linear-gradient(90deg, var(--color-cream-soft) 0%, rgba(243, 237, 225, 0.5) 25%, rgba(243, 237, 225, 0) 60%),
    url('https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1200&q=85');
  background-size: cover;
  background-position: center;
}

/* ============================================================
   RESPONSIVE
============================================================ */
@media (max-width: 960px) {
  .tours__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 720px) {
  .tours {
    padding: 0 1rem 3rem;
  }

  .tours__hero {
    min-height: 380px;
  }

  .tours__hero-content {
    padding: 2.5rem 1.5rem;
    max-width: 100%;
    background: linear-gradient(180deg, rgba(20, 38, 29, 0.92) 40%, rgba(20, 38, 29, 0.6) 100%);
  }

  .tours__hero-title {
    font-size: 2.2rem;
  }

  .tours__hero-description {
    font-size: 0.95rem;
  }

  .tours__grid {
    grid-template-columns: 1fr;
  }

  .tours__cta {
    min-height: 360px;
    flex-direction: column;
    align-items: flex-end;
  }

  .tours__cta-content {
    width: 100%;
    padding: 2rem 1.5rem;
    background: rgba(250, 246, 238, 0.92);
    align-self: flex-end;
  }

  .tours__cta-image {
    inset: 0;
    opacity: 0.3;
  }
}

@media (max-width: 480px) {
  .tours__hero-title {
    font-size: 1.8rem;
  }

  .tours__search {
    max-width: 100%;
  }
}
</style>