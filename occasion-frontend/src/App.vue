<script setup>
import { RouterView } from 'vue-router'
import AppNavbar from '@/components/common/AppNavbar.vue'
import AppFooter from '@/components/common/AppFooter.vue'
</script>

<template>
  <AppNavbar />
  <RouterView />
  <AppFooter />
</template>
