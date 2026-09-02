<script setup>
import { ref, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useBookingsStore } from '@/stores/bookings'

// Shell for the checkout/booking flow — guest count, date selection, summary,
// then POST /api/bookings (see API contract draft, TICKET-013). Payment
// (PayFast redirect) is a later, separate step per the plan's Section 3.1
// (payment is the last swap, not the first) — this page hands off to
// Confirmation.vue once the booking itself is created.

const router = useRouter()
const cart = useCartStore()
const bookings = useBookingsStore()

const guestCount = ref(20)
const eventDate = ref('')
const eventTime = ref('')
const specialRequests = ref('')
const contactName = ref('')
const contactPhone = ref('')

const error = ref('')
const isSubmitting = ref(false)

const today = new Date().toISOString().split('T')[0]

const subtotal = computed(() =>
  cart.items.reduce((sum, pkg) => sum + pkg.base_price * guestCount.value, 0),
)

const serviceFee = computed(() => Math.round(subtotal.value * 0.05))
const total = computed(() => subtotal.value + serviceFee.value)

function removePackage(index) {
  cart.removeItem(index)
}

function handleSubmit() {
  error.value = ''

  if (!cart.items.length) {
    error.value = 'Your cart is empty — add a package before checking out.'
    return
  }
  if (!eventDate.value) {
    error.value = 'Please choose an event date.'
    return
  }
  if (guestCount.value < 1) {
    error.value = 'Guest count must be at least 1.'
    return
  }
  if (!contactName.value || !contactPhone.value) {
    error.value = 'Please add a contact name and phone number.'
    return
  }

  isSubmitting.value = true

  // Stub call — swap for a real POST /api/bookings once wired (TICKET-013/014).
  const booking = {
    event_date: eventDate.value,
    event_time: eventTime.value || null,
    guest_count: guestCount.value,
    special_requests: specialRequests.value || null,
    contact_name: contactName.value,
    contact_phone: contactPhone.value,
    status: 'pending_payment',
    total_amount: total.value,
    items: cart.items,
  }

  bookings.addBooking(booking)
  cart.clear()
  isSubmitting.value = false

  const newBookingId = bookings.bookings[bookings.bookings.length - 1].booking_id
  router.push(`/confirmation/${newBookingId}`)
}
</script>

<template>
  <main id="main-content" class="checkout">
    <header class="checkout__header">
      <h1>Checkout</h1>
      <p>Confirm your guest count and event date, then review your booking summary.</p>
    </header>

    <div v-if="!cart.items.length" class="checkout__empty">
      <p>Your cart is empty.</p>
      <RouterLink to="/packages" class="checkout__browse-link">Browse Packages</RouterLink>
    </div>

    <form v-else class="checkout__layout" @submit.prevent="handleSubmit">
      <div class="checkout__form-col">
        <p v-if="error" class="checkout__error" role="alert">{{ error }}</p>

        <section class="checkout__section">
          <h2 class="checkout__section-title">Event Details</h2>

          <div class="checkout__field-row">
            <label class="checkout__field">
              <span class="checkout__label">Event Date</span>
              <input v-model="eventDate" type="date" :min="today" required />
            </label>

            <label class="checkout__field">
              <span class="checkout__label">Preferred Time</span>
              <input v-model="eventTime" type="time" />
            </label>
          </div>

          <label class="checkout__field">
            <span class="checkout__label">Guest Count</span>
            <div class="checkout__stepper">
              <button
                type="button"
                class="checkout__stepper-btn"
                :disabled="guestCount <= 1"
                @click="guestCount = Math.max(1, guestCount - 5)"
              >
                −
              </button>
              <input v-model.number="guestCount" type="number" min="1" class="checkout__stepper-input" />
              <button type="button" class="checkout__stepper-btn" @click="guestCount += 5">+</button>
            </div>
          </label>

          <label class="checkout__field">
            <span class="checkout__label">Special Requests (optional)</span>
            <textarea
              v-model="specialRequests"
              rows="3"
              placeholder="Dietary requirements, venue access notes, timing preferences..."
            ></textarea>
          </label>
        </section>

        <section class="checkout__section">
          <h2 class="checkout__section-title">Contact Details</h2>

          <div class="checkout__field-row">
            <label class="checkout__field">
              <span class="checkout__label">Full Name</span>
              <input v-model="contactName" type="text" placeholder="Your name" required />
            </label>

            <label class="checkout__field">
              <span class="checkout__label">Phone Number</span>
              <input v-model="contactPhone" type="tel" placeholder="e.g. 082 123 4567" required />
            </label>
          </div>
        </section>
      </div>

      <aside class="checkout__summary">
        <h2 class="checkout__section-title">Booking Summary</h2>

        <ul class="checkout__items">
          <li v-for="(pkg, index) in cart.items" :key="`${pkg.package_id}-${index}`" class="checkout__item">
            <img :src="pkg.image_url" :alt="pkg.name" class="checkout__item-image" />
            <div class="checkout__item-body">
              <p class="checkout__item-name">{{ pkg.name }}</p>
              <p class="checkout__item-meta">R{{ pkg.base_price }} / person</p>
            </div>
            <button
              type="button"
              class="checkout__item-remove"
              aria-label="Remove package"
              @click="removePackage(index)"
            >
              ✕
            </button>
          </li>
        </ul>

        <dl class="checkout__totals">
          <div class="checkout__totals-row">
            <dt>Guests</dt>
            <dd>{{ guestCount }}</dd>
          </div>
          <div class="checkout__totals-row">
            <dt>Subtotal</dt>
            <dd>R{{ subtotal.toLocaleString() }}</dd>
          </div>
          <div class="checkout__totals-row">
            <dt>Service Fee (5%)</dt>
            <dd>R{{ serviceFee.toLocaleString() }}</dd>
          </div>
          <div class="checkout__totals-row checkout__totals-row--total">
            <dt>Total</dt>
            <dd>R{{ total.toLocaleString() }}</dd>
          </div>
        </dl>

        <button type="submit" class="checkout__submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Placing Booking…' : 'Confirm Booking' }}
        </button>
        <p class="checkout__disclaimer">
          You'll be redirected to secure payment after confirming your booking details.
        </p>
      </aside>
    </form>
  </main>
</template>

<style scoped>
.checkout {
  max-width: var(--content-width);
  margin: 0 auto;
  padding: 2.5rem 1.5rem 4rem;
}

.checkout__header {
  margin-bottom: 2rem;
}

.checkout__header h1 {
  font-size: 2rem;
  margin-bottom: 0.4rem;
}

.checkout__header p {
  color: var(--color-muted);
  font-size: 0.95rem;
}

.checkout__empty {
  text-align: center;
  padding: 4rem 0;
  color: var(--color-muted);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.checkout__browse-link {
  background: var(--color-gold);
  color: var(--color-brown-deep);
  font-weight: 600;
  border-radius: var(--radius-full);
  padding: 0.7rem 1.5rem;
}

.checkout__layout {
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: 2rem;
  align-items: start;
}

.checkout__form-col {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.checkout__error {
  background: #fbeaea;
  color: #a63d3d;
  border-radius: var(--radius-sm);
  padding: 0.65rem 0.9rem;
  font-size: 0.85rem;
}

.checkout__section {
  background: var(--color-white);
  border: 1px solid var(--color-line);
  border-radius: var(--radius-md);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.checkout__section-title {
  font-size: 1.15rem;
  margin-bottom: 0.25rem;
}

.checkout__field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.checkout__field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.checkout__label {
  font-size: 0.85rem;
  font-weight: 600;
}

.checkout__field input,
.checkout__field textarea {
  border: 1px solid var(--color-line);
  border-radius: var(--radius-sm);
  padding: 0.7rem 0.9rem;
  font-family: var(--font-body);
  font-size: 0.9rem;
  color: var(--color-ink);
  background: var(--color-white);
}

.checkout__field input:focus,
.checkout__field textarea:focus {
  outline: none;
  border-color: var(--color-gold);
}

.checkout__field textarea {
  resize: vertical;
}

.checkout__stepper {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.checkout__stepper-btn {
  width: 2.4rem;
  height: 2.4rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-line);
  background: var(--color-white);
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-brown);
  flex-shrink: 0;
}

.checkout__stepper-btn:hover:not(:disabled) {
  border-color: var(--color-gold);
  color: var(--color-gold);
}

.checkout__stepper-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.checkout__stepper-input {
  width: 5rem;
  text-align: center;
  border: 1px solid var(--color-line);
  border-radius: var(--radius-sm);
  padding: 0.6rem;
  font-family: var(--font-body);
  font-size: 0.95rem;
}

.checkout__summary {
  background: var(--color-white);
  border: 1px solid var(--color-line);
  border-radius: var(--radius-md);
  padding: 1.5rem;
  position: sticky;
  top: 5.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.checkout__items {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.checkout__item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.checkout__item-image {
  width: 3rem;
  height: 3rem;
  object-fit: cover;
  border-radius: var(--radius-sm);
  flex-shrink: 0;
}

.checkout__item-body {
  flex: 1;
  min-width: 0;
}

.checkout__item-name {
  font-size: 0.9rem;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.checkout__item-meta {
  font-size: 0.8rem;
  color: var(--color-muted);
}

.checkout__item-remove {
  background: none;
  border: none;
  color: var(--color-muted);
  font-size: 0.9rem;
  flex-shrink: 0;
  padding: 0.25rem;
}

.checkout__item-remove:hover {
  color: #a63d3d;
}

.checkout__totals {
  border-top: 1px solid var(--color-line);
  padding-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.checkout__totals-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.88rem;
  color: var(--color-muted);
}

.checkout__totals-row--total {
  border-top: 1px solid var(--color-line);
  padding-top: 0.6rem;
  margin-top: 0.2rem;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--color-ink);
}

.checkout__submit {
  background: var(--color-gold);
  color: var(--color-brown-deep);
  border: none;
  border-radius: var(--radius-sm);
  padding: 0.85rem;
  font-weight: 700;
  font-size: 1rem;
  transition: box-shadow 0.15s ease, transform 0.15s ease;
}

.checkout__submit:hover:not(:disabled) {
  box-shadow: 0 4px 14px rgba(207, 157, 67, 0.4);
  transform: translateY(-1px);
}

.checkout__submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.checkout__disclaimer {
  font-size: 0.78rem;
  color: var(--color-muted);
  text-align: center;
}

@media (max-width: 900px) {
  .checkout__layout {
    grid-template-columns: 1fr;
  }
  .checkout__summary {
    position: static;
  }
}

@media (max-width: 560px) {
  .checkout__field-row {
    grid-template-columns: 1fr;
  }
}
</style>
