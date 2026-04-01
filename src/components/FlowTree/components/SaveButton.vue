<template>
  <button
    class="save-btn"
    title="Salvar"
    :disabled="disabled"
    @click="emit('click')"
  >
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path
        d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"
      />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  </button>
</template>

<script setup>
defineProps({
  disabled: { type: Boolean, default: false },
});
const emit = defineEmits(["click"]);
</script>

<style scoped>
.save-btn {
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

.save-btn:hover:not(:disabled) {
  background: #0070f0;
  border-color: #0070f0;
  color: #fff;
}

@media (pointer: coarse) {
  .save-btn {
    width: 44px;
    height: 44px;
  }
}

.save-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.save-btn svg {
  width: 16px;
  height: 16px;
}
</style>
