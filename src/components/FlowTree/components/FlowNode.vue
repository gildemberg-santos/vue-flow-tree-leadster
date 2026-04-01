<template>
  <div
    class="flow-node"
    :style="{
      background: `var(--level-${data.level}-bg)`,
      borderColor: `var(--level-${data.level}-border)`,
      color: `var(--level-${data.level}-text)`,
    }"
    @touchend="onTouchEnd"
  >
    <Handle type="target" :position="Position.Top" />
    <div class="node-badge">N{{ data.level }}</div>
    <div v-if="data.templateId == null" class="node-warn" title="Sem template válido">!</div>
    <div class="node-label">{{ data.label }}</div>
    <div
      v-if="data.maxConnections != null"
      class="node-connections"
      :class="{ full: outgoingCount >= data.maxConnections }"
    >
      ↑ {{ outgoingCount }}/{{ data.maxConnections }}
    </div>
    <Handle type="source" :position="Position.Bottom" />
    <button
      v-if="selected"
      class="node-delete nodrag"
      @click.stop="deleteNodeById(id)"
    >×</button>
  </div>
</template>

<script setup>
import { computed, inject } from 'vue'
import { Handle, Position, useVueFlow } from '@vue-flow/core'
import { useTouchDoubleTap } from '../composables/useTouchDoubleTap'

const props = defineProps({
  id: { type: String, required: true },
  data: { type: Object, required: true },
  selected: { type: Boolean, default: false },
})

const deleteNodeById = inject('deleteNodeById')

const { edges } = useVueFlow()
const outgoingCount = computed(
  () => edges.value.filter((e) => e.source === props.id).length,
)

const { onTouchEnd } = useTouchDoubleTap()
</script>

<style scoped>
.flow-node {
  padding: 12px 20px;
  border-radius: 10px;
  min-width: 120px;
  text-align: center;
  font-size: 13px;
  font-weight: 500;
  border: 2px solid transparent;
  position: relative;
  transition: box-shadow 0.2s;
  cursor: default;
  user-select: none;
}

.flow-node:hover {
  box-shadow: 0 0 0 3px #ffffff1a;
}

.node-badge {
  position: absolute;
  top: -10px;
  right: -10px;
  background: var(--t-badge-bg);
  border: 1px solid var(--t-badge-border);
  border-radius: 20px;
  font-size: 10px;
  padding: 1px 6px;
  color: var(--t-badge-text);
}

.node-warn {
  position: absolute;
  top: -10px;
  left: -10px;
  background: #c53030;
  border: 1px solid #fc8181;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 700;
  padding: 1px 6px;
  color: #fff;
}

.node-label {
  margin-top: 2px;
}

.node-connections {
  margin-top: 6px;
  font-size: 10px;
  opacity: 0.6;
  letter-spacing: 0.03em;
}

.node-connections.full {
  opacity: 1;
  color: #fc8181;
}

.node-delete {
  position: absolute;
  bottom: -10px;
  right: -10px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid #e53e3e;
  background: #742a2a;
  color: #feb2b2;
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  z-index: 10;
}
.node-delete:hover {
  background: #9b2c2c;
}
</style>
