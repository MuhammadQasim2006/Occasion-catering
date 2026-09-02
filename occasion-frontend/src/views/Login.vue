<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Shell for POST /api/auth/login (see API contract, TICKET-001).
// Uses the auth Pinia store's stub login() until real endpoints land (TICKET-006).

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)
const error = ref('')
const isSubmitting = ref(false)

function handleSubmit() {
  error.value = ''

  if (!email.value || !password.value) {
    error.value = 'Please enter your email and password.'
    return
  }

  isSubmitting.value = true

  // Stub call — swap for a real POST /api/auth/login once wired.
  auth.login(email.value)
  isSubmitting.value = false
  router.push('/')
}
</script>

<template>
  <main id="main-content" class="login">
    <div class="login__card">
      <h1 class="login__title">Login to Occasion</h1>
      <p class="login__subtitle">Welcome back! Please enter your details.</p>

      <form class="login__form" @submit.prevent="handleSubmit">
        <p v-if="error" class="login__error" role="alert">{{ error }}</p>

        <label class="login__field">
          <span class="login__label">Email Address</span>
          <span class="login__input-wrap">
            <svg class="login__input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M4 6h16v12H4V6Z"
                stroke="var(--color-muted)"
                stroke-width="1.6"
                stroke-linejoin="round"
              />
              <path
                d="m4.5 6.5 7.5 6 7.5-6"
                stroke="var(--color-muted)"
                stroke-width="1.6"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <input
              v-model="email"
              type="email"
              placeholder="Enter your email"
              autocomplete="email"
              required
            />
          </span>
        </label>

        <label class="login__field">
          <span class="login__label-row">
            <span class="login__label">Password</span>
            <RouterLink to="/forgot-password" class="login__forgot">Forgot Password?</RouterLink>
          </span>
          <span class="login__input-wrap">
            <svg class="login__input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="5" y="10" width="14" height="9" rx="1.5" stroke="var(--color-muted)" stroke-width="1.6" />
              <path
                d="M8 10V7a4 4 0 0 1 8 0v3"
                stroke="var(--color-muted)"
                stroke-width="1.6"
                stroke-linecap="round"
              />
            </svg>
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Enter your password"
              autocomplete="current-password"
              required
            />
            <button
              type="button"
              class="login__toggle-visibility"
              :aria-label="showPassword ? 'Hide password' : 'Show password'"
              @click="showPassword = !showPassword"
            >
              <svg v-if="showPassword" width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"
                  stroke="var(--color-muted)"
                  stroke-width="1.6"
                  stroke-linejoin="round"
                />
                <circle cx="12" cy="12" r="3" stroke="var(--color-muted)" stroke-width="1.6" />
              </svg>
              <svg v-else width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"
                  stroke="var(--color-muted)"
                  stroke-width="1.6"
                  stroke-linejoin="round"
                />
                <circle cx="12" cy="12" r="3" stroke="var(--color-muted)" stroke-width="1.6" />
                <path d="M4 20 20 4" stroke="var(--color-muted)" stroke-width="1.6" stroke-linecap="round" />
              </svg>
            </button>
          </span>
        </label>

        <label class="login__remember">
          <input v-model="rememberMe" type="checkbox" />
          <span>Remember me</span>
        </label>

        <button type="submit" class="login__submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Logging in…' : 'Login' }}
        </button>

        <div class="login__divider">
          <span>or</span>
        </div>

        <button type="button" class="login__google">
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.57-5.17 3.57-8.82Z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.88-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.26v3.11A11.99 11.99 0 0 0 12 24Z"
            />
            <path
              fill="#FBBC05"
              d="M5.27 14.28A7.2 7.2 0 0 1 4.89 12c0-.79.14-1.56.38-2.28V6.61H1.26A11.99 11.99 0 0 0 0 12c0 1.94.46 3.77 1.26 5.39l4.01-3.11Z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.19 15.23 0 12 0 7.31 0 3.26 2.69 1.26 6.61l4.01 3.11C6.22 6.86 8.87 4.75 12 4.75Z"
            />
          </svg>
          Continue with Google
        </button>

        <p class="login__signup-prompt">
          Don't have an account?
          <RouterLink to="/register" class="login__signup-link">Sign Up</RouterLink>
        </p>
      </form>
    </div>
  </main>
</template>

<style scoped>
.login {
  max-width: 560px;
  margin: 0 auto;
  padding: 4rem 1.5rem 5rem;
  display: flex;
  justify-content: center;
}

.login__card {
  width: 100%;
  background: var(--color-white);
  border: 1px solid var(--color-line);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
  padding: 2.5rem 2.25rem;
}

.login__title {
  font-size: 1.9rem;
  text-align: center;
}

.login__subtitle {
  text-align: center;
  color: var(--color-muted);
  font-size: 0.9rem;
  margin-top: 0.5rem;
  margin-bottom: 2rem;
}

.login__form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.login__error {
  background: #fbeaea;
  color: #a63d3d;
  border-radius: var(--radius-sm);
  padding: 0.65rem 0.9rem;
  font-size: 0.85rem;
}

.login__field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.login__label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-ink);
}

.login__label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.login__forgot {
  font-size: 0.8rem;
  color: var(--color-gold);
  font-weight: 500;
}

.login__input-wrap {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  border: 1px solid var(--color-line);
  border-radius: var(--radius-sm);
  padding: 0.7rem 0.9rem;
  background: var(--color-white);
}

.login__input-wrap:focus-within {
  border-color: var(--color-gold);
}

.login__input-icon {
  flex-shrink: 0;
}

.login__input-wrap input {
  border: none;
  outline: none;
  flex: 1;
  font-family: var(--font-body);
  font-size: 0.95rem;
  color: var(--color-ink);
  background: transparent;
}

.login__toggle-visibility {
  background: none;
  border: none;
  padding: 0.1rem;
  display: flex;
  flex-shrink: 0;
}

.login__remember {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--color-ink);
}

.login__remember input {
  accent-color: var(--color-gold);
  width: 1rem;
  height: 1rem;
}

.login__submit {
  background: var(--color-gold);
  color: var(--color-brown-deep);
  border: none;
  border-radius: var(--radius-sm);
  padding: 0.85rem;
  font-weight: 700;
  font-size: 1rem;
  transition: box-shadow 0.15s ease, transform 0.15s ease;
}

.login__submit:hover:not(:disabled) {
  box-shadow: 0 4px 14px rgba(207, 157, 67, 0.4);
  transform: translateY(-1px);
}

.login__submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.login__divider {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--color-muted);
  font-size: 0.8rem;
}

.login__divider::before,
.login__divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--color-line);
}

.login__google {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  background: var(--color-white);
  border: 1px solid var(--color-line);
  border-radius: var(--radius-sm);
  padding: 0.75rem;
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--color-ink);
}

.login__google:hover {
  border-color: var(--color-muted);
}

.login__signup-prompt {
  text-align: center;
  font-size: 0.85rem;
  color: var(--color-muted);
}

.login__signup-link {
  color: var(--color-gold);
  font-weight: 600;
}

@media (max-width: 480px) {
  .login__card {
    padding: 2rem 1.5rem;
  }
}
</style>
