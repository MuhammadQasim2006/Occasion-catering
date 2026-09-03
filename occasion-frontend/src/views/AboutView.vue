<template>
  <main id="main-content" class="about">
    <div class="about__panel">
      <div class="about__image">
        <span class="about__corner about__corner--tl" aria-hidden="true"></span>
        <span class="about__monogram">A.</span>
        <span class="about__corner about__corner--br" aria-hidden="true"></span>
      </div>

      <div class="about__content">
        <p class="about__eyebrow">The Chef Behind Occasion</p>
        <h1 class="about__title">Six years in kitchens, built into a platform.</h1>

        <p class="about__text">
          Occasion is led by a professionally trained chef with six years of industry
          experience, the same eye for current flavour trends and plating now goes into
          every package on the platform, from a two-person date-night box to a 200-guest
          wedding.
        </p>
        <p class="about__text">
          Every menu is thoughtfully crafted for the occasion it serves, using fresh, locally sourced ingredients — so each booking reflects the same care and quality, whatever the scale.
        </p>

        <div class="about__stats">
          <div class="about__stat">
            <p class="about__stat-value">6+</p>
            <p class="about__stat-label">Years professional experience</p>
          </div>
          <div class="about__stat">
            <p class="about__stat-value">3</p>
            <p class="about__stat-label">Booking formats, one kitchen</p>
          </div>
          <div class="about__stat">
            <p class="about__stat-value">100%</p>
            <p class="about__stat-label">Online, deposit to delivery</p>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.about {
  max-width: var(--content-width);
  margin: 0 auto;
  padding: 3rem 1.5rem;
  width: 100%;
}

.about__panel {
  display: grid;
  grid-template-columns: 0.85fr 1fr;
  gap: 3.5rem;
  align-items: center;
}

.about__image {
  position: relative;
  min-height: 420px;
  border-radius: var(--radius-md);
  background: var(--color-brown-deep);
  display: flex;
  align-items: center;
  justify-content: center;
}

.about__monogram {
  font-family: var(--font-display);
  font-style: italic;
  font-size: 4rem;
  color: var(--color-gold);
}

.about__corner {
  position: absolute;
  width: 1.75rem;
  height: 1.75rem;
  border: 1.5px solid var(--color-gold);
}

.about__corner--tl {
  top: 1.5rem;
  left: 1.5rem;
  border-right: none;
  border-bottom: none;
}

.about__corner--br {
  bottom: 1.5rem;
  right: 1.5rem;
  border-left: none;
  border-top: none;
  border-color: var(--color-cream);
  opacity: 0.5;
}

.about__content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.about__eyebrow {
  color: var(--color-gold);
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.about__title {
  font-size: 2.4rem;
  max-width: 16ch;
}

.about__text {
  color: var(--color-muted);
  max-width: 48ch;
}

.about__stats {
  margin-top: 1.25rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-line);
  display: flex;
  gap: 2.5rem;
  flex-wrap: wrap;
}

.about__stat-value {
  font-family: var(--font-display);
  font-size: 2rem;
  color: var(--color-gold);
}

.about__stat-label {
  font-size: 0.85rem;
  color: var(--color-muted);
  max-width: 16ch;
}

@media (max-width: 900px) {
  .about__panel {
    grid-template-columns: 1fr;
  }
  .about__image {
    min-height: 280px;
  }
}

@media (max-width: 560px) {
  .about__stats {
    gap: 1.5rem;
  }
}
</style>
