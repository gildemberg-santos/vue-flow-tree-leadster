<template>
  <div class="modal-overlay" @click.self="emit('cancel')">
    <div class="modal">
      <div class="modal-title">Selecione uma opção</div>
      <p class="modal-subtitle">Escolha qual opção esta conexão representa.</p>
      <div class="options-list">
        <button
          v-for="option in options"
          :key="option.id"
          class="option-btn"
          @click="emit('confirm', option.id)"
        >
          {{ option.label }}
        </button>
      </div>
      <div class="modal-actions">
        <button class="cancel-btn" @click="emit('cancel')">Cancelar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  options: { type: Array, required: true },
})
const emit = defineEmits(['confirm', 'cancel'])
</script>

<style scoped>
.modal-overlay {
  position: absolute;
  inset: 0;
  background: var(--t-overlay);
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal {
  background: var(--t-panel-bg);
  border: 1px solid var(--t-input-border);
  border-radius: 12px;
  padding: 20px 24px;
  width: 300px;
  font-size: 13px;
  color: var(--t-text-primary);
}

.modal-title {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 6px;
}

.modal-subtitle {
  font-size: 12px;
  color: var(--t-text-muted);
  margin-bottom: 16px;
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 260px;
  overflow-y: auto;
  padding-right: 4px;
  scrollbar-width: thin;
  scrollbar-color: var(--t-panel-border) transparent;
}

.options-list::-webkit-scrollbar { width: 4px; }
.options-list::-webkit-scrollbar-track { background: transparent; }
.options-list::-webkit-scrollbar-thumb { background: var(--t-panel-border); border-radius: 4px; }

.option-btn {
  background: var(--t-section-bg);
  border: 1px solid var(--t-panel-border);
  border-radius: 8px;
  color: var(--t-text-secondary);
  padding: 9px 14px;
  font-size: 13px;
  text-align: left;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, color 0.15s;
}

.option-btn:hover {
  background: #0070F0;
  border-color: #0070F0;
  color: #ffffff;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.cancel-btn {
  background: var(--t-input-bg);
  color: var(--t-text-secondary);
  border: 1px solid var(--t-input-border);
  border-radius: 6px;
  padding: 7px 14px;
  font-size: 13px;
  cursor: pointer;
}

.cancel-btn:hover { background: var(--t-panel-border); }
</style>
