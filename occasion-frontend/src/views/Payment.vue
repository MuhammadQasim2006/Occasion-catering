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

const loadError = ref('')

async function loadBooking() {
  loadError.value = ''
  try {
    await bookings.fetchBooking(bookingId.value)
  } catch (err) {
    loadError.value = err.message || "We couldn't find that booking."
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
  try {
    const res = await api.post('/payments/initiate', { booking_id: bookingId.value }, auth.token)
    submitToPayFast(res.data.action, res.data.fields)
    // Page is about to navigate away to PayFast.
  } catch (err) {
    loadError.value = err.message || 'Could not start the PayFast payment. Please try again.'
  }
}

onMounted(async () => {
  await loadBooking()
  if (loadError.value) return
  if (!booking.value) {
    loadError.value = "We can't find that booking."
    return
  }
  goToPayFast()
})
</script>

<template>
  <main id="main-content" class="payment">
    <div class="payment__loading">
      <span class="payment__spinner" aria-hidden="true"></span>

      <template v-if="loadError">
        <p class="payment__loading-title">Something went wrong</p>
        <p class="payment__loading-text">{{ loadError }}</p>
        <div class="payment__loading-actions">
          <button type="button" class="btn btn--primary" @click="goToPayFast">Try again</button>
          <RouterLink to="/checkout" class="payment__cancel-link">Back to checkout</RouterLink>
        </div>
      </template>

      <template v-else>
        <p class="payment__loading-title">Redirecting you to PayFast…</p>
        <p class="payment__loading-text">
          Please wait while we take you to PayFast's secure sandbox page to complete your payment.
        </p>
      </template>
    </div>
  </main>
</template>

<style scoped>
.payment {
  width: 100%;
  min-height: 60vh;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  padding: 3.5rem 1.5rem 5rem;
}

.payment__loading {
  width: 100%;
  max-width: 26rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.payment__spinner {
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  border: 3px solid var(--color-line);
  border-top-color: var(--color-gold);
  animation: payment-spin 0.8s linear infinite;
}

@keyframes payment-spin {
  to {
    transform: rotate(360deg);
  }
}

.payment__loading-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--color-ink);
}

.payment__loading-text {
  font-size: 0.9rem;
  color: var(--color-muted);
}

.payment__loading-actions {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
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

.btn--primary:hover {
  box-shadow: 0 4px 14px rgba(207, 157, 67, 0.4);
  transform: translateY(-1px);
}

.payment__cancel-link {
  background: none;
  border: none;
  color: var(--color-muted);
  font-size: 0.85rem;
  padding: 0.4rem;
}

.payment__cancel-link:hover {
  color: #a63d3d;
}
</style>
