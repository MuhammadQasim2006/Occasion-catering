<script setup>
import { computed, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useBookingsStore } from '@/stores/bookings'

// SIMULATED PAYMENT STEP — stands in for the real PayFast sandbox redirect
// until Day 7's payments work lands. Card fields below are cosmetic only;
// nothing is transmitted or stored. To swap this for the real thing:
//   1. Delete this component (or keep it behind a feature flag as the
//      documented fallback — see plan Section 11).
//   2. In Checkout.vue, replace the router.push(`/payment/${id}`) call with
//      a POST to /api/payments/initiate, then build+submit the hidden form
//      that redirects the browser to PayFast's hosted page.
//   3. Confirmation.vue starts polling GET /api/payments/:bookingId instead
//      of reading a status this page already set locally.
// Everything downstream (Confirmation.vue, the bookings store, the status
// badge) already reads from the same `bookings` store either way, so no
// other file needs to change.

const route = useRoute()
const router = useRouter()
const bookings = useBookingsStore()

const bookingId = computed(() => Number(route.params.bookingId))
const booking = computed(
  () => bookings.bookings.find((b) => b.booking_id === bookingId.value) ?? null,
)

const cardName = ref('')
const cardNumber = ref('')
const cardExpiry = ref('')
const cardCvv = ref('')

const errors = ref({})
const isProcessing = ref(false)

function formatCardNumber(event) {
  const digits = event.target.value.replace(/\D/g, '').slice(0, 16)
  cardNumber.value = digits.replace(/(.{4})/g, '$1 ').trim()
}

function formatExpiry(event) {
  const digits = event.target.value.replace(/\D/g, '').slice(0, 4)
  cardExpiry.value = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits
}

function formatCvv(event) {
  cardCvv.value = event.target.value.replace(/\D/g, '').slice(0, 3)
}

function validate() {
  const fieldErrors = {}

  if (!cardName.value.trim()) {
    fieldErrors.cardName = 'Enter the name on the card.'
  }

  const digits = cardNumber.value.replace(/\s/g, '')
  if (digits.length !== 16) {
    fieldErrors.cardNumber = 'Enter a 16-digit card number.'
  }

  const expiryMatch = cardExpiry.value.match(/^(\d{2})\/(\d{2})$/)
  if (!expiryMatch) {
    fieldErrors.cardExpiry = 'Use MM/YY format.'
  } else {
    const month = Number(expiryMatch[1])
    const year = Number(`20${expiryMatch[2]}`)
    const now = new Date()
    const expiryDate = new Date(year, month)
    if (month < 1 || month > 12) {
      fieldErrors.cardExpiry = 'Enter a valid month.'
    } else if (expiryDate < now) {
      fieldErrors.cardExpiry = 'This card has expired.'
    }
  }

  if (cardCvv.value.length !== 3) {
    fieldErrors.cardCvv = 'Enter the 3-digit security code.'
  }

  errors.value = fieldErrors
  return Object.keys(fieldErrors).length === 0
}

const formError = ref('')

function handlePay() {
  formError.value = ''
  if (!validate()) {
    formError.value = "Please check the highlighted fields below — or just click Simulate Successful Payment, this form is cosmetic only."
    return
  }
  simulate('complete')
}

function simulate(outcome) {
  isProcessing.value = true
  setTimeout(() => {
    if (outcome === 'complete') {
      bookings.updateStatus(bookingId.value, 'confirmed')
    } else if (outcome === 'failed') {
      bookings.updateStatus(bookingId.value, 'pending_payment')
    } else {
      bookings.updateStatus(bookingId.value, 'cancelled')
    }
    isProcessing.value = false
    router.push(`/confirmation/${bookingId.value}`)
  }, 900)
}
</script>

<template>
  <main id="main-content" class="payment">
    <div v-if="!booking" class="payment__missing">
      <p>We can't find that booking.</p>
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

      <dl class="payment__summary">
        <div class="payment__summary-row">
          <dt>Amount due</dt>
          <dd>R{{ booking.total_amount.toLocaleString() }}</dd>
        </div>
        <div class="payment__summary-row">
          <dt>Payment method</dt>
          <dd>PayFast (simulated)</dd>
        </div>
      </dl>

      <form class="payment__form" novalidate @submit.prevent="handlePay">
        <label class="payment__field">
          <span class="payment__label">Name on card</span>
          <input
            v-model="cardName"
            type="text"
            placeholder="e.g. Thandeka Nkosi"
            autocomplete="cc-name"
          />
          <span v-if="errors.cardName" class="payment__error">{{ errors.cardName }}</span>
        </label>

        <label class="payment__field">
          <span class="payment__label">Card number</span>
          <input
            :value="cardNumber"
            type="text"
            inputmode="numeric"
            placeholder="4242 4242 4242 4242"
            autocomplete="cc-number"
            @input="formatCardNumber"
          />
          <span v-if="errors.cardNumber" class="payment__error">{{ errors.cardNumber }}</span>
        </label>

        <div class="payment__field-row">
          <label class="payment__field">
            <span class="payment__label">Expiry</span>
            <input
              :value="cardExpiry"
              type="text"
              inputmode="numeric"
              placeholder="MM/YY"
              autocomplete="cc-exp"
              @input="formatExpiry"
            />
            <span v-if="errors.cardExpiry" class="payment__error">{{ errors.cardExpiry }}</span>
          </label>

          <label class="payment__field">
            <span class="payment__label">CVV</span>
            <input
              :value="cardCvv"
              type="text"
              inputmode="numeric"
              placeholder="123"
              autocomplete="cc-csc"
              @input="formatCvv"
            />
            <span v-if="errors.cardCvv" class="payment__error">{{ errors.cardCvv }}</span>
          </label>
        </div>

        <p class="payment__note">
          This form stands in for PayFast's hosted payment page while the real sandbox
          integration is being wired up — no card details are sent anywhere.
        </p>

        <p v-if="formError" class="payment__form-error" role="alert">{{ formError }}</p>

        <button type="submit" class="btn btn--primary" :disabled="isProcessing">
          {{ isProcessing ? 'Processing…' : `Pay R${booking.total_amount.toLocaleString()}` }}
        </button>
      </form>

      <details class="payment__test-actions">
        <summary>Test a different outcome</summary>
        <div class="payment__test-buttons">
          <button
            type="button"
            class="btn btn--secondary"
            :disabled="isProcessing"
            @click="simulate('failed')"
          >
            Simulate Failed Payment
          </button>
          <button
            type="button"
            class="payment__cancel-link"
            :disabled="isProcessing"
            @click="simulate('cancelled')"
          >
            Cancel and return to booking
          </button>
        </div>
      </details>
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
  font-weight: 700;
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
