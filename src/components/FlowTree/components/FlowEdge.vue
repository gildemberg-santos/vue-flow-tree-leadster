<template>
  <BaseEdge :id="id" :path="edgePath" :marker-end="markerEnd" :style="style" />
  <EdgeLabelRenderer>
    <div
      v-if="label"
      class="edge-label nodrag nopan"
      :style="{ transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)` }"
    >
      {{ label }}
    </div>
    <button
      v-if="selected"
      class="edge-delete nodrag nopan"
      :style="{ transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY + (label ? 18 : 0)}px)` }"
      @click.stop="removeEdge(id)"
    >×</button>
  </EdgeLabelRenderer>
</template>

<script setup>
import { computed, inject } from 'vue'
import { BaseEdge, EdgeLabelRenderer, getBezierPath } from '@vue-flow/core'

const props = defineProps({
  id: { type: String, required: true },
  sourceX: { type: Number, required: true },
  sourceY: { type: Number, required: true },
  targetX: { type: Number, required: true },
  targetY: { type: Number, required: true },
  sourcePosition: { type: String, required: true },
  targetPosition: { type: String, required: true },
  data: { type: Object, default: () => ({}) },
  markerEnd: { type: String, default: undefined },
  style: { type: Object, default: () => ({}) },
  label: { type: String, default: undefined },
  selected: { type: Boolean, default: false },
})

const removeEdge = inject('removeEdge')

const pathResult = computed(() =>
  getBezierPath({
    sourceX: props.sourceX,
    sourceY: props.sourceY,
    sourcePosition: props.sourcePosition,
    targetX: props.targetX,
    targetY: props.targetY,
    targetPosition: props.targetPosition,
  }),
)

const edgePath = computed(() => pathResult.value[0])
const labelX = computed(() => pathResult.value[1])
const labelY = computed(() => pathResult.value[2])
</script>

<style scoped>
.edge-delete {
  position: absolute;
  pointer-events: all;
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
}
.edge-delete:hover {
  background: #9b2c2c;
}

.edge-label {
  position: absolute;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.02em;
  color: var(--t-text-primary);
  background: var(--t-panel-bg);
  border: 1px solid var(--t-panel-border);
  border-radius: 20px;
  padding: 3px 10px;
  white-space: nowrap;
  pointer-events: all;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.12);
  backdrop-filter: blur(4px);
}
</style>
