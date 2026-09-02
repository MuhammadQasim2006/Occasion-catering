<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, RouterLink, useRouter } from 'vue-router'
import { fetchPackageById, fetchMenuItems } from '@/data/mockPackages'
import { useCartStore } from '@/stores/cart'

// Shell for GET /api/packages/:id (see API contract, TICKET-001).
// Route: /packages/:id — id available via route.params.id.
// Menu customisation isn't a real table yet (see note in mockPackages.js) —
// selections are captured client-side and attached to the cart item so the
// shape is ready whenever a MenuSelections table/endpoint exists.

const route = useRoute()
const router = useRouter()
const cart = useCartStore()

const pkg = ref(null)
const menu = ref(null)
const status = ref('loading') // 'loading' | 'success' | 'error'
const guestCount = ref(20)

const courseLabels = { starters: 'Starters', mains: 'Mains', desserts: 'Desserts' }
const dietaryLabels = { veg: 'Vegetarian', vegan: 'Vegan', gf: 'Gluten-Free' }

// One selection per course by default (a plated menu picks one dish per
// course); mains allow up to 2 for a "choice of" style service.
const selections = ref({ starters: [], mains: [], desserts: [] })

const justAdded = ref(false)

async function load() {
  status.value = 'loading'
  justAdded.value = false
  try {
    const [pkgResult, menuResult] = await Promise.all([
      fetchPackageById(route.params.id),
      fetchMenuItems(route.params.id),
    ])
    pkg.value = pkgResult
    menu.value = menuResult
    // Default to the first item in each course so the summary isn't empty.
    selections.value = {
      starters: menuResult.starters?.[0] ? [menuResult.starters[0].id] : [],
      mains: menuResult.mains?.[0] ? [menuResult.mains[0].id] : [],
      desserts: menuResult.desserts?.[0] ? [menuResult.desserts[0].id] : [],
    }
    status.value = 'success'
  } catch {
    status.value = 'error'
  }
}

onMounted(load)
watch(() => route.params.id, load)

function toggleSelection(course, itemId) {
  const current = selections.value[course]
  const maxPicks = course === 'mains' ? 2 : 1

  if (current.includes(itemId)) {
    selections.value[course] = current.filter((id) => id !== itemId)
    return
  }

  if (current.length >= maxPicks) {
    // Swap out the oldest pick to make room, single-select courses behave
    // like radio buttons; mains behaves like a max-2 checkbox group.
    selections.value[course] = [...current.slice(1), itemId]
  } else {
    selections.value[course] = [...current, itemId]
  }
}

function selectedItems(course) {
  if (!menu.value) return []
  return menu.value[course]?.filter((item) => selections.value[course].includes(item.id)) || []
}

const totalPrice = computed(() => (pkg.value ? pkg.value.base_price * guestCount.value : 0))

const canAddToCart = computed(
  () =>
    selections.value.starters.length > 0 &&
    selections.value.mains.length > 0 &&
    selections.value.desserts.length > 0,
)

function handleAddToCart() {
  if (!pkg.value || !canAddToCart.value) return

  cart.addItem({
    ...pkg.value,
    guest_count: guestCount.value,
    menu_selections: {
      starters: selectedItems('starters').map((i) => i.name),
      mains: selectedItems('mains').map((i) => i.name),
      desserts: selectedItems('desserts').map((i) => i.name),
    },
  })

  justAdded.value = true
}

function goToCheckout() {
  handleAddToCart()
  router.push('/checkout')
}
</script>

<template>
  <main id="main-content" class="package-detail">
    <div v-if="status === 'loading'" class="package-detail__state" aria-busy="true">
      <p>Loading package…</p>
    </div>

    <div v-else-if="status === 'error'" class="package-detail__state">
      <p>Couldn't load this package.</p>
      <button class="package-detail__retry" @click="load">Try Again</button>
    </div>

    <template v-else>
      <nav class="package-detail__breadcrumb" aria-label="Breadcrumb">
        <RouterLink to="/packages">Packages</RouterLink>
        <span aria-hidden="true">/</span>
        <span>{{ pkg.name }}</span>
      </nav>

      <div class="package-detail__hero">
        <div class="package-detail__image-wrap">
          <img :src="pkg.image_url" :alt="pkg.name" class="package-detail__image" />
          <span v-if="pkg.badge" class="package-detail__badge">{{ pkg.badge }}</span>
        </div>

        <div class="package-detail__info">
          <h1 class="package-detail__name">{{ pkg.name }}</h1>
          <p class="package-detail__price">From R{{ pkg.base_price }} / person</p>
          <p class="package-detail__description">{{ pkg.description }}</p>

          <ul class="package-detail__meta">
            <li>{{ pkg.guests }}</li>
            <li>{{ pkg.courses }}</li>
            <li v-if="pkg.feature" class="package-detail__feature">{{ pkg.feature }}</li>
          </ul>

          <label class="package-detail__guest-field">
            <span>Guest Count</span>
            <div class="package-detail__stepper">
              <button
                type="button"
                :disabled="guestCount <= 1"
                @click="guestCount = Math.max(1, guestCount - 5)"
              >
                −
              </button>
              <input v-model.number="guestCount" type="number" min="1" />
              <button type="button" @click="guestCount += 5">+</button>
            </div>
          </label>
        </div>
      </div>

      <section class="package-detail__customise">
        <h2 class="package-detail__section-title">Customise Your Menu</h2>
        <p class="package-detail__section-subtitle">
          Choose one starter, up to two mains, and one dessert to build your plated menu.
        </p>

        <div
          v-for="course in ['starters', 'mains', 'desserts']"
          :key="course"
          class="package-detail__course"
        >
          <h3 class="package-detail__course-title">
            {{ courseLabels[course] }}
            <span class="package-detail__course-hint">
              {{ course === 'mains' ? 'Choose up to 2' : 'Choose 1' }}
            </span>
          </h3>

          <div class="package-detail__options">
            <label
              v-for="item in menu[course]"
              :key="item.id"
              class="package-detail__option"
              :class="{
                'package-detail__option--selected': selections[course].includes(item.id),
              }"
            >
              <input
                type="checkbox"
                :checked="selections[course].includes(item.id)"
                @change="toggleSelection(course, item.id)"
              />
              <span class="package-detail__option-name">{{ item.name }}</span>
              <span v-if="item.dietary.length" class="package-detail__option-tags">
                <span v-for="tag in item.dietary" :key="tag" class="package-detail__tag">
                  {{ dietaryLabels[tag] }}
                </span>
              </span>
            </label>
          </div>
        </div>
      </section>

      <aside class="package-detail__summary">
        <h2 class="package-detail__section-title">Your Selection</h2>

        <dl class="package-detail__summary-list">
          <div
            v-for="course in ['starters', 'mains', 'desserts']"
            :key="`summary-${course}`"
            class="package-detail__summary-row"
          >
            <dt>{{ courseLabels[course] }}</dt>
            <dd>
              <span v-if="selectedItems(course).length">
                {{ selectedItems(course).map((i) => i.name).join(', ') }}
              </span>
              <span v-else class="package-detail__summary-empty">Not selected</span>
            </dd>
          </div>
        </dl>

        <div class="package-detail__summary-total">
          <span>{{ guestCount }} guests × R{{ pkg.base_price }}</span>
          <strong>R{{ totalPrice.toLocaleString() }}</strong>
        </div>

        <p v-if="!canAddToCart" class="package-detail__validation">
          Please select at least one item per course.
        </p>
        <p v-if="justAdded" class="package-detail__added-msg">Added to your cart.</p>

        <div class="package-detail__actions">
          <button
            type="button"
            class="package-detail__add-btn"
            :disabled="!canAddToCart"
            @click="handleAddToCart"
          >
            Add to Cart
          </button>
          <button
            type="button"
            class="package-detail__checkout-btn"
            :disabled="!canAddToCart"
            @click="goToCheckout"
          >
            Add &amp; Checkout →
          </button>
        </div>
      </aside>
    </template>
  </main>
</template>

<style scoped>
.package-detail {
  max-width: var(--content-width);
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: 2rem;
  align-items: start;
}

.package-detail__state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 4rem 0;
  color: var(--color-muted);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.package-detail__retry {
  background: transparent;
  border: 1px solid var(--color-line);
  border-radius: var(--radius-full);
  padding: 0.6rem 1.5rem;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--color-brown);
}

.package-detail__retry:hover {
  border-color: var(--color-gold);
  color: var(--color-gold);
}

.package-detail__breadcrumb {
  grid-column: 1 / -1;
  display: flex;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--color-muted);
  margin-bottom: 0.5rem;
}

.package-detail__breadcrumb a {
  color: var(--color-muted);
}

.package-detail__breadcrumb a:hover {
  color: var(--color-gold);
}

.package-detail__hero {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  background: var(--color-white);
  border: 1px solid var(--color-line);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-card);
}

.package-detail__image-wrap {
  position: relative;
}

.package-detail__image {
  width: 100%;
  height: 100%;
  min-height: 280px;
  object-fit: cover;
}

.package-detail__badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: var(--color-gold);
  color: var(--color-brown-deep);
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.3rem 0.75rem;
  border-radius: var(--radius-full);
}

.package-detail__info {
  padding: 1.75rem 1.75rem 1.75rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.package-detail__name {
  font-size: 1.7rem;
}

.package-detail__price {
  color: var(--color-gold);
  font-weight: 700;
  font-size: 1.05rem;
}

.package-detail__description {
  color: var(--color-muted);
  font-size: 0.92rem;
  line-height: 1.5;
}

.package-detail__meta {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  font-size: 0.82rem;
  color: var(--color-muted);
}

.package-detail__meta li {
  border: 1px solid var(--color-line);
  border-radius: var(--radius-full);
  padding: 0.3rem 0.8rem;
}

.package-detail__feature {
  color: var(--color-gold) !important;
  border-color: var(--color-gold) !important;
}

.package-detail__guest-field {
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.package-detail__guest-field > span {
  font-size: 0.85rem;
  font-weight: 600;
}

.package-detail__stepper {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.package-detail__stepper button {
  width: 2.4rem;
  height: 2.4rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-line);
  background: var(--color-white);
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-brown);
}

.package-detail__stepper button:hover:not(:disabled) {
  border-color: var(--color-gold);
  color: var(--color-gold);
}

.package-detail__stepper button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.package-detail__stepper input {
  width: 5rem;
  text-align: center;
  border: 1px solid var(--color-line);
  border-radius: var(--radius-sm);
  padding: 0.6rem;
  font-family: var(--font-body);
  font-size: 0.95rem;
}

.package-detail__customise {
  background: var(--color-white);
  border: 1px solid var(--color-line);
  border-radius: var(--radius-md);
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.package-detail__section-title {
  font-size: 1.25rem;
}

.package-detail__section-subtitle {
  color: var(--color-muted);
  font-size: 0.88rem;
  margin-top: -1rem;
}

.package-detail__course {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.package-detail__course-title {
  font-size: 1rem;
  display: flex;
  align-items: baseline;
  gap: 0.6rem;
}

.package-detail__course-hint {
  font-size: 0.78rem;
  font-weight: 400;
  color: var(--color-muted);
}

.package-detail__options {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.package-detail__option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border: 1px solid var(--color-line);
  border-radius: var(--radius-sm);
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: border-color 0.15s ease, background 0.15s ease;
}

.package-detail__option:hover {
  border-color: var(--color-gold);
}

.package-detail__option--selected {
  border-color: var(--color-gold);
  background: var(--color-cream-soft);
}

.package-detail__option input {
  accent-color: var(--color-gold);
  width: 1.05rem;
  height: 1.05rem;
  flex-shrink: 0;
}

.package-detail__option-name {
  font-size: 0.92rem;
  flex: 1;
}

.package-detail__option-tags {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.package-detail__tag {
  font-size: 0.7rem;
  background: var(--color-cream-soft);
  color: var(--color-brown);
  border-radius: var(--radius-full);
  padding: 0.2rem 0.6rem;
  white-space: nowrap;
}

.package-detail__summary {
  background: var(--color-white);
  border: 1px solid var(--color-line);
  border-radius: var(--radius-md);
  padding: 1.75rem;
  position: sticky;
  top: 5.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.package-detail__summary-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.package-detail__summary-row {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  font-size: 0.85rem;
}

.package-detail__summary-row dt {
  font-weight: 600;
  color: var(--color-ink);
}

.package-detail__summary-row dd {
  color: var(--color-muted);
}

.package-detail__summary-empty {
  font-style: italic;
}

.package-detail__summary-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid var(--color-line);
  padding-top: 1rem;
  font-size: 0.95rem;
}

.package-detail__summary-total strong {
  font-size: 1.15rem;
}

.package-detail__validation {
  font-size: 0.8rem;
  color: #a63d3d;
}

.package-detail__added-msg {
  font-size: 0.82rem;
  color: #3e9a5f;
  font-weight: 600;
}

.package-detail__actions {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.package-detail__add-btn {
  background: transparent;
  border: 1px solid var(--color-gold);
  color: var(--color-gold);
  border-radius: var(--radius-sm);
  padding: 0.75rem;
  font-weight: 600;
  font-size: 0.9rem;
}

.package-detail__add-btn:hover:not(:disabled) {
  background: var(--color-cream-soft);
}

.package-detail__checkout-btn {
  background: var(--color-gold);
  color: var(--color-brown-deep);
  border: none;
  border-radius: var(--radius-sm);
  padding: 0.85rem;
  font-weight: 700;
  font-size: 0.95rem;
}

.package-detail__checkout-btn:hover:not(:disabled) {
  box-shadow: 0 4px 14px rgba(207, 157, 67, 0.4);
}

.package-detail__add-btn:disabled,
.package-detail__checkout-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 900px) {
  .package-detail {
    grid-template-columns: 1fr;
  }
  .package-detail__hero {
    grid-template-columns: 1fr;
  }
  .package-detail__info {
    padding: 1.5rem;
  }
  .package-detail__summary {
    position: static;
  }
}
</style>
