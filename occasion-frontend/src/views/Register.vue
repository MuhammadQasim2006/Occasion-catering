<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Shell for POST /api/auth/register (see API contract, TICKET-001).
// Uses the auth Pinia store's stub login() until real endpoints land (TICKET-006).

const router = useRouter()
const auth = useAuthStore()

const fullName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const agreeTerms = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const error = ref('')
const isSubmitting = ref(false)

function handleSubmit() {
  error.value = ''

  if (!fullName.value || !email.value || !password.value || !confirmPassword.value) {
    error.value = 'Please fill in all fields.'
    return
  }

  if (password.value.length < 8) {
    error.value = 'Password must be at least 8 characters.'
    return
  }

  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match.'
    return
  }

  if (!agreeTerms.value) {
    error.value = 'Please agree to the Terms & Conditions to continue.'
    return
  }

  isSubmitting.value = true

  // Stub call — swap for a real POST /api/auth/register once wired.
  auth.login(email.value)
  isSubmitting.value = false
  router.push('/')
}
</script>

<template>
  <main id="main-content" class="register">
    <div class="register__card">
      <h1 class="register__title">Create Your Account</h1>
      <p class="register__subtitle">Join Occasion and start planning unforgettable moments.</p>

      <form class="register__form" @submit.prevent="handleSubmit">
        <p v-if="error" class="register__error" role="alert">{{ error }}</p>

        <label class="register__field">
          <span class="register__label">Full Name</span>
          <span class="register__input-wrap">
            <svg class="register__input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="8" r="3.4" stroke="var(--color-muted)" stroke-width="1.6" />
              <path
                d="M5 20c1.2-3.6 4-5.4 7-5.4s5.8 1.8 7 5.4"
                stroke="var(--color-muted)"
                stroke-width="1.6"
                stroke-linecap="round"
              />
            </svg>
            <input
              v-model="fullName"
              type="text"
              placeholder="Enter your full name"
              autocomplete="name"
              required
            />
          </span>
        </label>

        <label class="register__field">
          <span class="register__label">Email Address</span>
          <span class="register__input-wrap">
            <svg class="register__input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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

        <label class="register__field">
          <span class="register__label">Password</span>
          <span class="register__input-wrap">
            <svg class="register__input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
              placeholder="Create a password"
              autocomplete="new-password"
              required
            />
            <button
              type="button"
              class="register__toggle-visibility"
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

        <label class="register__field">
          <span class="register__label">Confirm Password</span>
          <span class="register__input-wrap">
            <svg class="register__input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="5" y="10" width="14" height="9" rx="1.5" stroke="var(--color-muted)" stroke-width="1.6" />
              <path
                d="M8 10V7a4 4 0 0 1 8 0v3"
                stroke="var(--color-muted)"
                stroke-width="1.6"
                stroke-linecap="round"
              />
            </svg>
            <input
              v-model="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="Re-enter your password"
              autocomplete="new-password"
              required
            />
            <button
              type="button"
              class="register__toggle-visibility"
              :aria-label="showConfirmPassword ? 'Hide password' : 'Show password'"
              @click="showConfirmPassword = !showConfirmPassword"
            >
              <svg v-if="showConfirmPassword" width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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

        <label class="register__terms">
          <input v-model="agreeTerms" type="checkbox" required />
          <span>
            I agree to the
            <RouterLink to="/terms">Terms &amp; Conditions</RouterLink>
            and
            <RouterLink to="/privacy">Privacy Policy</RouterLink>
          </span>
        </label>

        <button type="submit" class="register__submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Creating account…' : 'Sign Up' }}
        </button>

        <div class="register__divider">
          <span>or</span>
        </div>

        <button type="button" class="register__google">
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

        <p class="register__login-prompt">
          Already have an account?
          <RouterLink to="/login" class="register__login-link">Login</RouterLink>
        </p>
      </form>
    </div>
  </main>
</template>

<style scoped>
.register {
  max-width: 560px;
  margin: 0 auto;
  padding: 4rem 1.5rem 5rem;
  display: flex;
  justify-content: center;
}

.register__card {
  width: 100%;
  background: var(--color-white);
  border: 1px solid var(--color-line);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
  padding: 2.5rem 2.25rem;
}

.register__title {
  font-size: 1.9rem;
  text-align: center;
}

.register__subtitle {
  text-align: center;
  color: var(--color-muted);
  font-size: 0.9rem;
  margin-top: 0.5rem;
  margin-bottom: 2rem;
}

.register__form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.register__error {
  background: #fbeaea;
  color: #a63d3d;
  border-radius: var(--radius-sm);
  padding: 0.65rem 0.9rem;
  font-size: 0.85rem;
}

.register__field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.register__label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-ink);
}

.register__input-wrap {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  border: 1px solid var(--color-line);
  border-radius: var(--radius-sm);
  padding: 0.7rem 0.9rem;
  background: var(--color-white);
}

.register__input-wrap:focus-within {
  border-color: var(--color-gold);
}

.register__input-icon {
  flex-shrink: 0;
}

.register__input-wrap input {
  border: none;
  outline: none;
  flex: 1;
  font-family: var(--font-body);
  font-size: 0.95rem;
  color: var(--color-ink);
  background: transparent;
}

.register__toggle-visibility {
  background: none;
  border: none;
  padding: 0.1rem;
  display: flex;
  flex-shrink: 0;
}

.register__terms {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 0.82rem;
  color: var(--color-ink);
  line-height: 1.4;
}

.register__terms input {
  accent-color: var(--color-gold);
  width: 1rem;
  height: 1rem;
  margin-top: 0.15rem;
  flex-shrink: 0;
}

.register__terms a {
  color: var(--color-gold);
  font-weight: 600;
}

.register__submit {
  background: var(--color-gold);
  color: var(--color-brown-deep);
  border: none;
  border-radius: var(--radius-sm);
  padding: 0.85rem;
  font-weight: 700;
  font-size: 1rem;
  transition: box-shadow 0.15s ease, transform 0.15s ease;
}

.register__submit:hover:not(:disabled) {
  box-shadow: 0 4px 14px rgba(207, 157, 67, 0.4);
  transform: translateY(-1px);
}

.register__submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.register__divider {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--color-muted);
  font-size: 0.8rem;
}

.register__divider::before,
.register__divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--color-line);
}

.register__google {
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

.register__google:hover {
  border-color: var(--color-muted);
}

.register__login-prompt {
  text-align: center;
  font-size: 0.85rem;
  color: var(--color-muted);
}

.register__login-link {
  color: var(--color-gold);
  font-weight: 600;
}

@media (max-width: 480px) {
  .register__card {
    padding: 2rem 1.5rem;
  }
}
</style>
