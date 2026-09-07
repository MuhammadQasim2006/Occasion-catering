import emailjs from '@emailjs/browser'

// Sends the booking-confirmation email straight from the browser via
// EmailJS — no backend needed. Requires a free EmailJS account
// (https://www.emailjs.com/) with an Email Service and a Template set up;
// plug their IDs into .env as the VITE_EMAILJS_* vars below. The public key
// is safe to ship in frontend code (that's how EmailJS is designed to be
// used) but EmailJS's dashboard lets you restrict which domains can send
// with it, which you should do before going live.
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

const isConfigured = Boolean(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY)

/**
 * Fire off a booking confirmation email. Never throws — a failed or
 * unconfigured email send shouldn't block the booking flow, since the
 * booking itself already succeeded by the time this is called.
 *
 * @param {object} booking - the booking record (see stores/bookings.js)
 * @returns {Promise<{ sent: boolean, reason?: string }>}
 */
export async function sendBookingConfirmationEmail(booking) {
  if (!isConfigured) {
    console.warn(
      '[email] EmailJS is not configured — set VITE_EMAILJS_SERVICE_ID, ' +
        'VITE_EMAILJS_TEMPLATE_ID and VITE_EMAILJS_PUBLIC_KEY in .env. Skipping send.',
    )
    return { sent: false, reason: 'not_configured' }
  }

  const packageList = (booking.items || [])
    .map((item) => `${item.name} (${item.guest_count || booking.guest_count} guests)`)
    .join(', ')

  const templateParams = {
    to_name: booking.contact_name,
    to_email: booking.contact_email,
    booking_id: booking.booking_id,
    booking_ref: `OCC-${booking.booking_id}`,
    event_date: booking.event_date,
    event_time: booking.event_time || 'Not specified',
    guest_count: booking.guest_count,
    package_list: packageList,
    total_amount: `R${booking.total_amount.toLocaleString()}`,
    special_requests: booking.special_requests || 'None',
  }

  try {
    await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, { publicKey: PUBLIC_KEY })
    return { sent: true }
  } catch (err) {
    console.error('[email] Failed to send booking confirmation:', err)
    return { sent: false, reason: 'send_failed' }
  }
}
