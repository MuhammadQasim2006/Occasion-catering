import { ref } from 'vue'
import { defineStore } from 'pinia'
import { api } from '@/utils/api'
import { useAuthStore } from '@/stores/auth'

// Wired to the real backend now (POST/GET /api/bookings, GET /api/bookings/:id,
// PUT /api/bookings/:id/status) — bookings live server-side, so there's no
// more localStorage mirror to keep in sync across tabs/refreshes.
//
// The backend returns Sequelize's nested association shape
// (BookingItems[].CateringPackage, Payment) and DECIMAL columns as strings
// (Sequelize avoids float rounding by not casting them). The views were
// built against a flatter shape (booking.items[].name/base_price/image_url,
// numeric booking.total_amount) — normalizing here means those views don't
// need to change.
function normalizeBooking(raw) {
  const items = (raw.BookingItems || []).map((bi) => ({
    package_id: bi.package_id,
    quantity: bi.quantity,
    line_total: Number(bi.line_total),
    guest_count: raw.guest_count,
    name: bi.CateringPackage?.name,
    base_price: Number(bi.CateringPackage?.base_price ?? 0),
    image_url: bi.CateringPackage?.image_url,
  }))

  return {
    ...raw,
    total_amount: Number(raw.total_amount),
    items,
    payment_status: raw.Payment?.status ?? null,
    itn_verified: raw.Payment?.itn_verified ?? false,
  }
}

export const useBookingsStore = defineStore('bookings', () => {
  const bookings = ref([])
  const isLoading = ref(false)

  function upsert(raw) {
    const normalized = normalizeBooking(raw)
    const index = bookings.value.findIndex((b) => b.booking_id === normalized.booking_id)
    if (index >= 0) {
      bookings.value[index] = normalized
    } else {
      bookings.value.push(normalized)
    }
    return normalized
  }

  // POST /api/bookings — creates the booking + line items + a pending
  // Payment row server-side, and returns the created booking with its
  // booking_id so the caller can move straight on to payment.
  async function createBooking(payload) {
    const auth = useAuthStore()
    const res = await api.post('/bookings', payload, auth.token)
    return upsert(res.data)
  }

  async function fetchBookings() {
    const auth = useAuthStore()
    if (!auth.token) return
    isLoading.value = true
    try {
      const res = await api.get('/bookings', auth.token)
      bookings.value = res.data.map(normalizeBooking)
    } finally {
      isLoading.value = false
    }
  }

  async function fetchBooking(bookingId) {
    const auth = useAuthStore()
    const res = await api.get(`/bookings/${bookingId}`, auth.token)
    return upsert(res.data)
  }

  async function cancelBooking(bookingId) {
    const auth = useAuthStore()
    const res = await api.put(`/bookings/${bookingId}/status`, { status: 'cancelled' }, auth.token)
    const booking = bookings.value.find((b) => b.booking_id === bookingId)
    if (booking) booking.status = res.data.status
    return res.data
  }

  return { bookings, isLoading, createBooking, fetchBookings, fetchBooking, cancelBooking }
})

