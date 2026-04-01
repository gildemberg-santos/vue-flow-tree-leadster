<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <div class="modal">
      <div class="modal-title">{{ mode === 'add' ? 'Adicionar Nó' : 'Editar Nó' }}</div>
      <NodeEditForm
        v-model:form="form"
        :templates="templates"
        :max-levels="maxLevels"
        :is-admin="isAdmin"
        :error="error"
        @save="emit('save')"
      />
      <div class="modal-actions">
        <button class="cancel-btn" @click="emit('close')">Cancelar</button>
        <button class="save-btn" @click="emit('save')">{{ mode === 'add' ? 'Adicionar' : 'Salvar' }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import NodeEditForm from './NodeEditForm.vue'

const form = defineModel('form', { required: true })

defineProps({
  mode:      { type: String,  default: 'edit' },
  error:     { type: String,  default: '' },
  templates: { type: Array,   default: () => [] },
  maxLevels: { type: Number,  default: 3 },
  isAdmin:   { type: Boolean, default: false },
})

const emit = defineEmits(['save', 'close'])
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
  width: 280px;
  font-size: 13px;
  color: var(--t-text-primary);
}

.modal-title {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 16px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
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

.save-btn {
  background: rgba(0,112,240,0.90);
  color: rgba(255,255,255,0.95);
  border: 1px solid rgba(0,112,240,0.60);
  border-radius: 6px;
  padding: 7px 14px;
  font-size: 13px;
  cursor: pointer;
}
.save-btn:hover { background: rgba(0,192,240,0.90); border-color: rgba(0,192,240,0.60); }
</style>
