import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'

// Stub store — fake auth state until Karah's live endpoints
// (POST /api/auth/login, /register, GET /api/auth/me) are wired in.
// Shape matches the API contract draft in TICKET-001 so the swap to real
// calls later is a drop-in replacement, not a rewrite.
//
// Persisted to localStorage like the cart/wishlist/bookings stores — without
// this, a refresh silently logs the user out (token resets to null on
// reload), which makes the "logged in" nav state, AccountMenu, and any
// auth-gated route impossible to actually test or use across a page load.
const STORAGE_KEY = 'occasion:auth:v1'

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const useAuthStore = defineStore('auth', () => {
  const stored = loadFromStorage()
  const user = ref(stored?.user ?? null) // { user_id, email, role } once wired
  const token = ref(stored?.token ?? null) // JWT string once wired

  const isLoggedIn = computed(() => !!token.value)

  watch(
    [user, token],
    ([nextUser, nextToken]) => {
      try {
        if (nextToken) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: nextUser, token: nextToken }))
        } else {
          localStorage.removeItem(STORAGE_KEY)
        }
      } catch {
        // Non-fatal — session just won't persist past this tab.
      }
    },
    { deep: true },
  )

  // Fake login — replace body with a real axios call to /api/auth/login
  function login(email) {
    user.value = { user_id: 0, email, role: 'customer' }
    token.value = 'fake-jwt-token'
  }

  function logout() {
    user.value = null
    token.value = null
  }

  return { user, token, isLoggedIn, login, logout }
})
