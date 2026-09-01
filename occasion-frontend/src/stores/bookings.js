import { ref } from 'vue'
import { defineStore } from 'pinia'

// Stub store — fake bookings until POST /api/bookings and GET /api/bookings
// are wired in (Week 3+, per the plan's mock-first-then-dynamic strategy).
export const useBookingsStore = defineStore('bookings', () => {
  const bookings = ref([]) // [{ booking_id, event_date, guest_count, status, total_amount, ... }]

  // Fake add — replace body with a real axios POST to /api/bookings
  function addBooking(booking) {
    bookings.value.push({ booking_id: bookings.value.length + 1, ...booking })
  }

  return { bookings, addBooking }
})
