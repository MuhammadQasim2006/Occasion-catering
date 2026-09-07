import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'

// Lightweight "save for later" list — catering decisions often take days,
// so letting someone bookmark a package without committing to a guest
// count/checkout is worth more here than on a typical impulse-buy store.
// Persisted client-side only; swap for a Wishlist table once accounts need
// this to follow a user across devices.
const STORAGE_KEY = 'occasion:wishlist:v1'

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export const useWishlistStore = defineStore('wishlist', () => {
  const packageIds = ref(loadFromStorage())

  const count = computed(() => packageIds.value.length)

  watch(
    packageIds,
    (value) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
      } catch {
        // Non-fatal — wishlist just won't persist this session.
      }
    },
    { deep: true },
  )

  function has(packageId) {
    return packageIds.value.includes(packageId)
  }

  function toggle(packageId) {
    if (has(packageId)) {
      packageIds.value = packageIds.value.filter((id) => id !== packageId)
    } else {
      packageIds.value = [...packageIds.value, packageId]
    }
  }

  function remove(packageId) {
    packageIds.value = packageIds.value.filter((id) => id !== packageId)
  }

  return { packageIds, count, has, toggle, remove }
})
