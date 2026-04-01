<template>
  <button class="settings-btn" title="Configurar cores" @click="emit('click')">
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle cx="12" cy="12" r="3" />
      <path
        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
      />
    </svg>
  </button>
</template>

<script setup>
const emit = defineEmits(["click"]);
</script>

<style scoped>
.settings-btn {
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

.settings-btn:hover {
  background: var(--t-input-bg);
  color: var(--t-text-primary);
}

@media (pointer: coarse) {
  .settings-btn {
    width: 44px;
    height: 44px;
  }
}

.settings-btn svg {
  width: 16px;
  height: 16px;
}
</style>
