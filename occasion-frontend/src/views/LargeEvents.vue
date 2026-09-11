<script setup>
import { computed, ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import PackageCard from '@/components/packages/PackageCard.vue'
import CategoryFilter from '@/components/packages/CategoryFilter.vue'
import { fetchPackages } from '@/services/packages'

// Category filter
const categories = [
  { category_id: 'all', name: 'All' },
  { category_id: 1, name: 'Weddings' },
  { category_id: 2, name: 'Corporate' },
]

const activeCategory = ref('all')
const searchQuery = ref('')
const largePackages = ref([])
const status = ref('loading') // 'loading' | 'success' | 'error'

async function loadPackages() {
  status.value = 'loading'
  try {
    largePackages.value = await fetchPackages({ event_size: 'large' })
    status.value = 'success'
  } catch {
    status.value = 'error'
  }
}

onMounted(loadPackages)

const filteredPackages = computed(() => {
  let result = largePackages.value

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
  <main id="main-content" class="large-events">

    <!-- HERO -->
    <section class="large-events__hero">
      <div class="large-events__hero-overlay"></div>
      <div class="large-events__hero-content">
        <span class="large-events__hero-eyebrow">BIG MOMENTS • GREAT FOOD</span>
        <h1 class="large-events__hero-title">
          Large Events,<br>
          <em>Made Memorable</em>
        </h1>
        <p class="large-events__hero-description">
          From weddings to corporate celebrations, we bring generous local flavour
          and reliable catering to your biggest occasions.
        </p>
        <RouterLink to="/packages?size=large" class="large-events__hero-cta">
          Browse Large Event Packages →
        </RouterLink>
      </div>
    </section>

    <!-- BREADCRUMB -->
    <nav class="large-events__breadcrumb" aria-label="Breadcrumb">
      <RouterLink to="/">Home</RouterLink>
      <span aria-hidden="true">›</span>
      <span class="large-events__breadcrumb-current">Large Events</span>
    </nav>

    <!-- PACKAGES -->
    <section class="large-events__section">
      <div class="large-events__header">
        <div>
          <span class="large-events__eyebrow">OUR LARGE EVENT COLLECTION</span>
          <h2 class="large-events__title">Choose the right package for your crowd</h2>
          <p class="large-events__subtitle">
            Easy catering options for celebrations where everyone deserves a good meal.
          </p>
        </div>
      </div>

      <!-- Search -->
      <div class="large-events__search-wrap">
        <label class="large-events__search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="11" cy="11" r="7" stroke="var(--color-muted)" stroke-width="1.8"/>
            <path d="m20 20-3.2-3.2" stroke="var(--color-muted)" stroke-width="1.8" stroke-linecap="round"/>
          </svg>
          <input
            v-model="searchQuery"
            type="search"
            placeholder="Search large event packages..."
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
      <p v-if="status === 'success' && filteredPackages.length" class="large-events__count">
        {{ filteredPackages.length }} package{{ filteredPackages.length === 1 ? '' : 's' }} found
      </p>

      <!-- Loading state -->
      <div v-if="status === 'loading'" class="large-events__empty" aria-busy="true">
        <p>Loading packages…</p>
      </div>

      <!-- Error state -->
      <div v-else-if="status === 'error'" class="large-events__empty">
        <p>Couldn't load packages right now.</p>
        <button class="large-events__reset" @click="loadPackages">Try Again</button>
      </div>

      <!-- Package Grid -->
      <div v-else-if="filteredPackages.length" class="large-events__grid">
        <PackageCard
          v-for="pkg in filteredPackages"
          :key="pkg.package_id"
          :pkg="pkg"
        />
      </div>

      <!-- Empty state -->
      <div v-else class="large-events__empty">
        <p>No packages match your filters.</p>
        <button class="large-events__reset" @click="activeCategory = 'all'; searchQuery = ''">
          Reset Filters
        </button>
      </div>
    </section>

    <!-- CTA BANNER -->
    <section class="large-events__cta">
      <div class="large-events__cta-content">
        <span class="large-events__cta-eyebrow">NEED SOMETHING SPECIAL?</span>
        <h2 class="large-events__cta-title">Planning a big celebration?</h2>
        <p class="large-events__cta-description">
          Tell us what you need and we can help shape a menu around your event.
        </p>
        <RouterLink to="/about" class="large-events__cta-button">
          Make an Enquiry →
        </RouterLink>
      </div>
      <div class="large-events__cta-image"></div>
    </section>

  </main>
</template>

<style scoped>
/* ============================================================
   PAGE CONTAINER
============================================================ */
.large-events {
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
.large-events__hero {
  position: relative;
  border-radius: var(--radius-md);
  overflow: hidden;
  min-height: 400px;
  margin-top: 0.5rem;
  background-image: url('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1500&q=85');
  background-size: cover;
  background-position: center;
}

.large-events__hero-overlay {
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

.large-events__hero-content {
  position: relative;
  z-index: 2;
  padding: 4rem 3rem;
  max-width: 580px;
  color: var(--color-cream);
}

.large-events__hero-eyebrow {
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  color: var(--color-gold);
  margin-bottom: 0.75rem;
}

.large-events__hero-title {
  font-size: clamp(2.4rem, 5vw, 3.8rem);
  color: var(--color-cream);
  margin-bottom: 1rem;
  line-height: 1.05;
}

.large-events__hero-title em {
  display: block;
  color: var(--color-gold);
  font-style: italic;
  font-weight: 700;
}

.large-events__hero-description {
  font-size: 1rem;
  line-height: 1.7;
  color: rgba(250, 246, 238, 0.92);
  margin-bottom: 1.5rem;
  max-width: 440px;
}

.large-events__hero-cta {
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

.large-events__hero-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 14px rgba(207, 157, 67, 0.4);
}

/* ============================================================
   BREADCRUMB
============================================================ */
.large-events__breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--color-muted);
  padding: 1.25rem 0 0.5rem;
}

.large-events__breadcrumb a {
  color: var(--color-muted);
}

.large-events__breadcrumb a:hover {
  color: var(--color-gold);
}

.large-events__breadcrumb-current {
  color: var(--color-ink);
  font-weight: 500;
}

/* ============================================================
   SECTION HEADER
============================================================ */
.large-events__section {
  padding: 2.5rem 0 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.large-events__header {
  text-align: center;
}

.large-events__eyebrow {
  display: block;
  color: var(--color-gold);
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.large-events__title {
  font-size: clamp(1.8rem, 3.5vw, 2.6rem);
  margin: 0.5rem 0 0.3rem;
}

.large-events__subtitle {
  color: var(--color-muted);
  font-size: 0.95rem;
  max-width: 520px;
  margin: 0 auto;
}

/* ============================================================
   SEARCH
============================================================ */
.large-events__search-wrap {
  display: flex;
  justify-content: center;
}

.large-events__search {
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

.large-events__search input {
  border: none;
  outline: none;
  background: transparent;
  font-family: var(--font-body);
  font-size: 0.9rem;
  width: 100%;
  color: var(--color-ink);
}

.large-events__search input::placeholder {
  color: var(--color-muted);
}

/* ============================================================
   RESULTS COUNT
============================================================ */
.large-events__count {
  font-size: 0.85rem;
  color: var(--color-muted);
  margin-top: -0.5rem;
}

/* ============================================================
   PACKAGE GRID
============================================================ */
.large-events__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
}

/* ============================================================
   EMPTY STATE
============================================================ */
.large-events__empty {
  text-align: center;
  padding: 3rem 0;
  color: var(--color-muted);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.large-events__reset {
  background: transparent;
  border: 1px solid var(--color-line);
  border-radius: var(--radius-full);
  padding: 0.6rem 1.5rem;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--color-brown);
  cursor: pointer;
}

.large-events__reset:hover {
  border-color: var(--color-gold);
  color: var(--color-gold);
}

/* ============================================================
   CTA BANNER
============================================================ */
.large-events__cta {
  position: relative;
  border-radius: var(--radius-md);
  overflow: hidden;
  min-height: 240px;
  margin-top: 1.5rem;
  display: flex;
  align-items: center;
  background: var(--color-cream-soft);
}

.large-events__cta-content {
  position: relative;
  z-index: 2;
  padding: 2.5rem 3rem;
  width: 55%;
}

.large-events__cta-eyebrow {
  display: block;
  color: var(--color-gold);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.large-events__cta-title {
  font-size: clamp(1.6rem, 3vw, 2.2rem);
  margin: 0.5rem 0;
}

.large-events__cta-description {
  color: var(--color-muted);
  font-size: 0.95rem;
  max-width: 400px;
  margin-bottom: 1.25rem;
}

.large-events__cta-button {
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

.large-events__cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 14px rgba(207, 157, 67, 0.4);
}

.large-events__cta-image {
  position: absolute;
  inset: 0 0 0 45%;
  background-image: 
    linear-gradient(90deg, var(--color-cream-soft) 0%, rgba(243, 237, 225, 0.5) 25%, rgba(243, 237, 225, 0) 60%),
    url('https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=85');
  background-size: cover;
  background-position: center;
}

/* ============================================================
   RESPONSIVE
============================================================ */
@media (max-width: 960px) {
  .large-events__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 720px) {
  .large-events {
    padding: 0 1rem 3rem;
  }

  .large-events__hero {
    min-height: 380px;
  }

  .large-events__hero-content {
    padding: 2.5rem 1.5rem;
    max-width: 100%;
    background: linear-gradient(180deg, rgba(20, 38, 29, 0.92) 40%, rgba(20, 38, 29, 0.6) 100%);
  }

  .large-events__hero-title {
    font-size: 2.2rem;
  }

  .large-events__hero-description {
    font-size: 0.95rem;
  }

  .large-events__grid {
    grid-template-columns: 1fr;
  }

  .large-events__cta {
    min-height: 360px;
    flex-direction: column;
    align-items: flex-end;
  }

  .large-events__cta-content {
    width: 100%;
    padding: 2rem 1.5rem;
    background: rgba(250, 246, 238, 0.92);
    align-self: flex-end;
  }

  .large-events__cta-image {
    inset: 0;
    opacity: 0.3;
  }
}

@media (max-width: 480px) {
  .large-events__hero-title {
    font-size: 1.8rem;
  }

  .large-events__search {
    max-width: 100%;
  }
}
</style>