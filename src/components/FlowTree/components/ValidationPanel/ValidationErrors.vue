<template>
  <div v-if="errors.length" class="section">
    <p class="section-label">Erros</p>
    <ul>
      <li v-for="error in errors" :key="error" class="error-item">{{ error }}</li>
    </ul>
  </div>
</template>

<script setup>
defineProps({
  errors: { type: Array, required: true },
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

.error-item {
  color: rgba(252, 129, 129, 0.9);
  padding: 3px 0 3px 8px;
  border-left: 2px solid rgba(229, 62, 62, 0.7);
  margin-bottom: 4px;
  font-size: 12px;
}
</style>
