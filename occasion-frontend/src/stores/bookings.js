import { ref } from 'vue'
import { defineStore } from 'pinia'
import { packages } from '@/data/mockPackages'

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
  const bookings = ref([...mockBookings]) // [{ booking_id, event_date, guest_count, status, total_amount, ... }]

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

  return { bookings, addBooking, cancelBooking }
})
