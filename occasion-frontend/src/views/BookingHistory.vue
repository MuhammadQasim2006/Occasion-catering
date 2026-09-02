<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useBookingsStore } from '@/stores/bookings'

// GET /api/bookings (logged-in customer's bookings). Reads from the bookings
// Pinia store (TICKET-006) — swap the store's mock rows for a real fetch once
// the endpoint lands.
const bookingsStore = useBookingsStore()

const filter = ref('all')
const filters = [
  { value: 'all', label: 'All' },
  { value: 'confirmed', label: 'Upcoming' },
  { value: 'completed', label: 'Past' },
  { value: 'cancelled', label: 'Cancelled' },
]

const sortedBookings = computed(() =>
  [...bookingsStore.bookings].sort((a, b) => new Date(b.event_date) - new Date(a.event_date)),
)

const filteredBookings = computed(() => {
  if (filter.value === 'all') return sortedBookings.value
  return sortedBookings.value.filter((b) => b.status === filter.value)
})

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
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function canCancel(booking) {
  return booking.status === 'confirmed' || booking.status === 'pending_payment'
}

function handleCancel(bookingId) {
  bookingsStore.cancelBooking(bookingId)
}
</script>

<template>
  <main id="main-content" class="history">
    <header class="history__header">
      <h1>Booking History</h1>
      <p>Track your upcoming events and look back on past bookings.</p>
    </header>

    <div class="history__filters" role="tablist">
      <button
        v-for="f in filters"
        :key="f.value"
        type="button"
        class="history__filter"
        :class="{ 'history__filter--active': filter === f.value }"
        role="tab"
        :aria-selected="filter === f.value"
        @click="filter = f.value"
      >
        {{ f.label }}
      </button>
    </div>

    <div v-if="!filteredBookings.length" class="history__empty">
      <p>{{ bookingsStore.bookings.length ? 'No bookings in this category yet.' : "You haven't made any bookings yet." }}</p>
      <RouterLink to="/packages" class="history__browse-link">Browse Packages</RouterLink>
    </div>

    <ul v-else class="history__list">
      <li v-for="booking in filteredBookings" :key="booking.booking_id" class="history__card">
        <div class="history__card-main">
          <div class="history__card-top">
            <span class="history__id">Booking #{{ booking.booking_id }}</span>
            <span
              class="history__status"
              :class="`history__status--${booking.status}`"
            >
              {{ statusLabel(booking.status) }}
            </span>
          </div>

          <h2 class="history__date">{{ formatDate(booking.event_date) }}</h2>

          <p class="history__meta">
            {{ booking.guest_count }} guests
            <span v-if="booking.event_time"> · {{ booking.event_time }}</span>
          </p>

          <ul class="history__items">
            <li v-for="(pkg, index) in booking.items" :key="`${pkg.package_id}-${index}`" class="history__item">
              <img :src="pkg.image_url" :alt="pkg.name" class="history__item-image" />
              <span class="history__item-name">{{ pkg.name }}</span>
            </li>
          </ul>

          <p v-if="booking.special_requests" class="history__requests">
            <strong>Special requests:</strong> {{ booking.special_requests }}
          </p>
        </div>

        <div class="history__card-side">
          <p class="history__total-label">Total</p>
          <p class="history__total">R{{ booking.total_amount.toLocaleString() }}</p>
          <button
            v-if="canCancel(booking)"
            type="button"
            class="history__cancel"
            @click="handleCancel(booking.booking_id)"
          >
            Cancel Booking
          </button>
        </div>
      </li>
    </ul>
  </main>
</template>

<style scoped>
.history {
  max-width: var(--content-width);
  margin: 0 auto;
  padding: 2.5rem 1.5rem 4rem;
}

.history__header {
  margin-bottom: 1.75rem;
}

.history__header h1 {
  font-size: 2rem;
  margin-bottom: 0.4rem;
}

.history__header p {
  color: var(--color-muted);
  font-size: 0.95rem;
}

.history__filters {
  display: flex;
  gap: 0.6rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.history__filter {
  background: var(--color-white);
  border: 1px solid var(--color-line);
  border-radius: var(--radius-full);
  padding: 0.5rem 1.1rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-muted);
}

.history__filter:hover {
  border-color: var(--color-gold);
  color: var(--color-ink);
}

.history__filter--active {
  background: var(--color-brown-deep);
  border-color: var(--color-brown-deep);
  color: var(--color-cream);
}

.history__empty {
  text-align: center;
  padding: 4rem 0;
  color: var(--color-muted);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.history__browse-link {
  background: var(--color-gold);
  color: var(--color-brown-deep);
  font-weight: 600;
  border-radius: var(--radius-full);
  padding: 0.7rem 1.5rem;
}

.history__list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.history__card {
  background: var(--color-white);
  border: 1px solid var(--color-line);
  border-radius: var(--radius-md);
  padding: 1.5rem;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1.5rem;
  box-shadow: var(--shadow-card);
}

.history__card-top {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.history__id {
  font-size: 0.8rem;
  color: var(--color-muted);
  font-weight: 600;
}

.history__status {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.7rem;
  border-radius: var(--radius-full);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.history__status--confirmed {
  background: #e6f0e9;
  color: var(--color-forest);
}

.history__status--pending_payment {
  background: #fbf1de;
  color: #92670f;
}

.history__status--completed {
  background: var(--color-cream-soft);
  color: var(--color-brown);
}

.history__status--cancelled {
  background: #fbeaea;
  color: #a63d3d;
}

.history__date {
  font-size: 1.3rem;
  margin-bottom: 0.25rem;
}

.history__meta {
  color: var(--color-muted);
  font-size: 0.88rem;
  margin-bottom: 1rem;
}

.history__items {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.history__item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--color-cream-soft);
  border-radius: var(--radius-full);
  padding: 0.3rem 0.8rem 0.3rem 0.3rem;
}

.history__item-image {
  width: 1.75rem;
  height: 1.75rem;
  object-fit: cover;
  border-radius: 50%;
}

.history__item-name {
  font-size: 0.82rem;
  font-weight: 600;
}

.history__requests {
  font-size: 0.85rem;
  color: var(--color-muted);
}

.history__card-side {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  text-align: right;
  gap: 0.75rem;
  min-width: 9rem;
}

.history__total-label {
  font-size: 0.78rem;
  color: var(--color-muted);
}

.history__total {
  font-size: 1.4rem;
  font-weight: 700;
  font-family: var(--font-display);
}

.history__cancel {
  background: none;
  border: 1px solid var(--color-line);
  border-radius: var(--radius-sm);
  padding: 0.5rem 0.9rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: #a63d3d;
  white-space: nowrap;
}

.history__cancel:hover {
  border-color: #a63d3d;
  background: #fbeaea;
}

@media (max-width: 640px) {
  .history__card {
    grid-template-columns: 1fr;
  }

  .history__card-side {
    align-items: flex-start;
    text-align: left;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
  }
}
</style>
