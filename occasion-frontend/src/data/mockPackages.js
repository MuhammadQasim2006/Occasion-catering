// Mock data — stands in for GET /api/packages until the real endpoint exists
// (see Occasion Development Plan, Section 3.1: Mock-First, Then Dynamic).
// Shape mirrors the CateringPackages table so swapping in live data later
// is a drop-in replacement, not a rewrite.

export const categories = [
  { id: 'all', label: 'All' },
  { id: 'weddings', label: 'Weddings' },
  { id: 'corporate', label: 'Corporate' },
  { id: 'private-dinners', label: 'Private Dinners' },
  { id: 'tours', label: 'Tours' },
]

export const packages = [
  {
    id: 'executive-wedding',
    categoryId: 'weddings',
    name: 'Executive Wedding',
    description: 'Full-service plated dining with a dedicated coordinator on the day.',
    fromPrice: 200,
    guests: '50+ Guests',
    courses: '3 Courses',
    feature: 'Setup Included',
    badge: 'Popular',
    image:
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'corporate-brunch',
    categoryId: 'corporate',
    name: 'Corporate Brunch',
    description: 'Buffet-style brunch spread built for meetings, launches, and offsites.',
    fromPrice: 150,
    guests: '30+ Guests',
    courses: '2 Courses',
    feature: 'Setup Included',
    image:
      'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'signature-private',
    categoryId: 'private-dinners',
    name: 'Signature Private',
    description: 'An intimate, chef-led tasting menu served in your own space.',
    fromPrice: 300,
    guests: '80+ Guests',
    courses: '3 Courses',
    feature: 'Premium Service',
    badge: 'New',
    image:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'winelands-harvest',
    categoryId: 'tours',
    name: 'Winelands Harvest',
    description: 'Farm-style sharing platters, delivered en route for tour groups.',
    fromPrice: 250,
    guests: '40+ Guests',
    courses: '2 Courses',
    feature: 'Delivery Included',
    image:
      'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'garden-celebration',
    categoryId: 'weddings',
    name: 'Garden Celebration',
    description: 'Relaxed outdoor-friendly menu with vegetarian and vegan options built in.',
    fromPrice: 180,
    guests: '60+ Guests',
    courses: '3 Courses',
    feature: 'Setup Included',
    image:
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'boardroom-lunch',
    categoryId: 'corporate',
    name: 'Boardroom Lunch',
    description: 'Individually boxed lunches with allergen labelling for larger teams.',
    fromPrice: 120,
    guests: '10+ Guests',
    courses: '1 Course',
    feature: 'Delivery Included',
    image:
      'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'candlelit-anniversary',
    categoryId: 'private-dinners',
    name: 'Candlelit Anniversary',
    description: 'A five-course set menu for two, plated course by course at home.',
    fromPrice: 450,
    guests: '2+ Guests',
    courses: '5 Courses',
    feature: 'Premium Service',
    image:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'safari-sundowner',
    categoryId: 'tours',
    name: 'Safari Sundowner',
    description: 'Canapés and drinks service timed to golden hour game drives.',
    fromPrice: 220,
    guests: '20+ Guests',
    courses: '2 Courses',
    feature: 'Delivery Included',
    badge: 'New',
    image:
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=600&q=80',
  },
]

// Simulates the network latency of a real GET /api/packages call so the UI's
// loading state has something real to show. Swap this for an Axios call in
// Week 3 without changing anything that calls it.
export function fetchPackages({ delay = 500, shouldFail = false } = {}) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error('Network error'))
      } else {
        resolve(packages)
      }
    }, delay)
  })
}
