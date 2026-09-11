// Real GET /api/packages, /api/packages/categories, /api/packages/:id calls,
// replacing the mock layer in data/mockPackages.js. Function names and the
// shape each one resolves to are kept identical on purpose (package_id,
// category_id, name, description, base_price, event_size, image_url,
// guests, courses, feature, badge, featured) so every component built
// against the mock (PackageCard, HomeView, Packages, PackageDetail,
// LargeEvents, SmallEvents, Tours) works unchanged — only the data source
// moved.
import { api } from '@/utils/api'

// Sequelize returns DECIMAL columns as strings and the new presentation
// columns as *_label / is_featured — map those back to the flatter,
// UI-friendly field names the mock data used.
function normalizePackage(raw) {
  return {
    package_id: raw.package_id,
    category_id: raw.category_id,
    name: raw.name,
    description: raw.description,
    base_price: Number(raw.base_price),
    event_size: raw.event_size,
    image_url: raw.image_url,
    guests: raw.guests_label,
    courses: raw.courses_label,
    feature: raw.feature_label,
    badge: raw.badge,
    featured: Boolean(raw.is_featured),
    category: raw.Category ? { category_id: raw.Category.category_id, name: raw.Category.name } : undefined,
  }
}

const courseTypeToKey = {
  starter: 'starters',
  main: 'mains',
  dessert: 'desserts',
}

// Groups a package's flat MenuItems[] (course_type + dietary_tags) into the
// { starters, mains, desserts } shape PackageDetail.vue expects, with each
// item exposing { id, name, dietary }.
function groupMenuItems(menuItems = []) {
  const grouped = { starters: [], mains: [], desserts: [] }

  for (const item of menuItems) {
    const key = courseTypeToKey[item.course_type] || 'mains'
    grouped[key].push({
      id: item.menu_item_id,
      name: item.name,
      dietary: item.dietary_tags || [],
    })
  }

  return grouped
}

// GET /api/packages/categories
export async function fetchCategories() {
  const res = await api.get('/packages/categories')
  return (res.data || []).map((c) => ({ category_id: c.category_id, name: c.name }))
}

// GET /api/packages — optional { category_id, event_size, search } filters,
// applied server-side via query params.
export async function fetchPackages(params = {}) {
  const query = new URLSearchParams()
  if (params.category_id && params.category_id !== 'all') query.set('category_id', params.category_id)
  if (params.event_size && params.event_size !== 'all') query.set('event_size', params.event_size)
  if (params.search) query.set('search', params.search)

  const qs = query.toString()
  const res = await api.get(`/packages${qs ? `?${qs}` : ''}`)
  return (res.data || []).map(normalizePackage)
}

// GET /api/packages/:id
export async function fetchPackageById(id) {
  const res = await api.get(`/packages/${id}`)
  return normalizePackage(res.data)
}

// Derived from GET /api/packages/:id — the backend returns MenuItems
// nested on the package rather than a separate endpoint, so this just
// fetches the package and regroups its menu items by course.
export async function fetchMenuItems(id) {
  const res = await api.get(`/packages/${id}`)
  return groupMenuItems(res.data.MenuItems)
}
