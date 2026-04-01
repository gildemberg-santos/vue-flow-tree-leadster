<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <div class="modal">
      <div class="modal-title">Configurar Cores</div>

      <div class="modal-body">
        <ColorLevelsSection :draft="draft" :max-levels="maxLevels" />
        <div class="divider"></div>
        <ViewSettingsSection :draft-settings="draftSettings" />
      </div>

      <div class="modal-footer">
        <div class="modal-actions">
          <button class="reset-btn" @click="onReset">Restaurar padrão</button>
          <button class="cancel-btn" @click="emit('close')">Cancelar</button>
          <button class="save-btn" @click="onSave">Salvar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { buildDefaultColors } from '../config/colorPalette'
import ColorLevelsSection from './ColorConfigModal/ColorLevelsSection.vue'
import ViewSettingsSection from './ColorConfigModal/ViewSettingsSection.vue'

const props = defineProps({
  colors: { type: Object, required: true },
  maxLevels: { type: Number, default: 3 },
  settings: { type: Object, required: true },
})

const emit = defineEmits(['save', 'close'])

const levels = Array.from({ length: props.maxLevels }, (_, i) => i + 1)
const draft = reactive(Object.fromEntries(levels.map((l) => [l, { ...props.colors[l] }])))
const draftSettings = reactive({ ...props.settings })

function onReset() {
  const defaults = buildDefaultColors(props.maxLevels)
  for (const level of levels) draft[level] = { ...defaults[level] }
}

function onSave() {
  emit('save', {
    colors: Object.fromEntries(levels.map((l) => [l, { ...draft[l] }])),
    settings: { ...draftSettings },
  })
}
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
  width: 320px;
  font-size: 13px;
  color: var(--t-text-primary);
  display: flex;
  flex-direction: column;
  max-height: 90vh;
}

.modal-title {
  font-size: 15px;
  font-weight: 600;
  padding: 20px 24px 16px;
  flex-shrink: 0;
}

.modal-body {
  overflow-y: auto;
  padding: 0 24px;
  flex: 1;
  scrollbar-width: thin;
  scrollbar-color: var(--t-panel-border) transparent;
}

.modal-body::-webkit-scrollbar       { width: 5px; }
.modal-body::-webkit-scrollbar-track { background: transparent; }
.modal-body::-webkit-scrollbar-thumb { background: var(--t-panel-border); border-radius: 4px; }

.modal-footer {
  padding: 12px 24px 20px;
  flex-shrink: 0;
}

.divider {
  border-top: 1px solid var(--t-panel-border);
  margin: 16px 0 12px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.reset-btn {
  background: transparent;
  color: var(--t-text-muted);
  border: 1px solid var(--t-panel-border);
  border-radius: 6px;
  padding: 7px 12px;
  font-size: 12px;
  cursor: pointer;
  margin-right: auto;
}
.reset-btn:hover {
  color: var(--t-text-secondary);
  border-color: var(--t-input-border);
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
  background: #0070f0;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  padding: 7px 14px;
  font-size: 13px;
  cursor: pointer;
}
.save-btn:hover { background: #00c0f0; }
</style>
