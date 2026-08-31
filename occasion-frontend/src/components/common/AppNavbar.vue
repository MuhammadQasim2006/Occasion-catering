<script setup>
import { RouterLink } from 'vue-router'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/large-events', label: 'Large Events' },
  { to: '/small-events', label: 'Small Events' },
  { to: '/tours', label: 'Tours' },
  { to: '/about', label: 'About' },
]
</script>

<template>
  <header class="navbar">
    <div class="navbar__top">
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
        <input type="search" placeholder="Search packages, events, tours..." />
      </label>

      <div class="navbar__actions">
        <button class="navbar__icon-btn" aria-label="View cart">
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
        </button>
        <RouterLink to="/login" class="navbar__login">Login</RouterLink>
        <RouterLink to="/register" class="navbar__signup">Sign Up</RouterLink>
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
  background: none;
  border: none;
  display: flex;
  padding: 0.25rem;
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

@media (max-width: 720px) {
  .navbar__search {
    display: none;
  }
  .navbar__links {
    overflow-x: auto;
    gap: 1.25rem;
  }
}
</style>
