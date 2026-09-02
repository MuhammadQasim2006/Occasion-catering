// Mock data — stands in for GET /api/packages and GET /api/packages/:id until
// those endpoints exist (see Occasion Development Plan, Section 3.1: Mock-First,
// Then Dynamic).
//
// Field names below match database.sql exactly (Qaasim's schema) so swapping in
// live Axios calls later is a drop-in replacement, not a rewrite:
//   categories:        category_id, name
//   catering_packages: package_id, category_id, name, description,
//                       base_price, event_size ('large' | 'small' | 'tour'),
//                       image_url
//
// A few fields below (guests, courses, feature, badge) are NOT columns in the
// real schema — they're presentation-only placeholders. guest_count actually
// lives on the Bookings table (it's chosen per-booking, not fixed per package),
// and "courses"/"feature" aren't modelled anywhere yet. Flagging this so nobody
// assumes the API will just start returning them — check with Qaasim before the
// Week 3 swap on whether these become real columns, computed fields, or get
// dropped from the UI.

export const categories = [
  { category_id: 1, name: 'Weddings' },
  { category_id: 2, name: 'Corporate' },
  { category_id: 3, name: 'Private Dinners' },
  { category_id: 4, name: 'Tours' },
]

export const packages = [
  {
    package_id: 1,
    category_id: 1,
    name: 'Executive Wedding',
    description: 'Full-service plated dining with a dedicated coordinator on the day.',
    base_price: 200,
    event_size: 'large',
    image_url:
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
    // UI-only, not in schema:
    guests: '50+ Guests',
    courses: '3 Courses',
    feature: 'Setup Included',
    badge: 'Popular',
  },
  {
    package_id: 2,
    category_id: 2,
    name: 'Corporate Brunch',
    description: 'Buffet-style brunch spread built for meetings, launches, and offsites.',
    base_price: 150,
    event_size: 'small',
    image_url:
      'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=600&q=80',
    guests: '30+ Guests',
    courses: '2 Courses',
    feature: 'Setup Included',
  },
  {
    package_id: 3,
    category_id: 3,
    name: 'Signature Private',
    description: 'An intimate, chef-led tasting menu served in your own space.',
    base_price: 300,
    event_size: 'small',
    image_url:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=600&q=80',
    guests: '80+ Guests',
    courses: '3 Courses',
    feature: 'Premium Service',
    badge: 'New',
  },
  {
    package_id: 4,
    category_id: 4,
    name: 'Winelands Harvest',
    description: 'Farm-style sharing platters, delivered en route for tour groups.',
    base_price: 250,
    event_size: 'tour',
    image_url:
      'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=600&q=80',
    guests: '40+ Guests',
    courses: '2 Courses',
    feature: 'Delivery Included',
  },
  {
    package_id: 5,
    category_id: 1,
    name: 'Garden Celebration',
    description: 'Relaxed outdoor-friendly menu with vegetarian and vegan options built in.',
    base_price: 180,
    event_size: 'large',
    image_url:
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=600&q=80',
    guests: '60+ Guests',
    courses: '3 Courses',
    feature: 'Setup Included',
  },
  {
    package_id: 6,
    category_id: 2,
    name: 'Boardroom Lunch',
    description: 'Individually boxed lunches with allergen labelling for larger teams.',
    base_price: 120,
    event_size: 'small',
    image_url:
      'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=600&q=80',
    guests: '10+ Guests',
    courses: '1 Course',
    feature: 'Delivery Included',
  },
  {
    package_id: 7,
    category_id: 3,
    name: 'Candlelit Anniversary',
    description: 'A five-course set menu for two, plated course by course at home.',
    base_price: 450,
    event_size: 'small',
    image_url:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=600&q=80',
    guests: '2+ Guests',
    courses: '5 Courses',
    feature: 'Premium Service',
  },
  {
    package_id: 8,
    category_id: 4,
    name: 'Safari Sundowner',
    description: 'Canapés and drinks service timed to golden hour game drives.',
    base_price: 220,
    event_size: 'tour',
    image_url:
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=600&q=80',
    guests: '20+ Guests',
    courses: '2 Courses',
    feature: 'Delivery Included',
    badge: 'New',
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

// Simulates GET /api/packages/:id.
export function fetchPackageById(id, { delay = 400, shouldFail = false } = {}) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error('Network error'))
        return
      }
      const pkg = packages.find((p) => String(p.package_id) === String(id))
      if (!pkg) {
        reject(new Error('Package not found'))
        return
      }
      resolve(pkg)
    }, delay)
  })
}

// Menu items available for customisation — NOT a real table yet (flagged in
// the header note above: menu customisation isn't modelled in database.sql
// as of this writing). Grouped by course so the detail page can render
// starters/mains/desserts sections. Keyed by package_id since different
// packages offer different menu options; falls back to a shared default set
// for any package_id not listed here.
const defaultMenuItems = {
  starters: [
    { id: 'st-1', name: 'Butternut & Sage Soup', dietary: ['veg'] },
    { id: 'st-2', name: 'Biltong & Fig Salad', dietary: [] },
    { id: 'st-3', name: 'Roasted Beet Carpaccio', dietary: ['veg', 'gf'] },
  ],
  mains: [
    { id: 'mn-1', name: 'Slow-Roasted Lamb Shoulder', dietary: ['gf'] },
    { id: 'mn-2', name: 'Pan-Seared Kingklip', dietary: ['gf'] },
    { id: 'mn-3', name: 'Wild Mushroom Risotto', dietary: ['veg'] },
    { id: 'mn-4', name: 'Free-Range Chicken Ballotine', dietary: [] },
  ],
  desserts: [
    { id: 'ds-1', name: 'Malva Pudding & Custard', dietary: ['veg'] },
    { id: 'ds-2', name: 'Dark Chocolate Torte', dietary: ['veg', 'gf'] },
    { id: 'ds-3', name: 'Seasonal Fruit Platter', dietary: ['veg', 'vegan', 'gf'] },
  ],
}

const menuItemsByPackage = {
  1: defaultMenuItems,
  3: defaultMenuItems,
  7: defaultMenuItems,
}

// Simulates GET /api/packages/:id/menu-items (or however the real endpoint
// ends up shaped — see note above, this isn't in database.sql yet).
export function fetchMenuItems(packageId, { delay = 350 } = {}) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(menuItemsByPackage[packageId] || defaultMenuItems)
    }, delay)
  })
}
