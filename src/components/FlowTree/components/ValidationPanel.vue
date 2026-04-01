<template>
  <div
    class="validation-panel"
    :class="[
      validation.valid ? 'valid' : 'invalid',
      isMobile ? 'panel-mobile' : 'panel-desktop',
      { collapsed: isMobile && !isExpanded },
    ]"
  >
    <PanelTitle
      :valid="validation.valid"
      :is-mobile="isMobile"
      :is-expanded="isExpanded"
      @toggle="toggleExpanded"
    />

    <div v-show="!isMobile || isExpanded" class="panel-scroll">
      <ValidationErrors :errors="validation.errors" />
      <ValidationSuggestions :suggestions="validation.suggestions" />

      <div class="divider"></div>

      <LevelLegend :max-levels="maxLevels" />
      <TemplatesList :templates="templates" />
    </div>
  </div>
</template>

<script setup>
import { useResponsivePanel } from '../composables/useResponsivePanel'
import PanelTitle from './ValidationPanel/PanelTitle.vue'
import ValidationErrors from './ValidationPanel/ValidationErrors.vue'
import ValidationSuggestions from './ValidationPanel/ValidationSuggestions.vue'
import LevelLegend from './ValidationPanel/LevelLegend.vue'
import TemplatesList from './ValidationPanel/TemplatesList.vue'

defineProps({
  validation: { type: Object, required: true },
  maxLevels: { type: Number, default: 3 },
  templates: { type: Array, default: () => [] },
})

const { isMobile, isExpanded, toggleExpanded, panelMaxHeight } = useResponsivePanel()
</script>

<style scoped>
.validation-panel {
  position: absolute;
  background: var(--t-panel-bg);
  border: 1px solid var(--t-panel-border);
  z-index: 10;
  font-size: 13px;
  color: var(--t-text-primary);
  transition:
    border-color 0.3s,
    background 0.3s,
    color 0.3s,
    max-height 0.3s ease;
}

.validation-panel.valid   { border-color: rgba(0, 112, 240, 0.7); }
.validation-panel.invalid { border-color: rgba(229, 62, 62, 0.7); }

.panel-desktop {
  top: 16px;
  right: 16px;
  width: 260px;
  max-height: v-bind(panelMaxHeight);
  border-radius: 12px;
  padding: 14px 16px 0;
  display: flex;
  flex-direction: column;
}

.panel-mobile {
  bottom: 0;
  left: 0;
  right: 0;
  border-radius: 14px 14px 0 0;
  border-bottom: none;
  padding: 0 16px;
}

.panel-scroll {
  overflow-y: auto;
  flex: 1;
  padding-bottom: 14px;
  padding-right: 2px;
  scrollbar-width: thin;
  scrollbar-color: var(--t-panel-border) transparent;
}

.panel-mobile .panel-scroll { max-height: 50vh; }

.panel-scroll::-webkit-scrollbar       { width: 4px; }
.panel-scroll::-webkit-scrollbar-track { background: transparent; }
.panel-scroll::-webkit-scrollbar-thumb { background: var(--t-panel-border); border-radius: 4px; }

.divider {
  border-top: 1px solid var(--t-panel-border);
  margin: 12px 0;
}
</style>
