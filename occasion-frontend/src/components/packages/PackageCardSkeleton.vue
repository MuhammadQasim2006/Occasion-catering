<template>
  <div class="package-skeleton" aria-hidden="true">
    <div class="package-skeleton__image"></div>
    <div class="package-skeleton__body">
      <div class="package-skeleton__line package-skeleton__line--title"></div>
      <div class="package-skeleton__line package-skeleton__line--price"></div>
      <div class="package-skeleton__line"></div>
      <div class="package-skeleton__line package-skeleton__line--short"></div>
      <div class="package-skeleton__cta"></div>
    </div>
  </div>
</template>

<style scoped>
.package-skeleton {
  background: var(--color-white);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-card);
  display: flex;
  flex-direction: column;
}

.package-skeleton__image {
  height: 160px;
  background: var(--color-cream-soft);
}

.package-skeleton__body {
  padding: 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.package-skeleton__line {
  height: 0.7rem;
  border-radius: var(--radius-sm);
  background: var(--color-cream-soft);
}

.package-skeleton__line--title {
  width: 60%;
  height: 0.9rem;
}

.package-skeleton__line--price {
  width: 40%;
}

.package-skeleton__line--short {
  width: 70%;
}

.package-skeleton__cta {
  margin-top: 0.5rem;
  height: 2.4rem;
  border-radius: var(--radius-sm);
  background: var(--color-cream-soft);
}

.package-skeleton__image,
.package-skeleton__line,
.package-skeleton__cta {
  position: relative;
  overflow: hidden;
}

.package-skeleton__image::after,
.package-skeleton__line::after,
.package-skeleton__cta::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.6) 50%,
    transparent 100%
  );
  animation: shimmer 1.4s infinite;
}

@keyframes shimmer {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(100%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .package-skeleton__image::after,
  .package-skeleton__line::after,
  .package-skeleton__cta::after {
    animation: none;
  }
}
</style>
