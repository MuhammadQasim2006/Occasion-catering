<script setup>
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import PackageCard from '@/components/packages/PackageCard.vue'
import CategoryFilter from '@/components/packages/CategoryFilter.vue'
import { packages } from '@/data/mockPackages'

// Filter small event packages
const smallPackages = computed(() => 
  packages.filter(pkg => pkg.event_size === 'small')
)

// Category filter
const categories = [
  { category_id: 'all', name: 'All' },
  { category_id: 1, name: 'Weddings' },
  { category_id: 2, name: 'Corporate' },
  { category_id: 3, name: 'Private Dinners' },
]

const activeCategory = ref('all')
const searchQuery = ref('')

const filteredPackages = computed(() => {
  let result = smallPackages.value

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
  <main id="main-content" class="small-events">

    <!-- HERO -->
    <section class="small-events__hero">
      <div class="small-events__hero-overlay"></div>
      <div class="small-events__hero-content">
        <span class="small-events__hero-eyebrow">INTIMATE MOMENTS • DELICIOUSLY CATERED</span>
        <h1 class="small-events__hero-title">
          Small Events,<br>
          <em>Big Memories</em>
        </h1>
        <p class="small-events__hero-description">
          Perfectly portioned catering for baby showers, kitchen teas,
          engagements and private celebrations.
        </p>
        <RouterLink to="/packages?size=small" class="small-events__hero-cta">
          Explore Small Event Packages →
        </RouterLink>
      </div>
    </section>

    <!-- BREADCRUMB -->
    <nav class="small-events__breadcrumb" aria-label="Breadcrumb">
      <RouterLink to="/">Home</RouterLink>
      <span aria-hidden="true">›</span>
      <span class="small-events__breadcrumb-current">Small Events</span>
    </nav>

    <!-- PACKAGES -->
    <section class="small-events__section">
      <div class="small-events__header">
        <div>
          <span class="small-events__eyebrow">OUR SMALL EVENT PACKAGES</span>
          <h2 class="small-events__title">Choose the perfect package for your celebration</h2>
          <p class="small-events__subtitle">
            Thoughtful menus for life's smaller but just as special moments.
          </p>
        </div>
      </div>

      <!-- Search -->
      <div class="small-events__search-wrap">
        <label class="small-events__search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="11" cy="11" r="7" stroke="var(--color-muted)" stroke-width="1.8"/>
            <path d="m20 20-3.2-3.2" stroke="var(--color-muted)" stroke-width="1.8" stroke-linecap="round"/>
          </svg>
          <input
            v-model="searchQuery"
            type="search"
            placeholder="Search small event packages..."
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
      <p v-if="filteredPackages.length" class="small-events__count">
        {{ filteredPackages.length }} package{{ filteredPackages.length === 1 ? '' : 's' }} found
      </p>

      <!-- Package Grid -->
      <div v-if="filteredPackages.length" class="small-events__grid">
        <PackageCard
          v-for="pkg in filteredPackages"
          :key="pkg.package_id"
          :pkg="pkg"
        />
      </div>

      <!-- Empty state -->
      <div v-else class="small-events__empty">
        <p>No packages match your filters.</p>
        <button class="small-events__reset" @click="activeCategory = 'all'; searchQuery = ''">
          Reset Filters
        </button>
      </div>
    </section>

    <!-- CTA BANNER -->
    <section class="small-events__cta">
      <div class="small-events__cta-content">
        <span class="small-events__cta-eyebrow">HAVE SOMETHING IN MIND?</span>
        <h2 class="small-events__cta-title">Planning a special small event?</h2>
        <p class="small-events__cta-description">
          Let us help you create a menu and experience that's perfect for your occasion.
        </p>
        <RouterLink to="/about" class="small-events__cta-button">
          Make an Enquiry →
        </RouterLink>
      </div>
      <div class="small-events__cta-image"></div>
    </section>

  </main>
</template>

<style scoped>
/* ============================================================
   PAGE CONTAINER
============================================================ */
.small-events {
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
.small-events__hero {
  position: relative;
  border-radius: var(--radius-md);
  overflow: hidden;
  min-height: 400px;
  margin-top: 0.5rem;
  background-image: url('https://images.unsplash.com/photo-1529543544282-ea669407fca3?auto=format&fit=crop&w=1500&q=85');
  background-size: cover;
  background-position: center;
}

.small-events__hero-overlay {
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

.small-events__hero-content {
  position: relative;
  z-index: 2;
  padding: 4rem 3rem;
  max-width: 580px;
  color: var(--color-cream);
}

.small-events__hero-eyebrow {
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  color: var(--color-gold);
  margin-bottom: 0.75rem;
}

.small-events__hero-title {
  font-size: clamp(2.4rem, 5vw, 3.8rem);
  color: var(--color-cream);
  margin-bottom: 1rem;
  line-height: 1.05;
}

.small-events__hero-title em {
  display: block;
  color: var(--color-gold);
  font-style: italic;
  font-weight: 700;
}

.small-events__hero-description {
  font-size: 1rem;
  line-height: 1.7;
  color: rgba(250, 246, 238, 0.92);
  margin-bottom: 1.5rem;
  max-width: 440px;
}

.small-events__hero-cta {
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

.small-events__hero-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 14px rgba(207, 157, 67, 0.4);
}

/* ============================================================
   BREADCRUMB
============================================================ */
.small-events__breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--color-muted);
  padding: 1.25rem 0 0.5rem;
}

.small-events__breadcrumb a {
  color: var(--color-muted);
}

.small-events__breadcrumb a:hover {
  color: var(--color-gold);
}

.small-events__breadcrumb-current {
  color: var(--color-ink);
  font-weight: 500;
}

/* ============================================================
   SECTION HEADER
============================================================ */
.small-events__section {
  padding: 2.5rem 0 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.small-events__header {
  text-align: center;
}

.small-events__eyebrow {
  display: block;
  color: var(--color-gold);
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.small-events__title {
  font-size: clamp(1.8rem, 3.5vw, 2.6rem);
  margin: 0.5rem 0 0.3rem;
}

.small-events__subtitle {
  color: var(--color-muted);
  font-size: 0.95rem;
  max-width: 520px;
  margin: 0 auto;
}

/* ============================================================
   SEARCH
============================================================ */
.small-events__search-wrap {
  display: flex;
  justify-content: center;
}

.small-events__search {
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

.small-events__search input {
  border: none;
  outline: none;
  background: transparent;
  font-family: var(--font-body);
  font-size: 0.9rem;
  width: 100%;
  color: var(--color-ink);
}

.small-events__search input::placeholder {
  color: var(--color-muted);
}

/* ============================================================
   RESULTS COUNT
============================================================ */
.small-events__count {
  font-size: 0.85rem;
  color: var(--color-muted);
  margin-top: -0.5rem;
}

/* ============================================================
   PACKAGE GRID
============================================================ */
.small-events__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
}

/* ============================================================
   EMPTY STATE
============================================================ */
.small-events__empty {
  text-align: center;
  padding: 3rem 0;
  color: var(--color-muted);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.small-events__reset {
  background: transparent;
  border: 1px solid var(--color-line);
  border-radius: var(--radius-full);
  padding: 0.6rem 1.5rem;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--color-brown);
  cursor: pointer;
}

.small-events__reset:hover {
  border-color: var(--color-gold);
  color: var(--color-gold);
}

/* ============================================================
   CTA BANNER
============================================================ */
.small-events__cta {
  position: relative;
  border-radius: var(--radius-md);
  overflow: hidden;
  min-height: 240px;
  margin-top: 1.5rem;
  display: flex;
  align-items: center;
  background: var(--color-cream-soft);
}

.small-events__cta-content {
  position: relative;
  z-index: 2;
  padding: 2.5rem 3rem;
  width: 55%;
}

.small-events__cta-eyebrow {
  display: block;
  color: var(--color-gold);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.small-events__cta-title {
  font-size: clamp(1.6rem, 3vw, 2.2rem);
  margin: 0.5rem 0;
}

.small-events__cta-description {
  color: var(--color-muted);
  font-size: 0.95rem;
  max-width: 400px;
  margin-bottom: 1.25rem;
}

.small-events__cta-button {
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

.small-events__cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 14px rgba(207, 157, 67, 0.4);
}

.small-events__cta-image {
  position: absolute;
  inset: 0 0 0 45%;
  background-image: 
    linear-gradient(90deg, var(--color-cream-soft) 0%, rgba(243, 237, 225, 0.5) 25%, rgba(243, 237, 225, 0) 60%),
    url('https://images.unsplash.com/photo-1517825738774-7de9363ef735?auto=format&fit=crop&w=1200&q=85');
  background-size: cover;
  background-position: center;
}

/* ============================================================
   RESPONSIVE
============================================================ */
@media (max-width: 960px) {
  .small-events__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 720px) {
  .small-events {
    padding: 0 1rem 3rem;
  }

  .small-events__hero {
    min-height: 380px;
  }

  .small-events__hero-content {
    padding: 2.5rem 1.5rem;
    max-width: 100%;
    background: linear-gradient(180deg, rgba(20, 38, 29, 0.92) 40%, rgba(20, 38, 29, 0.6) 100%);
  }

  .small-events__hero-title {
    font-size: 2.2rem;
  }

  .small-events__hero-description {
    font-size: 0.95rem;
  }

  .small-events__grid {
    grid-template-columns: 1fr;
  }

  .small-events__cta {
    min-height: 360px;
    flex-direction: column;
    align-items: flex-end;
  }

  .small-events__cta-content {
    width: 100%;
    padding: 2rem 1.5rem;
    background: rgba(250, 246, 238, 0.92);
    align-self: flex-end;
  }

  .small-events__cta-image {
    inset: 0;
    opacity: 0.3;
  }
}

@media (max-width: 480px) {
  .small-events__hero-title {
    font-size: 1.8rem;
  }

  .small-events__search {
    max-width: 100%;
  }
}
</style>