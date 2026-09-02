<script setup>
import { ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'

const cart = useCartStore()
const auth = useAuthStore()
const route = useRoute()
const router = useRouter()
const isMenuOpen = ref(false)

function handleLogout() {
  auth.logout()
  closeMenu()
  router.push('/')
}

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/packages', label: 'Packages' },
  { to: '/large-events', label: 'Large Events' },
  { to: '/small-events', label: 'Small Events' },
  { to: '/tours', label: 'Tours' },
  { to: '/about', label: 'About' },
]

const searchQuery = ref('')

function handleSearch() {
  if (!searchQuery.value.trim()) return
  router.push({ path: '/packages', query: { q: searchQuery.value.trim() } })
  closeMenu()
}

function closeMenu() {
  isMenuOpen.value = false
}

// Close the mobile menu automatically whenever navigation happens.
watch(() => route.fullPath, closeMenu)
</script>

<template>
  <header class="navbar">
    <div class="navbar__top">
      <button
        class="navbar__hamburger"
        :aria-expanded="isMenuOpen"
        aria-controls="mobile-menu"
        aria-label="Toggle menu"
        @click="isMenuOpen = !isMenuOpen"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <RouterLink to="/" class="navbar__brand">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 3c-4 0-6 3.5-6 7v3l-2 3h16l-2-3v-3c0-3.5-2-7-6-7Z"
            stroke="var(--color-gold)"
            stroke-width="1.6"
            stroke-linejoin="round"
          />
          <path
            d="M10 19a2 2 0 0 0 4 0"
            stroke="var(--color-gold)"
            stroke-width="1.6"
            stroke-linecap="round"
          />
        </svg>
        <span class="navbar__brand-text">
          <span class="navbar__brand-name">Occasion</span>
          <span class="navbar__brand-tag">Local flavour, made with care</span>
        </span>
      </RouterLink>

      <label class="navbar__search">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="11" cy="11" r="7" stroke="var(--color-muted)" stroke-width="1.8" />
          <path d="m20 20-3.2-3.2" stroke="var(--color-muted)" stroke-width="1.8" stroke-linecap="round" />
        </svg>
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Search packages, events, tours..."
          @keyup.enter="handleSearch"
        />
      </label>

      <div class="navbar__actions">
        <RouterLink to="/cart" class="navbar__icon-btn" :aria-label="`View cart, ${cart.count} item${cart.count === 1 ? '' : 's'}`">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M3 4h2l1.6 10.4a2 2 0 0 0 2 1.6h8.3a2 2 0 0 0 2-1.6L20 8H6"
              stroke="var(--color-ink)"
              stroke-width="1.6"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <circle cx="9" cy="20" r="1.2" fill="var(--color-ink)" />
            <circle cx="17" cy="20" r="1.2" fill="var(--color-ink)" />
          </svg>
          <span v-if="cart.count" class="navbar__cart-badge" aria-hidden="true">{{ cart.count }}</span>
        </RouterLink>
        <template v-if="auth.isLoggedIn">
          <RouterLink to="/dashboard" class="navbar__account" :title="auth.user?.email">
            <span class="navbar__account-dot" aria-hidden="true"></span>
            <span class="navbar__account-email">{{ auth.user?.email }}</span>
          </RouterLink>
          <button type="button" class="navbar__logout" @click="handleLogout">Logout</button>
        </template>
        <template v-else>
          <RouterLink to="/login" class="navbar__login">Login</RouterLink>
          <RouterLink to="/register" class="navbar__signup">Sign Up</RouterLink>
        </template>
      </div>
    </div>

    <nav class="navbar__links" aria-label="Primary">
      <RouterLink
        v-for="link in navLinks"
        :key="link.to"
        :to="link.to"
        class="navbar__link"
        active-class="navbar__link--active"
        exact-active-class="navbar__link--active"
      >
        {{ link.label }}
      </RouterLink>
    </nav>

    <Transition name="menu-fade">
      <div v-if="isMenuOpen" class="navbar__scrim" @click="closeMenu"></div>
    </Transition>

    <Transition name="menu-slide">
      <nav
        v-if="isMenuOpen"
        id="mobile-menu"
        class="navbar__mobile-menu"
        aria-label="Mobile"
      >
        <button class="navbar__mobile-close" aria-label="Close menu" @click="closeMenu">
          ✕
        </button>
        <RouterLink
          v-for="link in navLinks"
          :key="`mobile-${link.to}`"
          :to="link.to"
          class="navbar__mobile-link"
        >
          {{ link.label }}
        </RouterLink>
        <div class="navbar__mobile-divider"></div>
        <template v-if="auth.isLoggedIn">
          <RouterLink to="/dashboard" class="navbar__mobile-link navbar__mobile-account">
            <span class="navbar__account-dot" aria-hidden="true"></span>
            {{ auth.user?.email }}
          </RouterLink>
          <button type="button" class="navbar__mobile-link navbar__mobile-logout" @click="handleLogout">
            Logout
          </button>
        </template>
        <template v-else>
          <RouterLink to="/login" class="navbar__mobile-link">Login</RouterLink>
          <RouterLink to="/register" class="navbar__mobile-link navbar__mobile-link--signup">
            Sign Up
          </RouterLink>
        </template>
      </nav>
    </Transition>
  </header>
</template>

<style scoped>
.navbar {
  background: var(--color-white);
  border-bottom: 1px solid var(--color-line);
  position: sticky;
  top: 0;
  z-index: 30;
}

.navbar__top {
  max-width: var(--content-width);
  margin: 0 auto;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.navbar__hamburger {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  background: none;
  border: none;
  padding: 0.4rem;
  width: 2.2rem;
  height: 2.2rem;
}

.navbar__hamburger span {
  display: block;
  height: 2px;
  background: var(--color-ink);
  border-radius: 1px;
}

.navbar__brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.navbar__brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.navbar__brand-name {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 700;
}

.navbar__brand-tag {
  font-size: 0.6rem;
  letter-spacing: 0.03em;
  color: var(--color-gold);
}

.navbar__search {
  flex: 1;
  max-width: 320px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--color-cream-soft);
  border-radius: var(--radius-full);
  padding: 0.55rem 1rem;
}

.navbar__search input {
  border: none;
  background: transparent;
  outline: none;
  font-size: 0.9rem;
  width: 100%;
  font-family: var(--font-body);
  color: var(--color-ink);
}

.navbar__actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-left: auto;
}

.navbar__icon-btn {
  position: relative;
  background: none;
  border: none;
  display: flex;
  padding: 0.25rem;
}

.navbar__cart-badge {
  position: absolute;
  top: -0.3rem;
  right: -0.4rem;
  background: var(--color-gold);
  color: var(--color-brown-deep);
  font-size: 0.65rem;
  font-weight: 700;
  min-width: 1.1rem;
  height: 1.1rem;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.2rem;
}

.navbar__login {
  border: 1px solid var(--color-line);
  border-radius: var(--radius-sm);
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  white-space: nowrap;
}

.navbar__signup {
  background: var(--color-brown-deep);
  color: var(--color-cream);
  border-radius: var(--radius-sm);
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  white-space: nowrap;
}

.navbar__account {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  border: 1px solid var(--color-line);
  border-radius: var(--radius-full);
  padding: 0.45rem 0.9rem 0.45rem 0.7rem;
  font-size: 0.85rem;
  font-weight: 500;
  max-width: 160px;
}

.navbar__account-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: #3e9a5f;
  flex-shrink: 0;
}

.navbar__account-email {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.navbar__logout {
  background: none;
  border: 1px solid var(--color-line);
  border-radius: var(--radius-sm);
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-ink);
  white-space: nowrap;
}

.navbar__logout:hover {
  border-color: var(--color-gold);
  color: var(--color-gold);
}

.navbar__mobile-account {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-muted);
  font-size: 0.9rem;
}

.navbar__mobile-logout {
  background: none;
  border: none;
  text-align: left;
  color: var(--color-ink);
  font-weight: 500;
}

.navbar__links {
  max-width: var(--content-width);
  margin: 0 auto;
  padding: 0 1.5rem 0.9rem;
  display: flex;
  gap: 1.75rem;
}

.navbar__link {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-muted);
  padding-bottom: 0.4rem;
  border-bottom: 2px solid transparent;
}

.navbar__link--active {
  color: var(--color-ink);
  border-bottom-color: var(--color-gold);
}

/* Mobile menu */
.navbar__scrim {
  position: fixed;
  inset: 0;
  background: rgba(20, 38, 29, 0.5);
  z-index: 40;
}

.navbar__mobile-menu {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: min(80vw, 320px);
  background: var(--color-white);
  z-index: 50;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  box-shadow: -8px 0 24px rgba(43, 29, 18, 0.15);
}

.navbar__mobile-close {
  align-self: flex-end;
  background: none;
  border: none;
  font-size: 1.1rem;
  padding: 0.5rem;
  margin-bottom: 1rem;
}

.navbar__mobile-link {
  padding: 0.85rem 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  border-radius: var(--radius-sm);
}

.navbar__mobile-link:hover {
  background: var(--color-cream-soft);
}

.navbar__mobile-divider {
  height: 1px;
  background: var(--color-line);
  margin: 0.75rem 0;
}

.navbar__mobile-link--signup {
  background: var(--color-brown-deep);
  color: var(--color-cream);
  text-align: center;
}

.menu-fade-enter-active,
.menu-fade-leave-active {
  transition: opacity 0.2s ease;
}
.menu-fade-enter-from,
.menu-fade-leave-to {
  opacity: 0;
}

.menu-slide-enter-active,
.menu-slide-leave-active {
  transition: transform 0.25s ease;
}
.menu-slide-enter-from,
.menu-slide-leave-to {
  transform: translateX(100%);
}

@media (prefers-reduced-motion: reduce) {
  .menu-fade-enter-active,
  .menu-fade-leave-active,
  .menu-slide-enter-active,
  .menu-slide-leave-active {
    transition: none;
  }
}

@media (max-width: 880px) {
  .navbar__account-email {
    display: none;
  }
  .navbar__account {
    padding: 0.5rem;
  }
}

@media (max-width: 720px) {
  .navbar__search {
    display: none;
  }
  .navbar__account,
  .navbar__logout {
    display: none;
  }
  .navbar__hamburger {
    display: flex;
  }
  .navbar__links {
    display: none;
  }
  .navbar__login {
    display: none;
  }
}

@media (min-width: 721px) {
  .navbar__mobile-menu,
  .navbar__scrim {
    display: none;
  }
}
</style>
