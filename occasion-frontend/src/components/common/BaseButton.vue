<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary', // 'primary' | 'secondary' | 'dark'
  },
  type: {
    type: String,
    default: 'button',
  },
})
</script>

<template>
  <button :type="type" class="base-button" :class="`base-button--${variant}`">
    <slot />
  </button>
</template>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: none;
  border-radius: var(--radius-full);
  padding: 0.75rem 1.5rem;
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 0.95rem;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.base-button:hover {
  transform: translateY(-1px);
}

.base-button--primary {
  background: var(--color-gold);
  color: var(--color-brown-deep);
}

.base-button--primary:hover {
  box-shadow: 0 4px 14px rgba(207, 157, 67, 0.4);
}

.base-button--secondary {
  background: transparent;
  color: var(--color-brown);
  border: 1px solid var(--color-line);
}

.base-button--secondary:hover {
  border-color: var(--color-gold);
}

.base-button--dark {
  background: var(--color-brown-deep);
  color: var(--color-cream);
  border-radius: var(--radius-sm);
  width: 100%;
}

.base-button--dark:hover {
  background: var(--color-brown);
}
</style>
