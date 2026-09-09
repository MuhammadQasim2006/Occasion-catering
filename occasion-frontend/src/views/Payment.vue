<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useBookingsStore } from '@/stores/bookings'
import { useAuthStore } from '@/stores/auth'
import { api } from '@/utils/api'

// Real PayFast sandbox handoff: fetch the booking, call
// POST /api/payments/initiate for the signed field set, then auto-submit a
// hidden form to PayFast's hosted page (PROCESS_URL). PayFast redirects the
// browser back to return_url/cancel_url (Confirmation.vue) once the
// customer finishes there, and separately posts the ITN webhook straight
// to the backend to actually confirm the booking.

const route = useRoute()
const bookings = useBookingsStore()
const auth = useAuthStore()

const bookingId = computed(() => Number(route.params.bookingId))
const booking = computed(
  () => bookings.bookings.find((b) => b.booking_id === bookingId.value) ?? null,
)

const isLoading = ref(true)
const isRedirecting = ref(false)
const loadError = ref('')

async function loadBooking() {
  loadError.value = ''
  isLoading.value = true
  try {
    await bookings.fetchBooking(bookingId.value)
  } catch (err) {
    loadError.value = err.message || "We couldn't find that booking."
  } finally {
    isLoading.value = false
  }
}

// Builds a real <form> and submits it so the browser navigates to
// PayFast's hosted page with all the signed fields as POST data — this is
// the standard PayFast "onsite payment" redirect pattern, not an API call
// we read a response from.
function submitToPayFast(action, fields) {
  const form = document.createElement('form')
  form.method = 'POST'
  form.action = action

  Object.entries(fields).forEach(([name, value]) => {
    const input = document.createElement('input')
    input.type = 'hidden'
    input.name = name
    input.value = value
    form.appendChild(input)
  })

  document.body.appendChild(form)
  form.submit()
}

async function goToPayFast() {
  loadError.value = ''
  isRedirecting.value = true
  try {
    const res = await api.post('/payments/initiate', { booking_id: bookingId.value }, auth.token)
    submitToPayFast(res.data.action, res.data.fields)
    // Leaving isRedirecting true — the page is about to navigate away.
  } catch (err) {
    loadError.value = err.message || 'Could not start the PayFast payment. Please try again.'
    isRedirecting.value = false
  }
}

onMounted(async () => {
  await loadBooking()
  if (booking.value && booking.value.status === 'pending_payment') {
    goToPayFast()
  }
})
</script>

<template>
  <main id="main-content" class="payment">
    <div v-if="isLoading" class="payment__missing">
      <p>Loading your booking…</p>
    </div>

    <div v-else-if="!booking || loadError" class="payment__missing">
      <p>{{ loadError || "We can't find that booking." }}</p>
      <RouterLink to="/checkout" class="btn btn--primary">Back to Checkout</RouterLink>
    </div>

    <div v-else class="payment__card">
      <div class="payment__sandbox-banner">
        <i class="payment__sandbox-dot" aria-hidden="true"></i>
        Sandbox mode — no real payment will be taken
      </div>

      <header class="payment__header">
        <p class="payment__eyebrow">Occasion Checkout</p>
        <h1 class="payment__title">Complete your payment</h1>
        <p class="payment__subtitle">Booking #{{ booking.booking_id }}</p>
      </header>

      <ul v-if="booking.items?.length" class="payment__items">
        <li v-for="(pkg, index) in booking.items" :key="`${pkg.package_id}-${index}`" class="payment__item">
          <img :src="pkg.image_url" :alt="pkg.name" class="payment__item-image" />
          <div>
            <p class="payment__item-name">{{ pkg.name }}</p>
            <p class="payment__item-meta">
              {{ pkg.guest_count || booking.guest_count }} guests · R{{ pkg.base_price }} / person
            </p>
          </div>
        </li>
      </ul>

      <dl class="payment__summary">
        <div v-if="booking.event_date" class="payment__summary-row">
          <dt>Event date</dt>
          <dd>
            {{
              new Date(`${booking.event_date}T00:00:00`).toLocaleDateString('en-ZA', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })
            }}
          </dd>
        </div>
        <div v-if="booking.discount_amount" class="payment__summary-row">
          <dt>Discount{{ booking.coupon_code ? ` (${booking.coupon_code})` : '' }}</dt>
          <dd>−R{{ booking.discount_amount.toLocaleString() }}</dd>
        </div>
        <div class="payment__summary-row payment__summary-row--total">
          <dt>Amount due</dt>
          <dd>R{{ booking.total_amount.toLocaleString() }}</dd>
        </div>
        <div class="payment__summary-row">
          <dt>Payment method</dt>
          <dd>PayFast (sandbox)</dd>
        </div>
      </dl>

      <p v-if="loadError" class="payment__form-error" role="alert">{{ loadError }}</p>

      <div class="payment__redirect">
        <p class="payment__note">
          You'll be taken to PayFast's secure sandbox page to complete this payment. Once
          you're done there, PayFast sends you back here automatically.
        </p>
        <button
          type="button"
          class="btn btn--primary"
          :disabled="isRedirecting"
          @click="goToPayFast"
        >
          {{ isRedirecting ? 'Redirecting to PayFast…' : `Pay R${booking.total_amount.toLocaleString()} with PayFast` }}
        </button>
        <RouterLink to="/checkout" class="payment__cancel-link">
          Cancel and return to checkout
        </RouterLink>
      </div>
    </div>
  </main>
</template>

<style scoped>
.payment {
  width: 100%;
  display: flex;
  justify-content: center;
  box-sizing: border-box;
  padding: 3.5rem 1.5rem 5rem;
}

.payment__card,
.payment__missing {
  width: 100%;
  max-width: 30rem;
}

.payment__missing {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: var(--color-muted);
}

.payment__card {
  background: var(--color-white);
  border: 1px solid var(--color-line);
  border-radius: var(--radius-md);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.payment__sandbox-banner {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f7ead0;
  color: #8a5a10;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.55rem 0.9rem;
  border-radius: var(--radius-sm);
}

.payment__sandbox-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: #c98a1d;
  flex-shrink: 0;
}

.payment__eyebrow {
  color: var(--color-gold);
  font-weight: 600;
  font-size: 0.8rem;
  margin-bottom: 0.3rem;
}

.payment__title {
  font-size: 1.6rem;
  margin-bottom: 0.3rem;
}

.payment__subtitle {
  color: var(--color-muted);
  font-size: 0.9rem;
}

.payment__summary {
  border-top: 1px solid var(--color-line);
  border-bottom: 1px solid var(--color-line);
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.payment__summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.92rem;
}

.payment__summary-row dt {
  color: var(--color-muted);
}

.payment__summary-row dd {
  font-weight: 500;
}

.payment__summary-row--total dd {
  font-weight: 700;
  font-size: 1.05rem;
}

.payment__items {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem 0 0;
}

.payment__item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.payment__item-image {
  width: 3rem;
  height: 3rem;
  object-fit: cover;
  border-radius: var(--radius-sm);
  flex-shrink: 0;
}

.payment__item-name {
  font-size: 0.88rem;
  font-weight: 600;
}

.payment__item-meta {
  font-size: 0.78rem;
  color: var(--color-muted);
}

.payment__form {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.payment__field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.payment__field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.payment__label {
  font-size: 0.85rem;
  font-weight: 600;
}

.payment__field input {
  border: 1px solid var(--color-line);
  border-radius: var(--radius-sm);
  padding: 0.7rem 0.9rem;
  font-family: var(--font-body);
  font-size: 0.9rem;
  color: var(--color-ink);
  background: var(--color-white);
}

.payment__field input:focus {
  outline: none;
  border-color: var(--color-gold);
}

.payment__error {
  font-size: 0.78rem;
  color: #a63d3d;
}

.payment__note {
  font-size: 0.85rem;
  color: var(--color-muted);
}

.payment__form-error {
  font-size: 0.85rem;
  font-weight: 600;
  color: #a63d3d;
  background: #fbeeee;
  border: 1px solid #f0d4d4;
  border-radius: var(--radius-sm);
  padding: 0.7rem 0.9rem;
}

.payment__test-actions {
  border-top: 1px solid var(--color-line);
  padding-top: 1rem;
}

.payment__test-actions summary {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-muted);
  cursor: pointer;
}

.payment__test-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  padding: 0.8rem 1.6rem;
  font-weight: 700;
  font-size: 0.95rem;
  border: none;
  width: 100%;
}

.btn--primary {
  background: var(--color-gold);
  color: var(--color-brown-deep);
  transition: box-shadow 0.15s ease, transform 0.15s ease;
}

.btn--primary:hover:not(:disabled) {
  box-shadow: 0 4px 14px rgba(207, 157, 67, 0.4);
  transform: translateY(-1px);
}

.btn--secondary {
  background: transparent;
  color: var(--color-brown);
  border: 1px solid var(--color-line);
}

.btn--secondary:hover:not(:disabled) {
  border-color: var(--color-gold);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.payment__cancel-link {
  background: none;
  border: none;
  color: var(--color-muted);
  font-size: 0.85rem;
  padding: 0.4rem;
}

.payment__cancel-link:hover:not(:disabled) {
  color: #a63d3d;
}

@media (max-width: 480px) {
  .payment__field-row {
    grid-template-columns: 1fr;
  }
}
</style>
