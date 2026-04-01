<template>
  <div class="legend">
    <p class="section-label">Níveis</p>
    <div class="legend-list">
      <div v-for="level in maxLevels" :key="level" class="legend-item">
        <span
          class="dot"
          :style="{
            background: `var(--level-${level}-bg)`,
            border: `1px solid var(--level-${level}-border)`,
          }"
        ></span>
        {{ levelName(level, maxLevels) }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { levelName } from '../../utils/levelName'

const props = defineProps({
  maxLevels: { type: Number, required: true },
})
</script>

<style scoped>
.section-label {
  font-weight: 600;
  color: var(--t-text-muted);
  margin-bottom: 6px;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.legend {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.legend-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--t-text-secondary);
  font-size: 12px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}
</style>
