<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { categories, fetchPackages } from '@/data/mockPackages'
import CategoryFilter from '@/components/packages/CategoryFilter.vue'
import PackageCard from '@/components/packages/PackageCard.vue'
import PackageCardSkeleton from '@/components/packages/PackageCardSkeleton.vue'

// Shell for GET /api/packages (see API contract, TICKET-001).
// Dedicated browse/filter page — the homepage keeps a shorter 4-up preview,
// this page is the full catalogue with search, category, event-size, and
// sort controls.

const route = useRoute()
const router = useRouter()

const activeCategory = ref('all')
const eventSize = ref('all') // 'all' | 'large' | 'small' | 'tour'
const sortBy = ref('recommended') // 'recommended' | 'price-asc' | 'price-desc'
const searchQuery = ref(route.query.q || '')

const allPackages = ref([])
const status = ref('loading') // 'loading' | 'success' | 'error'

const categoriesWithAll = computed(() => [{ category_id: 'all', name: 'All' }, ...categories])

const eventSizes = [
  { id: 'all', label: 'Any Size' },
  { id: 'large', label: 'Large Events' },
  { id: 'small', label: 'Small Events' },
  { id: 'tour', label: 'Tours' },
]

async function loadPackages() {
  status.value = 'loading'
  try {
    allPackages.value = await fetchPackages()
    status.value = 'success'
  } catch {
    status.value = 'error'
  }
}

onMounted(loadPackages)

// Keep the URL query in sync with the search box so a search is shareable /
// survives a refresh, without fighting the router on every keystroke.
let queryTimer = null
watch(searchQuery, (value) => {
  clearTimeout(queryTimer)
  queryTimer = setTimeout(() => {
    router.replace({ query: { ...route.query, q: value || undefined } })
  }, 300)
})

const filteredPackages = computed(() => {
  let result = allPackages.value

  if (activeCategory.value !== 'all') {
    result = result.filter((pkg) => pkg.category_id === activeCategory.value)
  }

  if (eventSize.value !== 'all') {
    result = result.filter((pkg) => pkg.event_size === eventSize.value)
  }

  const query = searchQuery.value.trim().toLowerCase()
  if (query) {
    result = result.filter(
      (pkg) =>
        pkg.name.toLowerCase().includes(query) ||
        pkg.description?.toLowerCase().includes(query),
    )
  }

  if (sortBy.value === 'price-asc') {
    result = [...result].sort((a, b) => a.base_price - b.base_price)
  } else if (sortBy.value === 'price-desc') {
    result = [...result].sort((a, b) => b.base_price - a.base_price)
  }

  return result
})

function selectCategory(id) {
  activeCategory.value = id
}

function resetFilters() {
  activeCategory.value = 'all'
  eventSize.value = 'all'
  sortBy.value = 'recommended'
  searchQuery.value = ''
}
</script>

<template>
  <main id="main-content" class="packages-page">
    <header class="packages-page__header">
      <p class="packages-page__eyebrow">Catering Packages</p>
      <h1 class="packages-page__title">Find the Perfect Package</h1>
      <p class="packages-page__subtitle">
        Browse curated menus for weddings, corporate events, private dinners, and tours —
        filter by category, size, or search for something specific.
      </p>

      <label class="packages-page__search">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="11" cy="11" r="7" stroke="var(--color-muted)" stroke-width="1.8" />
          <path
            d="m20 20-3.2-3.2"
            stroke="var(--color-muted)"
            stroke-width="1.8"
            stroke-linecap="round"
          />
        </svg>
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Search by package name or keyword..."
        />
      </label>
    </header>

    <div class="packages-page__controls">
      <CategoryFilter
        :categories="categoriesWithAll"
        :active-id="activeCategory"
        @select="selectCategory"
      />

      <div class="packages-page__secondary-controls">
        <label class="packages-page__select">
          <span>Event Size</span>
          <select v-model="eventSize">
            <option v-for="size in eventSizes" :key="size.id" :value="size.id">
              {{ size.label }}
            </option>
          </select>
        </label>

        <label class="packages-page__select">
          <span>Sort By</span>
          <select v-model="sortBy">
            <option value="recommended">Recommended</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </label>
      </div>
    </div>

    <p class="packages-page__count" v-if="status === 'success'">
      {{ filteredPackages.length }} package{{ filteredPackages.length === 1 ? '' : 's' }} found
    </p>

    <div v-if="status === 'loading'" class="packages-page__grid" aria-busy="true">
      <PackageCardSkeleton v-for="n in 8" :key="n" />
    </div>

    <div v-else-if="status === 'error'" class="packages-page__state">
      <p>Couldn't load packages right now.</p>
      <button class="packages-page__retry" @click="loadPackages">Try Again</button>
    </div>

    <template v-else>
      <div v-if="filteredPackages.length" class="packages-page__grid">
        <PackageCard v-for="pkg in filteredPackages" :key="pkg.package_id" :pkg="pkg" />
      </div>
      <div v-else class="packages-page__state">
        <p>No packages match your filters.</p>
        <button class="packages-page__retry" @click="resetFilters">Reset Filters</button>
      </div>
    </template>
  </main>
</template>

<style scoped>
.packages-page {
  max-width: var(--content-width);
  margin: 0 auto;
  padding: 2.5rem 1.5rem 4rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.packages-page__header {
  text-align: center;
  max-width: 640px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.packages-page__eyebrow {
  color: var(--color-gold);
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.05em;
}

.packages-page__title {
  font-size: 2.1rem;
}

.packages-page__subtitle {
  color: var(--color-muted);
  font-size: 0.95rem;
}

.packages-page__search {
  margin: 1rem auto 0;
  width: 100%;
  max-width: 440px;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background: var(--color-white);
  border: 1px solid var(--color-line);
  border-radius: var(--radius-full);
  padding: 0.7rem 1.1rem;
}

.packages-page__search input {
  border: none;
  outline: none;
  background: transparent;
  font-family: var(--font-body);
  font-size: 0.9rem;
  width: 100%;
  color: var(--color-ink);
}

.packages-page__controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.packages-page__secondary-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.packages-page__select {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.82rem;
  color: var(--color-muted);
}

.packages-page__select select {
  border: 1px solid var(--color-line);
  border-radius: var(--radius-sm);
  padding: 0.5rem 0.75rem;
  font-family: var(--font-body);
  font-size: 0.85rem;
  color: var(--color-ink);
  background: var(--color-white);
}

.packages-page__count {
  font-size: 0.85rem;
  color: var(--color-muted);
  margin-top: -1rem;
}

.packages-page__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
}

.packages-page__state {
  text-align: center;
  padding: 4rem 0;
  color: var(--color-muted);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.packages-page__retry {
  background: transparent;
  border: 1px solid var(--color-line);
  border-radius: var(--radius-full);
  padding: 0.6rem 1.5rem;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--color-brown);
}

.packages-page__retry:hover {
  border-color: var(--color-gold);
  color: var(--color-gold);
}

@media (max-width: 900px) {
  .packages-page__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 560px) {
  .packages-page__grid {
    grid-template-columns: 1fr;
  }
  .packages-page__controls {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
