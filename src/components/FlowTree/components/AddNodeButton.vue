<template>
  <button class="add-node-btn" title="Adicionar nó" @click="emit('click')">
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2.5"
      stroke-linecap="round"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  </button>
</template>

<script setup>
const emit = defineEmits(["click"]);
</script>

<style scoped>
.add-node-btn {
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

.add-node-btn:hover {
  background: #0070f0;
  border-color: #0070f0;
  color: #fff;
}

@media (pointer: coarse) {
  .add-node-btn {
    width: 44px;
    height: 44px;
  }
}

.add-node-btn svg {
  width: 16px;
  height: 16px;
}
</style>
