// Ratings aren't a real table yet — there's no Reviews/Ratings model in
// database.sql as of this writing. This derives a stable, plausible-looking
// rating + review count from a package's id so cards/detail pages don't sit
// empty of social proof while that table gets built. Swap for a real
// GET /api/packages/:id/rating (or an aggregate on the package payload) once
// it exists — every call site importing this can just start passing real
// data through instead.
export function pseudoRating(packageId) {
  const seed = Number(packageId) || 1
  // Bias toward a believable 4.2–4.9 range rather than a flat random spread.
  const rating = Math.round((4.2 + ((seed * 37) % 71) / 100) * 10) / 10
  const reviewCount = 18 + ((seed * 53) % 140)
  return { rating: Math.min(rating, 5), reviewCount }
}
