<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

// Shell for POST /api/auth/forgot-password (see API contract, TICKET-001).
// No backend yet, so submitting just flips to a confirmation state — this
// exists mainly so Login.vue's "Forgot Password?" link goes somewhere
// instead of 404ing. Swap handleSubmit() for a real request once wired.

const email = ref('')
const error = ref('')
const isSubmitting = ref(false)
const submitted = ref(false)

function handleSubmit() {
  error.value = ''

  if (!email.value.trim()) {
    error.value = 'Please enter your email address.'
    return
  }
  if (!/^\S+@\S+\.\S+$/.test(email.value)) {
    error.value = 'Please enter a valid email address.'
    return
  }

  isSubmitting.value = true

  // Stub — swap for a real POST /api/auth/forgot-password once wired.
  // Deliberately shows the same success state whether or not the email is
  // registered, so this can't be used to check which emails have accounts.
  setTimeout(() => {
    isSubmitting.value = false
    submitted.value = true
  }, 500)
}
</script>

<template>
  <main id="main-content" class="forgot">
    <div class="forgot__card">
      <template v-if="!submitted">
        <h1 class="forgot__title">Reset your password</h1>
        <p class="forgot__subtitle">
          Enter the email address on your account and we'll send you a link to reset your
          password.
        </p>

        <form class="forgot__form" @submit.prevent="handleSubmit">
          <p v-if="error" class="forgot__error" role="alert">{{ error }}</p>

          <label class="forgot__field">
            <span class="forgot__label">Email Address</span>
            <input
              v-model="email"
              type="email"
              placeholder="Enter your email"
              autocomplete="email"
              required
            />
          </label>

          <button type="submit" class="forgot__submit" :disabled="isSubmitting">
            {{ isSubmitting ? 'Sending…' : 'Send Reset Link' }}
          </button>
        </form>
      </template>

      <template v-else>
        <h1 class="forgot__title">Check your email</h1>
        <p class="forgot__subtitle">
          If an account exists for <strong>{{ email }}</strong>, we've sent a link to reset your
          password.
        </p>
      </template>

      <p class="forgot__back">
        <RouterLink to="/login">← Back to Login</RouterLink>
      </p>
    </div>
  </main>
</template>

<style scoped>
.forgot {
  max-width: 560px;
  margin: 0 auto;
  padding: 4rem 1.5rem 5rem;
  display: flex;
  justify-content: center;
}

.forgot__card {
  width: 100%;
  background: var(--color-white);
  border: 1px solid var(--color-line);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
  padding: 2.5rem 2.25rem;
  text-align: center;
}

.forgot__title {
  font-size: 1.7rem;
}

.forgot__subtitle {
  color: var(--color-muted);
  font-size: 0.9rem;
  margin-top: 0.5rem;
  margin-bottom: 1.75rem;
}

.forgot__form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  text-align: left;
}

.forgot__error {
  background: #fbeaea;
  color: #a63d3d;
  border-radius: var(--radius-sm);
  padding: 0.65rem 0.9rem;
  font-size: 0.85rem;
}

.forgot__field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.forgot__label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-ink);
}

.forgot__field input {
  border: 1px solid var(--color-line);
  border-radius: var(--radius-sm);
  padding: 0.7rem 0.9rem;
  font-family: var(--font-body);
  font-size: 0.95rem;
  color: var(--color-ink);
  background: var(--color-white);
}

.forgot__field input:focus {
  outline: none;
  border-color: var(--color-gold);
}

.forgot__submit {
  background: var(--color-gold);
  color: var(--color-brown-deep);
  border: none;
  border-radius: var(--radius-sm);
  padding: 0.85rem;
  font-weight: 700;
  font-size: 1rem;
  transition: box-shadow 0.15s ease, transform 0.15s ease;
}

.forgot__submit:hover:not(:disabled) {
  box-shadow: 0 4px 14px rgba(207, 157, 67, 0.4);
  transform: translateY(-1px);
}

.forgot__submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.forgot__back {
  margin-top: 1.75rem;
  font-size: 0.85rem;
}

.forgot__back a {
  color: var(--color-gold);
  font-weight: 600;
}

@media (max-width: 480px) {
  .forgot__card {
    padding: 2rem 1.5rem;
  }
}
</style>
