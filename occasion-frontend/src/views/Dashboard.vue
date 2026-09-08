<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useBookingsStore } from '@/stores/bookings'
import { useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'
import { packages } from '@/data/mockPackages'

// Logged-in customer dashboard. Reads from the auth, bookings, cart, and
// wishlist Pinia stores (TICKET-006) — a real GET /api/bookings and
// GET /api/auth/me will replace the mock/local data these stores hold, but
// this page's shape (greeting, quick stats, upcoming booking, quick links)
// shouldn't need to change when that swap happens.

const auth = useAuthStore()
const bookings = useBookingsStore()
const cart = useCartStore()
const wishlist = useWishlistStore()

const firstName = computed(() => {
  const email = auth.user?.email || ''
  const localPart = email.split('@')[0] || 'there'
  return localPart.charAt(0).toUpperCase() + localPart.slice(1)
})

const upcomingBookings = computed(() =>
  bookings.bookings
    .filter((b) => b.status === 'confirmed' || b.status === 'pending_payment')
    .sort((a, b) => new Date(a.event_date) - new Date(b.event_date)),
)

const nextBooking = computed(() => upcomingBookings.value[0] ?? null)

const stats = computed(() => [
  { label: 'Upcoming bookings', value: upcomingBookings.value.length, to: '/bookings' },
  { label: 'Items in cart', value: cart.count, to: '/cart' },
  { label: 'Saved packages', value: wishlist.count, to: '/packages' },
])

const wishlistPreview = computed(() =>
  wishlist.packageIds
    .map((id) => packages.find((pkg) => pkg.package_id === id))
    .filter(Boolean)
    .slice(0, 3),
)

function statusLabel(status) {
  return (
    {
      confirmed: 'Upcoming',
      pending_payment: 'Payment Pending',
      completed: 'Completed',
      cancelled: 'Cancelled',
    }[status] || status
  )
}

function formatDate(dateStr) {
  if (!dateStr) return 'Date TBC'
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString('en-ZA', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
</script>

<template>
  <main id="main-content" class="dashboard">
    <header class="dashboard__header">
      <p class="dashboard__eyebrow">My Account</p>
      <h1>Welcome back, {{ firstName }}</h1>
      <p class="dashboard__subtitle">Here's a quick look at your bookings and saved packages.</p>
    </header>

    <div class="dashboard__stats">
      <RouterLink v-for="stat in stats" :key="stat.label" :to="stat.to" class="dashboard__stat">
        <span class="dashboard__stat-value">{{ stat.value }}</span>
        <span class="dashboard__stat-label">{{ stat.label }}</span>
      </RouterLink>
    </div>

    <div class="dashboard__grid">
      <section class="dashboard__card">
        <div class="dashboard__card-header">
          <h2>Next Up</h2>
          <RouterLink to="/bookings" class="dashboard__view-all">View all bookings</RouterLink>
        </div>

        <div v-if="nextBooking" class="dashboard__booking">
          <div class="dashboard__booking-top">
            <span class="dashboard__booking-id">Booking #{{ nextBooking.booking_id }}</span>
            <span
              class="dashboard__booking-status"
              :class="`dashboard__booking-status--${nextBooking.status}`"
            >
              {{ statusLabel(nextBooking.status) }}
            </span>
          </div>
          <p class="dashboard__booking-date">{{ formatDate(nextBooking.event_date) }}</p>
          <p class="dashboard__booking-meta">
            {{ nextBooking.guest_count }} guests
            <span v-if="nextBooking.items?.length">
              · {{ nextBooking.items.map((item) => item.name).join(', ') }}
            </span>
          </p>
          <RouterLink
            v-if="nextBooking.status === 'pending_payment'"
            :to="`/payment/${nextBooking.booking_id}`"
            class="dashboard__booking-cta"
          >
            Complete Payment →
          </RouterLink>
        </div>
        <div v-else class="dashboard__empty">
          <p>No upcoming bookings yet.</p>
          <RouterLink to="/packages" class="dashboard__empty-link">Browse Packages</RouterLink>
        </div>
      </section>

      <section class="dashboard__card">
        <div class="dashboard__card-header">
          <h2>Saved Packages</h2>
          <RouterLink to="/packages" class="dashboard__view-all">Browse more</RouterLink>
        </div>

        <ul v-if="wishlistPreview.length" class="dashboard__wishlist">
          <li v-for="pkg in wishlistPreview" :key="pkg.package_id" class="dashboard__wishlist-item">
            <RouterLink :to="`/packages/${pkg.package_id}`" class="dashboard__wishlist-link">
              <img :src="pkg.image_url" :alt="pkg.name" class="dashboard__wishlist-image" />
              <div>
                <p class="dashboard__wishlist-name">{{ pkg.name }}</p>
                <p class="dashboard__wishlist-price">R{{ pkg.base_price }} / person</p>
              </div>
            </RouterLink>
          </li>
        </ul>
        <div v-else class="dashboard__empty">
          <p>You haven't saved any packages yet.</p>
          <RouterLink to="/packages" class="dashboard__empty-link">Browse Packages</RouterLink>
        </div>
      </section>
    </div>

    <section class="dashboard__quick-links">
      <RouterLink to="/bookings" class="dashboard__quick-link">Booking History</RouterLink>
      <RouterLink to="/cart" class="dashboard__quick-link">View Cart</RouterLink>
      <RouterLink to="/packages" class="dashboard__quick-link">Browse Packages</RouterLink>
    </section>
  </main>
</template>

<style scoped>
.dashboard {
  max-width: var(--content-width);
  margin: 0 auto;
  padding: 3rem 1.5rem 4rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.dashboard__header h1 {
  font-size: 2rem;
  margin-top: 0.2rem;
}

.dashboard__eyebrow {
  color: var(--color-gold);
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.04em;
}

.dashboard__subtitle {
  color: var(--color-muted);
  margin-top: 0.4rem;
}

.dashboard__stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.dashboard__stat {
  background: var(--color-white);
  border: 1px solid var(--color-line);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.dashboard__stat:hover {
  border-color: var(--color-gold);
}

.dashboard__stat-value {
  font-family: var(--font-display);
  font-size: 1.9rem;
  font-weight: 700;
  color: var(--color-ink);
}

.dashboard__stat-label {
  font-size: 0.85rem;
  color: var(--color-muted);
}

.dashboard__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}

.dashboard__card {
  background: var(--color-white);
  border: 1px solid var(--color-line);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.dashboard__card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dashboard__card-header h2 {
  font-size: 1.15rem;
}

.dashboard__view-all {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-gold);
}

.dashboard__booking-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.dashboard__booking-id {
  font-size: 0.8rem;
  color: var(--color-muted);
  font-weight: 600;
}

.dashboard__booking-status {
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.25rem 0.65rem;
  border-radius: var(--radius-full);
  text-transform: uppercase;
  letter-spacing: 0.03em;
  background: var(--color-cream-soft);
  color: var(--color-brown);
}

.dashboard__booking-status--confirmed {
  background: #e6f0e9;
  color: var(--color-forest);
}

.dashboard__booking-status--pending_payment {
  background: #fbf1de;
  color: #92670f;
}

.dashboard__booking-date {
  font-size: 1.15rem;
  font-weight: 700;
  margin-bottom: 0.2rem;
}

.dashboard__booking-meta {
  color: var(--color-muted);
  font-size: 0.88rem;
}

.dashboard__booking-cta {
  display: inline-block;
  margin-top: 1rem;
  background: var(--color-gold);
  color: var(--color-brown-deep);
  font-weight: 700;
  border-radius: var(--radius-sm);
  padding: 0.6rem 1rem;
  font-size: 0.85rem;
}

.dashboard__empty {
  text-align: center;
  padding: 1.5rem 0;
  color: var(--color-muted);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.dashboard__empty-link {
  background: var(--color-gold);
  color: var(--color-brown-deep);
  font-weight: 600;
  border-radius: var(--radius-full);
  padding: 0.6rem 1.25rem;
  font-size: 0.85rem;
}

.dashboard__wishlist {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.dashboard__wishlist-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.dashboard__wishlist-image {
  width: 3rem;
  height: 3rem;
  object-fit: cover;
  border-radius: var(--radius-sm);
  flex-shrink: 0;
}

.dashboard__wishlist-name {
  font-size: 0.9rem;
  font-weight: 600;
}

.dashboard__wishlist-price {
  font-size: 0.8rem;
  color: var(--color-muted);
}

.dashboard__quick-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.dashboard__quick-link {
  border: 1px solid var(--color-line);
  border-radius: var(--radius-full);
  padding: 0.6rem 1.25rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-brown);
}

.dashboard__quick-link:hover {
  border-color: var(--color-gold);
  color: var(--color-gold);
}

@media (max-width: 720px) {
  .dashboard__stats {
    grid-template-columns: 1fr;
  }
  .dashboard__grid {
    grid-template-columns: 1fr;
  }
}
</style>
