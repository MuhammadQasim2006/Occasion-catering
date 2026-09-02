import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])

  const count = computed(() => items.value.length)

  const subtotal = computed(() =>
    items.value.reduce((sum, item) => sum + item.base_price * (item.guest_count || 1), 0),
  )

  function addItem(pkg) {
    items.value.push(pkg)
  }

  function removeItem(index) {
    items.value.splice(index, 1)
  }

  function updateGuestCount(index, guestCount) {
    const item = items.value[index]
    if (!item) return
    item.guest_count = Math.max(1, guestCount)
  }

  function clear() {
    items.value = []
  }

  return { items, count, subtotal, addItem, removeItem, updateGuestCount, clear }
})
