import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PlaceholderView from '../views/PlaceholderView.vue'
import Packages from '../views/Packages.vue'
import PackageDetail from '../views/PackageDetail.vue'
import Cart from '../views/Cart.vue'
import Checkout from '../views/Checkout.vue'
import Payment from '../views/Payment.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Dashboard from '../views/Dashboard.vue'
import BookingHistory from '../views/BookingHistory.vue'
import Confirmation from '../views/Confirmation.vue'
import AboutView from '../views/AboutView.vue'

// Import the new pages
import LargeEvents from '../views/LargeEvents.vue'
import SmallEvents from '../views/SmallEvents.vue'
import Tours from '../views/Tours.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/packages',
      name: 'packages',
      component: Packages,
    },
    {
      path: '/large-events',
      name: 'large-events',
      component: LargeEvents,
    },
    {
      path: '/small-events',
      name: 'small-events',
      component: SmallEvents,
    },
    {
      path: '/tours',
      name: 'tours',
      component: Tours,
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
    },
    {
      path: '/faq',
      name: 'faq',
      component: PlaceholderView,
      props: { title: 'FAQ' },
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
    },
    {
      path: '/terms',
      name: 'terms',
      component: PlaceholderView,
      props: { title: 'Terms & Conditions' },
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: PlaceholderView,
      props: { title: 'Privacy Policy' },
    },
    {
      path: '/cart',
      name: 'cart',
      component: Cart,
    },
    {
      path: '/packages/:id',
      name: 'package-detail',
      component: PackageDetail,
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: Checkout,
    },
    {
      path: '/payment/:bookingId',
      name: 'payment',
      component: Payment,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
    },
    {
      path: '/bookings',
      name: 'booking-history',
      component: BookingHistory,
    },
    {
      path: '/confirmation/:bookingId?',
      name: 'confirmation',
      component: Confirmation,
    },
  ],
})

export default router