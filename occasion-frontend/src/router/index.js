import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PlaceholderView from '../views/PlaceholderView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/large-events',
      name: 'large-events',
      component: PlaceholderView,
      props: { title: 'Large Events' },
    },
    {
      path: '/small-events',
      name: 'small-events',
      component: PlaceholderView,
      props: { title: 'Small Events' },
    },
    {
      path: '/tours',
      name: 'tours',
      component: PlaceholderView,
      props: { title: 'Tours' },
    },
    {
      path: '/about',
      name: 'about',
      component: PlaceholderView,
      props: { title: 'About Occasion' },
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
      component: PlaceholderView,
      props: { title: 'Login' },
    },
    {
      path: '/register',
      name: 'register',
      component: PlaceholderView,
      props: { title: 'Sign Up' },
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
      path: '/packages/:id',
      name: 'package-detail',
      component: PlaceholderView,
      props: { title: 'Package Detail' },
    },
  ],
})

export default router
