import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { packages } from '@/data/mockPackages'

// Persisted the same way as the cart/wishlist stores so a booking made in
// Checkout.vue survives the redirect through Payment.vue → Confirmation.vue
// (each of which is its own page load) as well as a manual refresh or a
// link opened in a new tab. Without this, the in-memory store resets to
// mockBookings on every navigation and the booking created a moment ago
// "disappears" from Payment/Confirmation/BookingHistory.
const STORAGE_KEY = 'occasion:bookings:v1'

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

// Mock rows so Booking History has something to render before real data
// lands. Field names mirror the Bookings table (TICKET-006 API contract) —
// drop this block once GET /api/bookings is wired in.
const mockBookings = [
  {
    booking_id: 101,
    event_date: '2025-11-14',
    event_time: '18:00',
    guest_count: 80,
    special_requests: null,
    contact_name: 'Thandeka Nkosi',
    contact_email: 'thandeka.nkosi@example.com',
    contact_phone: '083 555 0199',
    status: 'confirmed',
    total_amount: 16800,
    items: [packages[0]],
  },
  {
    booking_id: 97,
    event_date: '2025-06-02',
    event_time: '12:30',
    guest_count: 35,
    special_requests: 'Vegetarian menu for 10 guests',
    contact_name: 'Thandeka Nkosi',
    contact_phone: '083 555 0199',
    status: 'completed',
    total_amount: 7350,
    items: packages.slice(1, 3),
  },
  {
    booking_id: 92,
    event_date: '2025-03-21',
    event_time: null,
    guest_count: 15,
    special_requests: null,
    contact_name: 'Thandeka Nkosi',
    contact_phone: '083 555 0199',
    status: 'cancelled',
    total_amount: 3000,
    items: [packages[2]],
  },
]

// Stub store — fake bookings until POST /api/bookings and GET /api/bookings
// are wired in (Week 3+, per the plan's mock-first-then-dynamic strategy).
export const useBookingsStore = defineStore('bookings', () => {
  const stored = loadFromStorage()
  const bookings = ref(stored ?? [...mockBookings]) // [{ booking_id, event_date, guest_count, status, total_amount, ... }]

  watch(
    bookings,
    (value) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
      } catch {
        // Storage can fail (private browsing, quota) — bookings still work
        // for the session, they just won't survive a refresh.
      }
    },
    { deep: true },
  )

  // Fake add — replace body with a real axios POST to /api/bookings
  function addBooking(booking) {
    const nextId = bookings.value.length
      ? Math.max(...bookings.value.map((b) => b.booking_id)) + 1
      : 1
    bookings.value.push({ booking_id: nextId, ...booking })
  }

  // Fake cancel — replace body with a real PATCH/DELETE to /api/bookings/:id
  function cancelBooking(bookingId) {
    const booking = bookings.value.find((b) => b.booking_id === bookingId)
    if (booking) booking.status = 'cancelled'
  }

  // Used by the simulated payment page (src/views/Payment.vue) to flip a
  // booking's status locally. Once real PayFast ITN handling lands (Day 7),
  // this becomes unnecessary — the backend will update status via the
  // notify webhook and the frontend will just poll GET /api/payments/:bookingId.
  function updateStatus(bookingId, status) {
    const booking = bookings.value.find((b) => b.booking_id === bookingId)
    if (booking) booking.status = status
  }

  return { bookings, addBooking, cancelBooking, updateStatus }
})
