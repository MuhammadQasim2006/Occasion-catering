<script setup>
defineProps({
  // Each category is { category_id, name } — matching the real `categories`
  // table exactly (category_id is a number for real rows; the parent view
  // prepends a UI-only { category_id: 'all', name: 'All' } pseudo-entry since
  // "All" isn't a real row in the database).
  categories: {
    type: Array,
    required: true,
  },
  activeId: {
    type: [Number, String],
    required: true,
  },
})

defineEmits(['select'])
</script>

<template>
  <div class="category-filter" role="tablist" aria-label="Filter packages by category">
    <button
      v-for="category in categories"
      :key="category.category_id"
      class="category-filter__pill"
      :class="{ 'category-filter__pill--active': category.category_id === activeId }"
      role="tab"
      :aria-selected="category.category_id === activeId"
      @click="$emit('select', category.category_id)"
    >
      {{ category.name }}
    </button>
  </div>
</template>

<style scoped>
.category-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.category-filter__pill {
  background: var(--color-white);
  border: 1px solid var(--color-line);
  border-radius: var(--radius-full);
  padding: 0.5rem 1.1rem;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--color-brown);
}

.category-filter__pill:hover {
  border-color: var(--color-gold);
}

.category-filter__pill--active {
  background: var(--color-gold);
  border-color: var(--color-gold);
  color: var(--color-brown-deep);
  font-weight: 600;
}
</style>
