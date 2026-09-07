import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'

// Cart persists to localStorage so a refresh (or closed tab) doesn't wipe a
// guest's selections before they check out. Swap for a server-backed cart
// once accounts are wired to a real Cart/CartItems table.
const STORAGE_KEY = 'occasion:cart:v1'

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export const useCartStore = defineStore('cart', () => {
  const items = ref(loadFromStorage())

  const count = computed(() => items.value.length)

  const subtotal = computed(() =>
    items.value.reduce((sum, item) => sum + item.base_price * (item.guest_count || 1), 0),
  )

  watch(
    items,
    (value) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
      } catch {
        // Storage can fail (private browsing, quota) — cart still works for
        // the session, it just won't survive a refresh.
      }
    },
    { deep: true },
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
