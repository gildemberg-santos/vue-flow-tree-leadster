<template>
  <div class="modal-form">
    <label>Template</label>
    <select v-if="templates.length" :value="form.label" class="node-select" ref="inputRef" @change="onTemplateSelect">
      <option value="" disabled>Selecione um template</option>
      <option v-for="item in templates" :key="item.id ?? item.label" :value="item.label">
        {{ item.label }} (máx. {{ item.options?.length ?? item.maxConnections ?? '∞' }})
      </option>
    </select>
    <input
      v-else
      v-model="form.label"
      class="node-input"
      placeholder="Nome do nó"
      ref="inputRef"
      @keyup.enter="emit('save')"
    />
    <template v-if="isAdmin">
      <label>Nível</label>
      <select v-model="form.level" class="node-select">
        <option v-for="n in maxLevels" :key="n" :value="n">{{ levelName(n, maxLevels) }}</option>
      </select>
    </template>
    <p v-if="error" class="form-error">{{ error }}</p>
  </div>
</template>

<script setup>
import { useNodeEditModal } from '../composables/useNodeEditModal'
import { levelName } from '../utils/levelName'

const form = defineModel('form', { required: true })

const props = defineProps({
  templates: { type: Array,   default: () => [] },
  maxLevels: { type: Number,  default: 3 },
  isAdmin:   { type: Boolean, default: false },
  error:     { type: String,  default: '' },
})

const emit = defineEmits(['save'])

const { inputRef, onTemplateSelect } = useNodeEditModal({ form, templates: props.templates })
</script>

<style scoped>
.modal-form {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.modal-form label {
  color: var(--t-text-muted);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 6px;
}

.node-input,
.node-select {
  background: var(--t-input-bg);
  border: 1px solid var(--t-input-border);
  border-radius: 6px;
  color: var(--t-text-primary);
  padding: 6px 10px;
  font-size: 13px;
  outline: none;
}

.node-input:focus,
.node-select:focus { border-color: #4299e1; }

.form-error {
  color: #fc8181;
  font-size: 12px;
  margin: 4px 0 0;
  border-left: 2px solid #e53e3e;
  padding-left: 8px;
}
</style>
