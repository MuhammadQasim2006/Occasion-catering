<script setup>
import { RouterView } from 'vue-router'
import AppNavbar from '@/components/common/AppNavbar.vue'
import AppFooter from '@/components/common/AppFooter.vue'
</script>

<template>
  <a href="#main-content" class="skip-link">Skip to content</a>
  <AppNavbar />
  <RouterView />
  <AppFooter />
</template>

<style scoped>
.skip-link {
  position: absolute;
  left: -9999px;
  top: 0;
  z-index: 100;
  background: var(--color-brown-deep);
  color: var(--color-cream);
  padding: 0.75rem 1.25rem;
  border-radius: 0 0 var(--radius-sm) 0;
  font-size: 0.9rem;
  font-weight: 600;
}

.skip-link:focus {
  left: 0;
}
</style>
