<script setup>
import { computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'

// /cart — lets guests review, adjust, and remove packages before handing off
// to Checkout.vue for event details + contact info. Each cart item already
// carries its own guest_count and menu_selections (set on PackageDetail),
// so totals here are computed per item rather than off a single shared
// guest count.

const router = useRouter()
const cart = useCartStore()

const serviceFee = computed(() => Math.round(cart.subtotal * 0.05))
const total = computed(() => cart.subtotal + serviceFee.value)

function itemSubtotal(item) {
  return item.base_price * (item.guest_count || 1)
}

function decrementGuests(index, item) {
  cart.updateGuestCount(index, (item.guest_count || 1) - 5)
}

function incrementGuests(index, item) {
  cart.updateGuestCount(index, (item.guest_count || 1) + 5)
}

function onGuestInput(index, event) {
  const value = Number(event.target.value)
  cart.updateGuestCount(index, Number.isFinite(value) ? value : 1)
}

function goToCheckout() {
  router.push('/checkout')
}
</script>

<template>
  <main id="main-content" class="cart">
    <header class="cart__header">
      <h1>Your Cart</h1>
      <p v-if="cart.count">
        {{ cart.count }} package{{ cart.count === 1 ? '' : 's' }} ready for checkout.
      </p>
      <p v-else>Your cart is currently empty.</p>
    </header>

    <div v-if="!cart.items.length" class="cart__empty">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M3 4h2l1.6 10.4a2 2 0 0 0 2 1.6h8.3a2 2 0 0 0 2-1.6L20 8H6"
          stroke="var(--color-muted)"
          stroke-width="1.4"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <circle cx="9" cy="20" r="1.2" fill="var(--color-muted)" />
        <circle cx="17" cy="20" r="1.2" fill="var(--color-muted)" />
      </svg>
      <p>You haven't added any packages yet.</p>
      <RouterLink to="/packages" class="cart__browse-link">Browse Packages</RouterLink>
    </div>

    <div v-else class="cart__layout">
      <ul class="cart__items">
        <li v-for="(item, index) in cart.items" :key="`${item.package_id}-${index}`" class="cart__item">
          <RouterLink :to="`/packages/${item.package_id}`" class="cart__item-image-wrap">
            <img :src="item.image_url" :alt="item.name" class="cart__item-image" />
          </RouterLink>

          <div class="cart__item-body">
            <div class="cart__item-top">
              <div>
                <RouterLink :to="`/packages/${item.package_id}`" class="cart__item-name">
                  {{ item.name }}
                </RouterLink>
                <p class="cart__item-price">R{{ item.base_price }} / person</p>
              </div>
              <button
                type="button"
                class="cart__item-remove"
                aria-label="Remove package from cart"
                @click="cart.removeItem(index)"
              >
                ✕
              </button>
            </div>

            <dl v-if="item.menu_selections" class="cart__menu-summary">
              <div v-if="item.menu_selections.starters?.length" class="cart__menu-row">
                <dt>Starters</dt>
                <dd>{{ item.menu_selections.starters.join(', ') }}</dd>
              </div>
              <div v-if="item.menu_selections.mains?.length" class="cart__menu-row">
                <dt>Mains</dt>
                <dd>{{ item.menu_selections.mains.join(', ') }}</dd>
              </div>
              <div v-if="item.menu_selections.desserts?.length" class="cart__menu-row">
                <dt>Desserts</dt>
                <dd>{{ item.menu_selections.desserts.join(', ') }}</dd>
              </div>
            </dl>

            <div class="cart__item-bottom">
              <label class="cart__guest-field">
                <span>Guests</span>
                <div class="cart__stepper">
                  <button
                    type="button"
                    :disabled="(item.guest_count || 1) <= 1"
                    @click="decrementGuests(index, item)"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    :value="item.guest_count || 1"
                    @change="onGuestInput(index, $event)"
                  />
                  <button type="button" @click="incrementGuests(index, item)">+</button>
                </div>
              </label>

              <p class="cart__item-subtotal">R{{ itemSubtotal(item).toLocaleString() }}</p>
            </div>
          </div>
        </li>
      </ul>

      <aside class="cart__summary">
        <h2 class="cart__summary-title">Order Summary</h2>

        <dl class="cart__totals">
          <div class="cart__totals-row">
            <dt>Subtotal</dt>
            <dd>R{{ cart.subtotal.toLocaleString() }}</dd>
          </div>
          <div class="cart__totals-row">
            <dt>Service Fee (5%)</dt>
            <dd>R{{ serviceFee.toLocaleString() }}</dd>
          </div>
          <div class="cart__totals-row cart__totals-row--total">
            <dt>Total</dt>
            <dd>R{{ total.toLocaleString() }}</dd>
          </div>
        </dl>

        <div class="cart__actions">
          <button type="button" class="cart__checkout-btn" @click="goToCheckout">
            Proceed to Checkout →
          </button>
          <RouterLink to="/packages" class="cart__continue-link">Continue Browsing</RouterLink>
        </div>

        <p class="cart__disclaimer">
          Event date and contact details are confirmed on the next step.
        </p>
      </aside>
    </div>
  </main>
</template>

<style scoped>
.cart {
  max-width: var(--content-width);
  margin: 0 auto;
  padding: 2.5rem 1.5rem 4rem;
}

.cart__header {
  margin-bottom: 2rem;
}

.cart__header h1 {
  font-size: 2rem;
  margin-bottom: 0.4rem;
}

.cart__header p {
  color: var(--color-muted);
  font-size: 0.95rem;
}

.cart__empty {
  text-align: center;
  padding: 4rem 0;
  color: var(--color-muted);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.cart__browse-link {
  background: var(--color-gold);
  color: var(--color-brown-deep);
  font-weight: 600;
  border-radius: var(--radius-full);
  padding: 0.7rem 1.5rem;
}

.cart__layout {
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: 2rem;
  align-items: start;
}

.cart__items {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.cart__item {
  background: var(--color-white);
  border: 1px solid var(--color-line);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
  display: grid;
  grid-template-columns: 9rem 1fr;
  overflow: hidden;
}

.cart__item-image-wrap {
  display: block;
}

.cart__item-image {
  width: 100%;
  height: 100%;
  min-height: 9rem;
  object-fit: cover;
}

.cart__item-body {
  padding: 1.1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  min-width: 0;
}

.cart__item-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
}

.cart__item-name {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-ink);
}

.cart__item-name:hover {
  color: var(--color-gold);
}

.cart__item-price {
  color: var(--color-muted);
  font-size: 0.85rem;
  margin-top: 0.15rem;
}

.cart__item-remove {
  background: none;
  border: none;
  color: var(--color-muted);
  font-size: 0.95rem;
  padding: 0.25rem;
  flex-shrink: 0;
}

.cart__item-remove:hover {
  color: #a63d3d;
}

.cart__menu-summary {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  border-top: 1px solid var(--color-line);
  border-bottom: 1px solid var(--color-line);
  padding: 0.75rem 0;
}

.cart__menu-row {
  display: flex;
  gap: 0.5rem;
  font-size: 0.82rem;
  line-height: 1.4;
}

.cart__menu-row dt {
  flex-shrink: 0;
  font-weight: 600;
  color: var(--color-ink);
  min-width: 4.5rem;
}

.cart__menu-row dd {
  color: var(--color-muted);
}

.cart__item-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.cart__guest-field {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.cart__guest-field > span {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-muted);
}

.cart__stepper {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.cart__stepper button {
  width: 1.9rem;
  height: 1.9rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-line);
  background: var(--color-white);
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-brown);
}

.cart__stepper button:hover:not(:disabled) {
  border-color: var(--color-gold);
  color: var(--color-gold);
}

.cart__stepper button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.cart__stepper input {
  width: 3.6rem;
  text-align: center;
  border: 1px solid var(--color-line);
  border-radius: var(--radius-sm);
  padding: 0.35rem;
  font-family: var(--font-body);
  font-size: 0.88rem;
}

.cart__item-subtotal {
  font-weight: 700;
  font-size: 1rem;
  color: var(--color-ink);
  white-space: nowrap;
}

.cart__summary {
  background: var(--color-white);
  border: 1px solid var(--color-line);
  border-radius: var(--radius-md);
  padding: 1.75rem;
  position: sticky;
  top: 5.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.cart__summary-title {
  font-size: 1.2rem;
}

.cart__totals {
  border-top: 1px solid var(--color-line);
  padding-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.cart__totals-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.88rem;
  color: var(--color-muted);
}

.cart__totals-row--total {
  border-top: 1px solid var(--color-line);
  padding-top: 0.6rem;
  margin-top: 0.2rem;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-ink);
}

.cart__actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.cart__checkout-btn {
  background: var(--color-gold);
  color: var(--color-brown-deep);
  border: none;
  border-radius: var(--radius-sm);
  padding: 0.85rem;
  font-weight: 700;
  font-size: 0.95rem;
  transition: box-shadow 0.15s ease, transform 0.15s ease;
}

.cart__checkout-btn:hover {
  box-shadow: 0 4px 14px rgba(207, 157, 67, 0.4);
  transform: translateY(-1px);
}

.cart__continue-link {
  text-align: center;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-brown);
  padding: 0.5rem;
}

.cart__continue-link:hover {
  color: var(--color-gold);
}

.cart__disclaimer {
  font-size: 0.78rem;
  color: var(--color-muted);
  text-align: center;
}

@media (max-width: 900px) {
  .cart__layout {
    grid-template-columns: 1fr;
  }
  .cart__summary {
    position: static;
  }
}

@media (max-width: 560px) {
  .cart__item {
    grid-template-columns: 1fr;
  }
  .cart__item-image-wrap {
    display: none;
  }
}
</style>
