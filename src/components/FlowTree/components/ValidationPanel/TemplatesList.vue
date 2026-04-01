<template>
  <template v-if="templates.length">
    <div class="divider"></div>
    <div class="templates-section">
      <p class="section-label">Templates</p>
      <div class="templates-list">
        <div
          v-for="item in templates"
          :key="item.id ?? item.label"
          class="template-item"
        >
          <div class="template-header">
            <span class="template-name">{{ item.label }}</span>
            <span class="template-badge">{{ item.options?.length ?? 0 }} opções</span>
          </div>
          <ul v-if="item.options?.length" class="options-list">
            <li v-for="opt in item.options" :key="opt.id" class="option-item">
              <span class="option-dot"></span>
              {{ opt.label }}
            </li>
          </ul>
          <p v-else class="no-options">Sem saídas</p>
        </div>
      </div>
    </div>
  </template>
</template>

<script setup>
defineProps({
  templates: { type: Array, required: true },
})
</script>

<style scoped>
.divider {
  border-top: 1px solid var(--t-panel-border);
  margin: 12px 0;
}

.section-label {
  font-weight: 600;
  color: var(--t-text-muted);
  margin-bottom: 6px;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.templates-section {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.templates-list {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.template-item {
  border: 1px solid var(--t-panel-border);
  border-radius: 8px;
  padding: 8px 10px;
  background: var(--t-section-bg);
}

.template-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 6px;
}

.template-name {
  font-size: 12px;
  font-weight: 600;
  color: var(--t-text-primary);
}

.template-badge {
  font-size: 10px;
  color: var(--t-badge-text);
  background: var(--t-badge-bg);
  border: 1px solid var(--t-badge-border);
  border-radius: 10px;
  padding: 1px 7px;
  white-space: nowrap;
  flex-shrink: 0;
}

.options-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--t-text-muted);
}

.option-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--t-text-muted);
  flex-shrink: 0;
  opacity: 0.6;
}

.no-options {
  font-size: 11px;
  color: var(--t-text-muted);
  opacity: 0.6;
  margin: 0;
}
</style>
