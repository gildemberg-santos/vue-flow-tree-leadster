<template>
  <button
    class="theme-btn"
    :title="isDark ? 'Tema claro' : 'Tema escuro'"
    @click="emit('click')"
  >
    <!-- Sol (tema claro disponível) -->
    <svg
      v-if="isDark"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2" x2="12" y2="5" />
      <line x1="12" y1="19" x2="12" y2="22" />
      <line x1="2" y1="12" x2="5" y2="12" />
      <line x1="19" y1="12" x2="22" y2="12" />
      <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
      <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
      <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" />
      <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" />
    </svg>
    <!-- Lua (tema escuro disponível) -->
    <svg
      v-else
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  </button>
</template>

<script setup>
defineProps({
  isDark: { type: Boolean, required: true },
});
const emit = defineEmits(["click"]);
</script>

<style scoped>
.theme-btn {
  z-index: 10;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: var(--t-panel-bg);
  border: 1px solid var(--t-panel-border);
  color: var(--t-text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  touch-action: manipulation;
  transition:
    background 0.15s,
    color 0.15s,
    border-color 0.15s;
}

.theme-btn:hover {
  background: var(--t-input-bg);
  color: var(--t-text-primary);
}

@media (pointer: coarse) {
  .theme-btn {
    width: 44px;
    height: 44px;
  }
}

.theme-btn svg {
  width: 16px;
  height: 16px;
}
</style>
