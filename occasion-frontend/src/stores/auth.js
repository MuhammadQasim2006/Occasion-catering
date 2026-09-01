import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

// Stub store — fake auth state until Karah's live endpoints
// (POST /api/auth/login, /register, GET /api/auth/me) are wired in.
// Shape matches the API contract draft in TICKET-001 so the swap to real
// calls later is a drop-in replacement, not a rewrite.
export const useAuthStore = defineStore('auth', () => {
  const user = ref(null) // { user_id, email, role } once wired
  const token = ref(null) // JWT string once wired

  const isLoggedIn = computed(() => !!token.value)

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
