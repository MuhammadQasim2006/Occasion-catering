import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])

  const count = computed(() => items.value.length)

  function addItem(pkg) {
    items.value.push(pkg)
  }

  return { items, count, addItem }
})
