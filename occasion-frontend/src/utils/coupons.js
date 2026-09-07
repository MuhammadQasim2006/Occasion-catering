// Client-side demo coupon codes — no Coupons/Promotions table exists yet,
// so this stands in for a future POST /api/coupons/validate. Swap the body
// of validateCoupon() for a real API call once that endpoint lands; keep the
// same { valid, message, discountRate } return shape so callers don't change.
const COUPONS = {
  OCCASION10: { discountRate: 0.1, message: '10% off applied.' },
  WELCOME5: { discountRate: 0.05, message: '5% welcome discount applied.' },
}

export function validateCoupon(code) {
  const key = code.trim().toUpperCase()
  const coupon = COUPONS[key]
  if (!coupon) {
    return { valid: false, message: 'That code isn’t valid or has expired.', discountRate: 0 }
  }
  return { valid: true, message: coupon.message, discountRate: coupon.discountRate, code: key }
}
