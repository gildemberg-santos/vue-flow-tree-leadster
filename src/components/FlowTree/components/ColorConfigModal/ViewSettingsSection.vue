<template>
  <div class="view-section">
    <p class="section-label">Visualização</p>
    <label class="toggle-row">
      <span class="toggle-label">Painel de validação</span>
      <button
        class="toggle-btn"
        :class="{ active: draftSettings.showValidationPanel }"
        @click="draftSettings.showValidationPanel = !draftSettings.showValidationPanel"
      >
        <span class="toggle-thumb"></span>
      </button>
    </label>
    <label class="toggle-row">
      <span class="toggle-label">Controles</span>
      <button
        class="toggle-btn"
        :class="{ active: draftSettings.showControls }"
        @click="draftSettings.showControls = !draftSettings.showControls"
      >
        <span class="toggle-thumb"></span>
      </button>
    </label>
  </div>
</template>

<script setup>
defineProps({
  draftSettings: { type: Object, required: true },
})
</script>

<style scoped>
.section-label {
  font-weight: 600;
  color: var(--t-text-muted);
  margin-bottom: 10px;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.view-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}

.toggle-label {
  font-size: 13px;
  color: var(--t-text-secondary);
}

.toggle-btn {
  width: 36px;
  height: 20px;
  border-radius: 10px;
  border: none;
  background: var(--t-panel-border);
  position: relative;
  cursor: pointer;
  transition: background 0.2s;
  padding: 0;
  flex-shrink: 0;
}

.toggle-btn.active { background: #0070f0; }

.toggle-thumb {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #ffffff;
  transition: transform 0.2s;
}

.toggle-btn.active .toggle-thumb { transform: translateX(16px); }
</style>
