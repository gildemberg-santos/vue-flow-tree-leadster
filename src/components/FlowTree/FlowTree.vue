<template>
  <div
    class="flow-tree-wrapper"
    :class="{ 
      'panel-hidden': !settings.showValidationPanel,
      'fullscreen': props.fullscreen
    }"
    :style="{ ...themeVars, ...cssVars }"
  >
    <FlowCanvas
      :nodes="nodes"
      :edges="edges"
      :grid-color="themeVars['--t-grid-color']"
      :show-controls="settings.showControls"
      @connect="onConnect"
      @node-click="onNodeClick"
      @node-drag-stop="onNodeDragStop"
      @node-double-click="onNodeDoubleClick"
    />

    <div class="toolbar">
      <SettingsButton @click="showColorModal = true" />
      <ThemeButton :is-dark="isDark" @click="toggleTheme" />
      <AddNodeButton @click="openAddModal" />
      <SaveButton
        :disabled="saveStatus === 'saving' || saveStatus === 'loading'"
        @click="manualSave"
      />
    </div>

    <ValidationPanel
      v-if="settings.showValidationPanel"
      :validation="validation"
      :max-levels="props.maxLevels"
      :templates="props.templates"
    />

    <NodeEditModal
      v-if="showAddModal"
      mode="add"
      v-model:form="addForm"
      :error="addNodeError"
      :templates="props.templates"
      :max-levels="props.maxLevels"
      :is-admin="props.isAdmin"
      @save="addNode"
      @close="showAddModal = false"
    />

    <NodeEditModal
      v-if="editingNode"
      mode="edit"
      v-model:form="editForm"
      :error="editNodeError"
      :templates="props.templates"
      :max-levels="props.maxLevels"
      :is-admin="props.isAdmin"
      @save="saveEdit"
      @close="editingNode = null"
    />

    <ColorConfigModal
      v-if="showColorModal"
      :colors="colors"
      :max-levels="props.maxLevels"
      :settings="settings"
      @save="onSaveColors"
      @close="showColorModal = false"
    />

    <ConnectionOptionModal
      v-if="pendingConnection"
      :options="pendingOptions"
      @confirm="confirmConnection"
      @cancel="cancelConnection"
    />

    <NotificationToast :save-status="saveStatus" />

    <VersionNotification
      v-if="hasNewVersion"
      @dismiss="dismissVersionNotification"
    />
  </div>
</template>

<script setup>
import { ref, provide } from 'vue'
import '@vue-flow/controls/dist/style.css'

import { useFlowTree } from './composables/useFlowTree'
import { useFlowColors } from './composables/useFlowColors'
import { useFlowTheme } from './composables/useFlowTheme'
import { useFlowSettings } from './composables/useFlowSettings'

import FlowCanvas from './components/FlowCanvas.vue'
import AddNodeButton from './components/AddNodeButton.vue'
import SettingsButton from './components/SettingsButton.vue'
import ThemeButton from './components/ThemeButton.vue'
import SaveButton from './components/SaveButton.vue'
import ValidationPanel from './components/ValidationPanel.vue'
import NodeEditModal from './components/NodeEditModal.vue'
import ColorConfigModal from './components/ColorConfigModal.vue'
import NotificationToast from './components/NotificationToast.vue'
import ConnectionOptionModal from './components/ConnectionOptionModal.vue'
import VersionNotification from './components/VersionNotification.vue'

const props = defineProps({
  fullscreen: { type: Boolean, default: true },
  onSave: { type: Function, default: null },
  onLoad: { type: Function, default: null },
  onGenerateId: { type: Function, default: null },
  templates: { type: Array, default: () => [] },
  maxLevels: { type: Number, default: 3 },
  isAdmin: { type: Boolean, default: false },
})

const emit = defineEmits(['save'])

const {
  nodes, edges, validation, saveStatus, manualSave,
  showAddModal, addForm, addNodeError, openAddModal, addNode,
  onNodeClick, onNodeDragStop, onNodeDoubleClick, onConnect,
  editingNode, editForm, editNodeError, saveEdit,
  deleteNodeById, removeEdge,
  pendingConnection, pendingOptions, confirmConnection, cancelConnection,
} = useFlowTree({
  onLoad: () => props.onLoad?.(),
  onSave: (data) => { emit('save', data); return props.onSave?.(data) },
  onGenerateId: () => props.onGenerateId?.(),
  maxLevels: props.maxLevels,
  templates: props.templates,
})

provide('removeEdge', removeEdge)
provide('deleteNodeById', deleteNodeById)

const { colors, cssVars, saveColors } = useFlowColors(props.maxLevels)
const { isDark, themeVars, toggleTheme } = useFlowTheme()
const { settings, saveSettings, hasNewVersion, dismissVersionNotification } = useFlowSettings()

const showColorModal = ref(false)

function onSaveColors({ colors: newColors, settings: newSettings }) {
  colors.value = newColors
  saveColors()
  settings.value = newSettings
  saveSettings()
  showColorModal.value = false
}
</script>

<style scoped>
.flow-tree-wrapper {
  width: 100%;
  min-height: 100vh;
  position: relative;
}

.flow-tree-wrapper.fullscreen {
  height: 100vh;
}

.flow-tree-wrapper:not(.fullscreen) {
  height: 100%;
}

.flow-tree-wrapper :deep(.vue-flow) {
  background-color: var(--t-bg);
}

/* ── Toolbar de botões ────────────────────────────────────────────────────── */
.toolbar {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 10;
  display: flex;
  flex-direction: row;
  gap: 8px;
}

@media (max-width: 600px) {
  .toolbar {
    left: 50%;
    transform: translateX(-50%);
    background: var(--t-panel-bg);
    border: 1px solid var(--t-panel-border);
    border-radius: 14px;
    padding: 6px;
    gap: 4px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18);
  }
}

/* ── FlowControls: reposicionados e maiores no mobile ── */
@media (max-width: 600px) {
  .flow-tree-wrapper :deep(.vue-flow__controls) {
    bottom: 60px;
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;
    width: fit-content;
    flex-direction: row;
    border-radius: 12px;
    padding: 5px;
    gap: 2px;
    transition: bottom 0.3s ease;
  }

  .flow-tree-wrapper.panel-hidden :deep(.vue-flow__controls) {
    bottom: 16px;
  }

  .flow-tree-wrapper :deep(.vue-flow__controls-button) {
    width: 38px;
    height: 38px;
  }

  .flow-tree-wrapper :deep(.vue-flow__controls-button svg) {
    width: 16px;
    height: 16px;
    max-width: 16px;
    max-height: 16px;
  }
}

/* ── Área de toque ampliada para handles de conexão ── */
.flow-tree-wrapper :deep(.vue-flow__handle) {
  width: 14px;
  height: 14px;
}

.flow-tree-wrapper :deep(.vue-flow__handle)::after {
  content: '';
  position: absolute;
  inset: -14px;
}

/* ── Nós com tamanho mínimo confortável para toque ── */
@media (pointer: coarse) {
  .flow-tree-wrapper :deep(.vue-flow__node) {
    min-width: 130px;
  }
}
</style>
