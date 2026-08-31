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
    fromPrice: 200,
    guests: '50+ Guests',
    courses: '3 Courses',
    feature: 'Setup Included',
    image:
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'corporate-brunch',
    categoryId: 'corporate',
    name: 'Corporate Brunch',
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
    fromPrice: 300,
    guests: '80+ Guests',
    courses: '3 Courses',
    feature: 'Premium Service',
    image:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'winelands-harvest',
    categoryId: 'tours',
    name: 'Winelands Harvest',
    fromPrice: 250,
    guests: '40+ Guests',
    courses: '2 Courses',
    feature: 'Delivery Included',
    image:
      'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=600&q=80',
  },
]
