<template>
  <div class="levels">
    <div v-for="level in maxLevels" :key="level" class="level-section">
      <div class="level-header">
        <span
          class="level-preview"
          :style="{
            background: draft[level].bg,
            borderColor: draft[level].border,
            color: draft[level].text,
          }"
          >N{{ level }}</span
        >
        <span class="level-name">{{ levelName(level, maxLevels) }}</span>
      </div>

      <div v-for="(field, label) in FIELDS" :key="field" class="color-row">
        <label>{{ label }}</label>
        <div class="color-input-wrap">
          <input type="color" v-model="draft[level][field]" />
          <span class="hex-value">{{ draft[level][field] }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { levelName } from '../../utils/levelName'

const FIELDS = { Fundo: 'bg', Borda: 'border', Texto: 'text' }

const props = defineProps({
  draft: { type: Object, required: true },
  maxLevels: { type: Number, required: true },
})
</script>

<style scoped>
.levels {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.level-section {
  background: var(--t-section-bg);
  border: 1px solid var(--t-panel-border);
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.level-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 4px;
}

.level-preview {
  width: 36px;
  height: 28px;
  border-radius: 6px;
  border: 2px solid;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
  flex-shrink: 0;
}

.level-name {
  color: var(--t-text-secondary);
  font-size: 12px;
  font-weight: 500;
}

.color-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.color-row label {
  color: var(--t-text-muted);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  width: 48px;
}

.color-input-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

input[type='color'] {
  width: 32px;
  height: 24px;
  border: 1px solid var(--t-input-border);
  border-radius: 4px;
  background: var(--t-input-bg);
  cursor: pointer;
  padding: 1px;
}

.hex-value {
  color: var(--t-text-muted);
  font-size: 11px;
  font-family: monospace;
  width: 60px;
}
</style>
