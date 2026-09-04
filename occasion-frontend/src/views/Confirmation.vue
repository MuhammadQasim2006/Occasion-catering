<script setup>
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useBookingsStore } from '@/stores/bookings'

// Post-booking confirmation screen. Once payment goes live (Day 7,
// PayFast initiate/notify), this view will poll GET /api/payments/:bookingId
// after the sandbox redirect and swap the status badge below from mock data
// to the live Payments.status value — see plan Section 5's payment flow note.

const route = useRoute()
const bookings = useBookingsStore()

const bookingId = computed(() => Number(route.params.bookingId))

const booking = computed(
  () => bookings.bookings.find((b) => b.booking_id === bookingId.value) ?? null,
)

const guestCount = computed(() => booking.value?.guest_count ?? 0)

const formattedDate = computed(() => {
  if (!booking.value?.event_date) return '—'
  return new Date(`${booking.value.event_date}T00:00:00`).toLocaleDateString('en-ZA', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
})

const statusCopy = {
  pending_payment: { label: 'Payment Pending', tone: 'pending' },
  confirmed: { label: 'Confirmed', tone: 'confirmed' },
  completed: { label: 'Completed', tone: 'confirmed' },
  cancelled: { label: 'Cancelled', tone: 'cancelled' },
}

const status = computed(
  () => statusCopy[booking.value?.status] ?? { label: 'Pending Payment', tone: 'pending' },
)

// Payment now happens on the simulated Payment.vue step, before the
// customer ever lands here — so "what happens next" has to reflect
// whatever that outcome actually was, not assume payment is still ahead.
// Once real ITN handling lands (Day 7), swap 'confirmed' from a static
// booking.status read to whatever GET /api/payments/:bookingId returns.
const nextSteps = computed(() => {
  const bookingStatus = booking.value?.status

  if (bookingStatus === 'confirmed' || bookingStatus === 'completed') {
    return [
      {
        title: 'Payment received',
        copy: 'Your PayFast payment has gone through and your date is locked in.',
      },
      {
        title: 'We prepare your booking',
        copy: 'Our team checks your package and guest count against availability.',
      },
      {
        title: "You'll get a call or email",
        copy: "We'll confirm final details and any menu customisations within 24 hours.",
      },
    ]
  }

  if (bookingStatus === 'cancelled') {
    return [
      {
        title: 'Payment was cancelled',
        copy: "You cancelled before paying, so this booking hasn't been secured.",
      },
      {
        title: 'Your details are saved',
        copy: 'Your event details are still in your booking history if you want to pick up where you left off.',
      },
      {
        title: 'Try again anytime',
        copy: 'Head back to checkout to restart payment and confirm your date.',
      },
    ]
  }

  // pending_payment — payment attempt failed or hasn't been made yet
  return [
    {
      title: "Payment didn't go through",
      copy: "Your booking is saved, but we couldn't confirm payment.",
    },
    {
      title: 'Nothing is charged',
      copy: 'No funds have been taken — you can safely try again.',
    },
    {
      title: 'Retry to secure your date',
      copy: "Complete payment to lock in your date before it's released.",
    },
  ]
})

const heroCopy = computed(() => {
  const bookingStatus = booking.value?.status

  if (bookingStatus === 'confirmed' || bookingStatus === 'completed') {
    return {
      eyebrow: 'Payment Received',
      title: "You're all set",
      subtitle: `Reference #${booking.value.booking_id} — a confirmation has been sent to the email on file. Keep this number for your records.`,
    }
  }
  if (bookingStatus === 'cancelled') {
    return {
      eyebrow: 'Payment Cancelled',
      title: 'Your date is not secured yet',
      subtitle: `Reference #${booking.value.booking_id} — you left checkout before paying, so this booking hasn't been confirmed.`,
    }
  }
  return {
    eyebrow: 'Payment Needed',
    title: "Almost there — payment didn't complete",
    subtitle: `Reference #${booking.value.booking_id} — your booking details are saved, but we still need payment to confirm your date.`,
  }
})
</script>

<template>
  <main id="main-content" class="confirmation">
    <section class="confirmation__band">
      <div
        class="confirmation__mark"
        :class="`confirmation__mark--${status.tone}`"
        aria-hidden="true"
      >
        <svg v-if="status.tone === 'confirmed'" width="30" height="30" viewBox="0 0 24 24" fill="none">
          <path
            d="M4 12.5 9.5 18 20 6"
            stroke="var(--color-cream)"
            stroke-width="2.4"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <svg v-else width="30" height="30" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 8v5"
            stroke="var(--color-cream)"
            stroke-width="2.4"
            stroke-linecap="round"
          />
          <circle cx="12" cy="16.2" r="0.2" stroke="var(--color-cream)" stroke-width="2.4" stroke-linecap="round" />
        </svg>
      </div>
      <p class="confirmation__eyebrow">{{ booking ? heroCopy.eyebrow : 'Booking Not Found' }}</p>
      <h1 class="confirmation__title">
        {{ booking ? heroCopy.title : "We can't find that booking" }}
      </h1>
      <p class="confirmation__subtitle" v-if="booking">
        {{ heroCopy.subtitle }}
      </p>
      <p class="confirmation__subtitle" v-else>
        The booking link looks incorrect or has expired. Check your booking history or start a
        new one from Packages.
      </p>
    </section>

    <section v-if="booking" class="confirmation__body">
      <div class="confirmation__col confirmation__col--main">
        <div class="confirmation__card">
          <div class="confirmation__card-header">
            <h2>Booking Details</h2>
            <span class="confirmation__status" :class="`confirmation__status--${status.tone}`">
              {{ status.label }}
            </span>
          </div>

          <dl class="confirmation__grid">
            <div class="confirmation__grid-item">
              <dt>Event Date</dt>
              <dd>{{ formattedDate }}</dd>
            </div>
            <div class="confirmation__grid-item">
              <dt>Time</dt>
              <dd>{{ booking.event_time || 'Not specified' }}</dd>
            </div>
            <div class="confirmation__grid-item">
              <dt>Guests</dt>
              <dd>{{ guestCount }}</dd>
            </div>
            <div class="confirmation__grid-item">
              <dt>Contact</dt>
              <dd>{{ booking.contact_name }}</dd>
            </div>
            <div class="confirmation__grid-item" v-if="booking.contact_email">
              <dt>Email</dt>
              <dd>{{ booking.contact_email }}</dd>
            </div>
            <div class="confirmation__grid-item">
              <dt>Phone</dt>
              <dd>{{ booking.contact_phone }}</dd>
            </div>
          </dl>

          <p v-if="booking.special_requests" class="confirmation__requests">
            <strong>Special requests:</strong> {{ booking.special_requests }}
          </p>
        </div>

        <div class="confirmation__card">
          <h2>What Happens Next</h2>
          <ol class="confirmation__steps">
            <li v-for="(step, index) in nextSteps" :key="step.title">
              <span class="confirmation__step-index">{{ index + 1 }}</span>
              <div>
                <p class="confirmation__step-title">{{ step.title }}</p>
                <p class="confirmation__step-copy">{{ step.copy }}</p>
              </div>
            </li>
          </ol>

          <RouterLink
            v-if="status.tone !== 'confirmed'"
            :to="`/payment/${booking.booking_id}`"
            class="btn btn--primary confirmation__retry"
          >
            Retry Payment
          </RouterLink>
        </div>
      </div>

      <aside class="confirmation__col confirmation__col--side">
        <div class="confirmation__card">
          <h2>Order Summary</h2>
          <ul class="confirmation__items">
            <li v-for="(pkg, index) in booking.items" :key="`${pkg.package_id}-${index}`" class="confirmation__item">
              <img :src="pkg.image_url" :alt="pkg.name" class="confirmation__item-image" />
              <div>
                <p class="confirmation__item-name">{{ pkg.name }}</p>
                <p class="confirmation__item-meta">R{{ pkg.base_price }} / person</p>
              </div>
            </li>
          </ul>
          <div class="confirmation__total">
            <span>Total</span>
            <strong>R{{ booking.total_amount.toLocaleString() }}</strong>
          </div>
        </div>

        <RouterLink to="/bookings" class="btn btn--primary confirmation__cta">
          View My Bookings
        </RouterLink>
        <RouterLink to="/packages" class="confirmation__secondary-link">
          Browse more packages
        </RouterLink>
      </aside>
    </section>

    <section v-else class="confirmation__empty">
      <RouterLink to="/bookings" class="btn btn--primary">View My Bookings</RouterLink>
      <RouterLink to="/packages" class="confirmation__secondary-link">Browse Packages</RouterLink>
    </section>
  </main>
</template>

<style scoped>
.confirmation {
  padding-bottom: 4rem;
}

.confirmation__band {
  background: var(--color-cream-soft);
  border-bottom: 1px solid var(--color-line);
  padding: 3.5rem 1.5rem 3rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
}

.confirmation__mark {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--color-forest);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
}

.confirmation__mark--pending {
  background: #c98a1d;
}

.confirmation__mark--cancelled {
  background: #a63d3d;
}

.confirmation__eyebrow {
  color: var(--color-gold);
  font-weight: 600;
  font-size: 0.85rem;
}

.confirmation__title {
  font-size: 2.2rem;
  max-width: 30rem;
}

.confirmation__subtitle {
  color: var(--color-muted);
  max-width: 32rem;
}

.confirmation__body {
  max-width: var(--content-width);
  margin: 2.5rem auto 0;
  padding: 0 1.5rem;
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: 1.5rem;
  align-items: start;
}

.confirmation__col {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.confirmation__card {
  background: var(--color-white);
  border: 1px solid var(--color-line);
  border-radius: var(--radius-md);
  padding: 1.5rem;
}

.confirmation__card h2 {
  font-size: 1.15rem;
  margin-bottom: 1.1rem;
}

.confirmation__card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.1rem;
}

.confirmation__card-header h2 {
  margin-bottom: 0;
}

.confirmation__status {
  font-size: 0.78rem;
  font-weight: 700;
  padding: 0.3rem 0.75rem;
  border-radius: var(--radius-full);
}

.confirmation__status--pending {
  background: #f7ead0;
  color: #8a5a10;
}

.confirmation__status--confirmed {
  background: #e1ece3;
  color: var(--color-forest);
}

.confirmation__status--cancelled {
  background: #fbeaea;
  color: #a63d3d;
}

.confirmation__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem 1.5rem;
}

.confirmation__grid-item dt {
  font-size: 0.78rem;
  color: var(--color-muted);
  margin-bottom: 0.2rem;
}

.confirmation__grid-item dd {
  font-size: 0.95rem;
  font-weight: 600;
}

.confirmation__requests {
  margin-top: 1.1rem;
  padding-top: 1.1rem;
  border-top: 1px solid var(--color-line);
  font-size: 0.9rem;
  color: var(--color-muted);
}

.confirmation__steps {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.confirmation__steps li {
  display: flex;
  gap: 0.9rem;
}

.confirmation__step-index {
  flex-shrink: 0;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 50%;
  background: var(--color-cream-soft);
  color: var(--color-brown);
  font-weight: 700;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.confirmation__step-title {
  font-weight: 600;
  font-size: 0.92rem;
  margin-bottom: 0.15rem;
}

.confirmation__step-copy {
  font-size: 0.85rem;
  color: var(--color-muted);
}

.confirmation__items {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  margin-bottom: 1.1rem;
}

.confirmation__item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.confirmation__item-image {
  width: 3rem;
  height: 3rem;
  object-fit: cover;
  border-radius: var(--radius-sm);
  flex-shrink: 0;
}

.confirmation__item-name {
  font-size: 0.9rem;
  font-weight: 600;
}

.confirmation__item-meta {
  font-size: 0.8rem;
  color: var(--color-muted);
}

.confirmation__total {
  border-top: 1px solid var(--color-line);
  padding-top: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  font-size: 1.05rem;
}

.confirmation__cta {
  width: 100%;
  text-align: center;
}

.confirmation__retry {
  width: 100%;
  text-align: center;
  margin-top: 1.4rem;
}

.confirmation__secondary-link {
  text-align: center;
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--color-brown);
  padding: 0.5rem;
}

.confirmation__secondary-link:hover {
  color: var(--color-gold);
}

.confirmation__empty {
  max-width: 24rem;
  margin: 2.5rem auto 0;
  padding: 0 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  padding: 0.8rem 1.6rem;
  font-weight: 700;
  font-size: 0.95rem;
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

@media (max-width: 900px) {
  .confirmation__body {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 560px) {
  .confirmation__grid {
    grid-template-columns: 1fr;
  }
  .confirmation__title {
    font-size: 1.7rem;
  }
}
</style>
