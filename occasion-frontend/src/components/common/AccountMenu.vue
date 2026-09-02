<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useBookingsStore } from '@/stores/bookings'

const auth = useAuthStore()
const bookings = useBookingsStore()
const router = useRouter()

const isOpen = ref(false)
const menuRoot = ref(null)

const recentBookings = computed(() =>
  [...bookings.bookings]
    .sort((a, b) => b.booking_id - a.booking_id)
    .slice(0, 3),
)

const statusLabels = {
  pending_payment: 'Pending payment',
  confirmed: 'Confirmed',
  cancelled: 'Cancelled',
  completed: 'Completed',
}

function statusLabel(status) {
  return statusLabels[status] || status
}

function formatDate(dateStr) {
  if (!dateStr) return 'Date TBC'
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
}

function formatAmount(amount) {
  if (amount == null) return ''
  return `R${Number(amount).toLocaleString()}`
}

function toggleMenu() {
  isOpen.value = !isOpen.value
}

function closeMenu() {
  isOpen.value = false
}

function handleLogout() {
  auth.logout()
  closeMenu()
  router.push('/')
}

function handleClickOutside(event) {
  if (menuRoot.value && !menuRoot.value.contains(event.target)) {
    closeMenu()
  }
}

function handleKeydown(event) {
  if (event.key === 'Escape') closeMenu()
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div ref="menuRoot" class="account-menu">
    <button
      type="button"
      class="account-menu__trigger"
      :aria-expanded="isOpen"
      aria-haspopup="true"
      aria-controls="account-menu-panel"
      :title="auth.user?.email"
      @click="toggleMenu"
    >
      <span class="account-menu__dot" aria-hidden="true"></span>
      <span class="account-menu__email">{{ auth.user?.email }}</span>
      <svg
        class="account-menu__chevron"
        :class="{ 'account-menu__chevron--open': isOpen }"
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path d="m6 9 6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>

    <Transition name="account-menu-fade">
      <div v-if="isOpen" id="account-menu-panel" class="account-menu__panel" role="menu">
        <div class="account-menu__section account-menu__details">
          <p class="account-menu__section-title">Account details</p>
          <p class="account-menu__name">{{ auth.user?.email }}</p>
          <p class="account-menu__role">{{ auth.user?.role || 'customer' }}</p>
        </div>

        <div class="account-menu__divider"></div>

        <div class="account-menu__section">
          <div class="account-menu__section-header">
            <p class="account-menu__section-title">Recent bookings</p>
            <RouterLink to="/bookings" class="account-menu__view-all" @click="closeMenu">
              View all
            </RouterLink>
          </div>

          <ul v-if="recentBookings.length" class="account-menu__bookings">
            <li v-for="booking in recentBookings" :key="booking.booking_id" class="account-menu__booking">
              <div class="account-menu__booking-main">
                <span class="account-menu__booking-date">{{ formatDate(booking.event_date) }}</span>
                <span
                  class="account-menu__booking-status"
                  :class="`account-menu__booking-status--${booking.status}`"
                >
                  {{ statusLabel(booking.status) }}
                </span>
              </div>
              <div class="account-menu__booking-meta">
                <span>{{ booking.guest_count }} guests</span>
                <span v-if="booking.total_amount != null">{{ formatAmount(booking.total_amount) }}</span>
              </div>
            </li>
          </ul>
          <p v-else class="account-menu__empty">No bookings yet.</p>
        </div>

        <div class="account-menu__divider"></div>

        <RouterLink to="/dashboard" class="account-menu__item" role="menuitem" @click="closeMenu">
          Dashboard
        </RouterLink>
        <RouterLink to="/bookings" class="account-menu__item" role="menuitem" @click="closeMenu">
          Booking history
        </RouterLink>
        <button type="button" class="account-menu__item account-menu__item--logout" role="menuitem" @click="handleLogout">
          Logout
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.account-menu {
  position: relative;
}

.account-menu__trigger {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  background: none;
  border: 1px solid var(--color-line);
  border-radius: var(--radius-full);
  padding: 0.45rem 0.7rem;
  font-size: 0.85rem;
  font-weight: 500;
  font-family: var(--font-body);
  color: var(--color-ink);
  max-width: 200px;
}

.account-menu__dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: #3e9a5f;
  flex-shrink: 0;
}

.account-menu__email {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.account-menu__chevron {
  flex-shrink: 0;
  color: var(--color-muted);
  transition: transform 0.15s ease;
}

.account-menu__chevron--open {
  transform: rotate(180deg);
}

.account-menu__panel {
  position: absolute;
  top: calc(100% + 0.6rem);
  right: 0;
  width: 300px;
  background: var(--color-white);
  border: 1px solid var(--color-line);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
  padding: 1rem;
  z-index: 60;
}

.account-menu__section {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.account-menu__section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.account-menu__section-title {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-muted);
}

.account-menu__name {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-ink);
  overflow-wrap: anywhere;
}

.account-menu__role {
  font-size: 0.8rem;
  color: var(--color-muted);
  text-transform: capitalize;
}

.account-menu__view-all {
  font-size: 0.78rem;
  font-weight: 500;
  color: var(--color-gold);
}

.account-menu__divider {
  height: 1px;
  background: var(--color-line);
  margin: 0.85rem 0;
}

.account-menu__bookings {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.account-menu__booking {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  padding: 0.55rem 0.65rem;
  background: var(--color-cream-soft);
  border-radius: var(--radius-sm);
}

.account-menu__booking-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.account-menu__booking-date {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-ink);
}

.account-menu__booking-status {
  font-size: 0.68rem;
  font-weight: 600;
  padding: 0.15rem 0.5rem;
  border-radius: var(--radius-full);
  white-space: nowrap;
  background: var(--color-line);
  color: var(--color-muted);
}

.account-menu__booking-status--confirmed {
  background: #e2f3e6;
  color: #2f7a45;
}

.account-menu__booking-status--pending_payment {
  background: #fbecd2;
  color: #a4700f;
}

.account-menu__booking-status--cancelled {
  background: #f7dede;
  color: #b23a3a;
}

.account-menu__booking-status--completed {
  background: #e4e7f7;
  color: #40509e;
}

.account-menu__booking-meta {
  display: flex;
  gap: 0.75rem;
  font-size: 0.78rem;
  color: var(--color-muted);
}

.account-menu__empty {
  font-size: 0.85rem;
  color: var(--color-muted);
}

.account-menu__item {
  display: block;
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  font-family: var(--font-body);
  font-size: 0.88rem;
  font-weight: 500;
  color: var(--color-ink);
  padding: 0.55rem 0.4rem;
  border-radius: var(--radius-sm);
}

.account-menu__item:hover {
  background: var(--color-cream-soft);
}

.account-menu__item--logout {
  color: #b23a3a;
}

.account-menu-fade-enter-active,
.account-menu-fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.account-menu-fade-enter-from,
.account-menu-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

@media (prefers-reduced-motion: reduce) {
  .account-menu-fade-enter-active,
  .account-menu-fade-leave-active,
  .account-menu__chevron {
    transition: none;
  }
}

@media (max-width: 880px) {
  .account-menu__email {
    display: none;
  }
  .account-menu__trigger {
    padding: 0.5rem;
  }
}

@media (max-width: 720px) {
  .account-menu {
    display: none;
  }
}
</style>
