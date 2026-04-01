<template>
  <div v-if="suggestions.length" class="section">
    <p class="section-label">Sugestões</p>
    <ul>
      <li v-for="suggestion in suggestions" :key="suggestion" class="suggestion-item">
        {{ suggestion }}
      </li>
    </ul>
  </div>
</template>

<script setup>
defineProps({
  suggestions: { type: Array, required: true },
})
</script>

<style scoped>
.section { margin-top: 8px; }

.section-label {
  font-weight: 600;
  color: var(--t-text-muted);
  margin-bottom: 6px;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.suggestion-item {
  color: rgba(0, 192, 240, 0.9);
  padding: 3px 0 3px 8px;
  border-left: 2px solid rgba(0, 112, 240, 0.7);
  margin-bottom: 4px;
  font-size: 12px;
}
</style>
