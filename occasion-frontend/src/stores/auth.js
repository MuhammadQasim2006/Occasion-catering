import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { api } from '@/utils/api'

// Wired to the real backend now (POST /api/auth/login, /register,
// GET /api/auth/me) — no more fake tokens. Shape (user, token, isLoggedIn)
// stays the same as the old stub so Login.vue/Register.vue/router guard
// don't need to change how they read this store.
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
  const user = ref(stored?.user ?? null) // { user_id, email, name, role }
  const token = ref(stored?.token ?? null) // JWT string

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

  async function login(email, password) {
    const res = await api.post('/auth/login', { email, password })
    user.value = res.data.user
    token.value = res.data.token
  }

  async function register({ email, password, name, phone }) {
    const res = await api.post('/auth/register', { email, password, name, phone })
    user.value = res.data.user
    token.value = res.data.token
  }

  async function fetchMe() {
    if (!token.value) return
    try {
      const res = await api.get('/auth/me', token.value)
      user.value = res.data.user
    } catch {
      // Token invalid/expired — clear the session rather than leave a
      // stale "logged in" state the backend won't honour.
      logout()
    }
  }

  function logout() {
    user.value = null
    token.value = null
  }

  return { user, token, isLoggedIn, login, register, fetchMe, logout }
})
