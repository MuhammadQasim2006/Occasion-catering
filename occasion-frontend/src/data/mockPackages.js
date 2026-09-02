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
// starters/mains/desserts sections. Keyed by package_id since each package
// has its own menu tailored to its event type (a wedding menu should not
// look like a boxed corporate lunch) — falls back to defaultMenuItems for
// any package_id not listed below.
const defaultMenuItems = {
  starters: [
    { id: 'st-1', name: 'Butternut & Sage Soup', dietary: ['veg', 'halal'] },
    { id: 'st-2', name: 'Biltong & Fig Salad', dietary: ['halal'] },
    { id: 'st-3', name: 'Roasted Beet Carpaccio', dietary: ['veg', 'gf', 'halal'] },
  ],
  mains: [
    { id: 'mn-1', name: 'Slow-Roasted Lamb Shoulder', dietary: ['gf', 'halal'] },
    { id: 'mn-2', name: 'Pan-Seared Kingklip', dietary: ['gf', 'halal'] },
    { id: 'mn-3', name: 'Wild Mushroom Risotto', dietary: ['veg', 'halal'] },
    { id: 'mn-4', name: 'Free-Range Chicken Ballotine', dietary: ['halal'] },
  ],
  desserts: [
    { id: 'ds-1', name: 'Malva Pudding & Custard', dietary: ['veg', 'halal'] },
    { id: 'ds-2', name: 'Dark Chocolate Torte', dietary: ['veg', 'gf', 'halal'] },
    { id: 'ds-3', name: 'Seasonal Fruit Platter', dietary: ['veg', 'vegan', 'gf', 'halal'] },
  ],
}

const menuItemsByPackage = {
  // 1 — Executive Wedding: full-service plated wedding classics.
  1: {
    starters: [
      { id: 'w1-st-1', name: 'Butternut & Sage Soup', dietary: ['veg', 'halal'] },
      { id: 'w1-st-2', name: 'Biltong & Fig Salad', dietary: ['halal'] },
      { id: 'w1-st-3', name: 'Roasted Beet Carpaccio', dietary: ['veg', 'gf', 'halal'] },
    ],
    mains: [
      { id: 'w1-mn-1', name: 'Slow-Roasted Lamb Shoulder', dietary: ['gf', 'halal'] },
      { id: 'w1-mn-2', name: 'Pan-Seared Kingklip', dietary: ['gf', 'halal'] },
      { id: 'w1-mn-3', name: 'Wild Mushroom Risotto', dietary: ['veg', 'halal'] },
      { id: 'w1-mn-4', name: 'Free-Range Chicken Ballotine', dietary: ['halal'] },
    ],
    desserts: [
      { id: 'w1-ds-1', name: 'Malva Pudding & Custard', dietary: ['veg', 'halal'] },
      { id: 'w1-ds-2', name: 'Dark Chocolate Torte', dietary: ['veg', 'gf', 'halal'] },
      { id: 'w1-ds-3', name: 'Vanilla Bean Wedding Cake Slice', dietary: ['veg', 'halal'] },
    ],
  },

  // 2 — Corporate Brunch: buffet-style morning spread for meetings/launches.
  2: {
    starters: [
      { id: 'c2-st-1', name: 'Fresh Fruit & Granola Cups', dietary: ['veg', 'vegan', 'gf', 'halal'] },
      { id: 'c2-st-2', name: 'Mini Croissants & Danish Pastries', dietary: ['veg', 'halal'] },
      { id: 'c2-st-3', name: 'Smoked Salmon Bagel Bites', dietary: ['halal'] },
    ],
    mains: [
      { id: 'c2-mn-1', name: 'Baked Eggs Florentine', dietary: ['veg', 'halal'] },
      { id: 'c2-mn-2', name: 'Beef Rasher & Cheese Frittata', dietary: ['gf', 'halal'] },
      { id: 'c2-mn-3', name: 'Avocado & Halloumi Toast', dietary: ['veg', 'halal'] },
      { id: 'c2-mn-4', name: 'Chicken & Waffle Sliders', dietary: ['halal'] },
    ],
    desserts: [
      { id: 'c2-ds-1', name: 'Lemon Yoghurt Muffins', dietary: ['veg', 'halal'] },
      { id: 'c2-ds-2', name: 'Seasonal Fruit Platter', dietary: ['veg', 'vegan', 'gf', 'halal'] },
      { id: 'c2-ds-3', name: 'Mini Cinnamon Rolls', dietary: ['veg', 'halal'] },
    ],
  },

  // 3 — Signature Private: intimate chef-led tasting menu.
  3: {
    starters: [
      { id: 'p3-st-1', name: 'Seared Queen Prawns with Pea Purée', dietary: ['gf', 'halal'] },
      { id: 'p3-st-2', name: 'Beef Carpaccio, Truffle & Quail Egg', dietary: ['halal'] },
      { id: 'p3-st-3', name: 'Heirloom Tomato & Burrata', dietary: ['veg', 'halal'] },
    ],
    mains: [
      { id: 'p3-mn-1', name: 'Dry-Aged Sirloin, Rosemary Jus', dietary: ['gf', 'halal'] },
      { id: 'p3-mn-2', name: 'Miso-Glazed Black Cod', dietary: ['gf', 'halal'] },
      { id: 'p3-mn-3', name: 'Truffle & Parmesan Tortellini', dietary: ['veg', 'halal'] },
    ],
    desserts: [
      { id: 'p3-ds-1', name: 'Deconstructed Tiramisu', dietary: ['veg', 'halal'] },
      { id: 'p3-ds-2', name: 'Valrhona Chocolate Fondant', dietary: ['veg', 'halal'] },
      { id: 'p3-ds-3', name: 'Passionfruit & Yuzu Sorbet', dietary: ['veg', 'vegan', 'gf', 'halal'] },
    ],
  },

  // 4 — Winelands Harvest: farm-style sharing platters for tour groups.
  4: {
    starters: [
      { id: 't4-st-1', name: 'Farm Bread & Cultured Butter Board', dietary: ['veg', 'halal'] },
      { id: 't4-st-2', name: 'Cured Meats & Preserves Platter', dietary: ['gf', 'halal'] },
      { id: 't4-st-3', name: 'Marinated Olives & Farm Cheeses', dietary: ['veg', 'gf', 'halal'] },
    ],
    mains: [
      { id: 't4-mn-1', name: 'Wood-Fired Boerewors & Chutney', dietary: ['gf', 'halal'] },
      { id: 't4-mn-2', name: 'Harvest Vegetable Tart', dietary: ['veg', 'halal'] },
      { id: 't4-mn-3', name: 'Grilled Chicken & Peri Peri Basting', dietary: ['gf', 'halal'] },
    ],
    desserts: [
      { id: 't4-ds-1', name: 'Rustic Apple & Cinnamon Crumble', dietary: ['veg', 'halal'] },
      { id: 't4-ds-2', name: 'Farm Honey & Ricotta Tart', dietary: ['veg', 'halal'] },
      { id: 't4-ds-3', name: 'Seasonal Vineyard Fruit Bowl', dietary: ['veg', 'vegan', 'gf', 'halal'] },
    ],
  },

  // 5 — Garden Celebration: relaxed outdoor wedding, veg/vegan-forward.
  5: {
    starters: [
      { id: 'w5-st-1', name: 'Heirloom Tomato Gazpacho', dietary: ['veg', 'vegan', 'gf', 'halal'] },
      { id: 'w5-st-2', name: 'Grilled Peach & Burrata Salad', dietary: ['veg', 'gf', 'halal'] },
      { id: 'w5-st-3', name: 'Chargrilled Asparagus & Lemon Oil', dietary: ['veg', 'vegan', 'gf', 'halal'] },
    ],
    mains: [
      { id: 'w5-mn-1', name: 'Herb-Crusted Vegetable Wellington', dietary: ['veg', 'vegan', 'halal'] },
      { id: 'w5-mn-2', name: 'Lemon & Thyme Roast Chicken', dietary: ['gf', 'halal'] },
      { id: 'w5-mn-3', name: 'Grilled Line Fish, Salsa Verde', dietary: ['gf', 'halal'] },
      { id: 'w5-mn-4', name: 'Chickpea & Butternut Tagine', dietary: ['veg', 'vegan', 'gf', 'halal'] },
    ],
    desserts: [
      { id: 'w5-ds-1', name: 'Lavender Panna Cotta', dietary: ['veg', 'gf', 'halal'] },
      { id: 'w5-ds-2', name: 'Vegan Berry Pavlova', dietary: ['veg', 'vegan', 'gf', 'halal'] },
      { id: 'w5-ds-3', name: 'Garden Herb Lemon Tart', dietary: ['veg', 'halal'] },
    ],
  },

  // 6 — Boardroom Lunch: individually boxed, allergen-labelled lunches.
  6: {
    starters: [
      { id: 'c6-st-1', name: 'Garden Side Salad, Boxed', dietary: ['veg', 'vegan', 'gf', 'halal'] },
      { id: 'c6-st-2', name: 'Butternut Soup Cup', dietary: ['veg', 'gf', 'halal'] },
      { id: 'c6-st-3', name: 'Hummus & Crudité Box', dietary: ['veg', 'vegan', 'gf', 'halal'] },
    ],
    mains: [
      { id: 'c6-mn-1', name: 'Chicken Mayo Sandwich Box', dietary: ['halal'] },
      { id: 'c6-mn-2', name: 'Falafel & Tahini Wrap', dietary: ['veg', 'vegan', 'halal'] },
      { id: 'c6-mn-3', name: 'Grilled Steak Sandwich Box', dietary: ['halal'] },
      { id: 'c6-mn-4', name: 'Quinoa & Roast Veg Bowl', dietary: ['veg', 'vegan', 'gf', 'halal'] },
    ],
    desserts: [
      { id: 'c6-ds-1', name: 'Boxed Brownie Bite', dietary: ['veg', 'halal'] },
      { id: 'c6-ds-2', name: 'Fresh Fruit Cup', dietary: ['veg', 'vegan', 'gf', 'halal'] },
      { id: 'c6-ds-3', name: 'Oat & Berry Slice', dietary: ['veg', 'vegan', 'halal'] },
    ],
  },

  // 7 — Candlelit Anniversary: romantic five-course set menu for two.
  7: {
    starters: [
      { id: 'p7-st-1', name: 'Charred Prawn Ceviche, Citrus Mignonette', dietary: ['gf', 'halal'] },
      { id: 'p7-st-2', name: 'Wild Mushroom & Truffle Velouté', dietary: ['veg', 'gf', 'halal'] },
      { id: 'p7-st-3', name: 'Beetroot-Cured Salmon Gravlax', dietary: ['gf', 'halal'] },
    ],
    mains: [
      { id: 'p7-mn-1', name: 'Rack of Lamb, Rosemary & Red Grape Jus', dietary: ['gf', 'halal'] },
      { id: 'p7-mn-2', name: 'Butter-Poached Lobster Tail', dietary: ['gf', 'halal'] },
      { id: 'p7-mn-3', name: 'Wild Mushroom & Truffle Risotto', dietary: ['veg', 'gf', 'halal'] },
    ],
    desserts: [
      { id: 'p7-ds-1', name: 'Molten Chocolate Soufflé for Two', dietary: ['veg', 'halal'] },
      { id: 'p7-ds-2', name: 'Rose & Raspberry Jelly', dietary: ['veg', 'vegan', 'gf', 'halal'] },
      { id: 'p7-ds-3', name: 'Vanilla Bean Crème Brûlée', dietary: ['veg', 'gf', 'halal'] },
    ],
  },

  // 8 — Safari Sundowner: canapés and drinks timed to golden hour.
  8: {
    starters: [
      { id: 't8-st-1', name: 'Biltong & Cream Cheese Canapés', dietary: ['halal'] },
      { id: 't8-st-2', name: 'Smoked Springbok Carpaccio Bites', dietary: ['gf', 'halal'] },
      { id: 't8-st-3', name: 'Roasted Butternut & Feta Skewers', dietary: ['veg', 'gf', 'halal'] },
    ],
    mains: [
      { id: 't8-mn-1', name: 'Mini Boerewors Rolls', dietary: ['halal'] },
      { id: 't8-mn-2', name: 'Peri Peri Chicken Skewers', dietary: ['gf', 'halal'] },
      { id: 't8-mn-3', name: 'Grilled Halloumi & Vegetable Skewers', dietary: ['veg', 'gf', 'halal'] },
    ],
    desserts: [
      { id: 't8-ds-1', name: 'Salted Caramel Chocolate Mousse Shots', dietary: ['veg', 'halal'] },
      { id: 't8-ds-2', name: 'Rooibos-Poached Fruit Skewers', dietary: ['veg', 'vegan', 'gf', 'halal'] },
      { id: 't8-ds-3', name: 'Malva Pudding Bites', dietary: ['veg', 'halal'] },
    ],
  },
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