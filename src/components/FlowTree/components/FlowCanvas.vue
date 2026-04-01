<template>
  <VueFlow
    :nodes="nodes"
    :edges="edges"
    :default-viewport="{ zoom: 1 }"
    :min-zoom="0.5"
    :max-zoom="2"
    :zoom-on-pinch="true"
    :pan-on-drag="true"
    :pan-on-scroll="false"
    fit-view-on-init
    :delete-key-code="null"
    @connect="emit('connect', $event)"
    @node-click="emit('node-click', $event)"
    @node-drag-stop="emit('node-drag-stop', $event)"
    @node-double-click="emit('node-double-click', $event)"
  >
    <Background :pattern-color="gridColor" :gap="20" />

    <template #node-custom="nodeProps">
      <FlowNode v-bind="nodeProps" />
    </template>

    <template #edge-default="edgeProps">
      <FlowEdge v-bind="edgeProps" />
    </template>

    <FlowControls v-if="showControls" />
  </VueFlow>
</template>

<script setup>
import { VueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import FlowNode from './FlowNode.vue'
import FlowEdge from './FlowEdge.vue'
import FlowControls from './FlowControls.vue'

defineProps({
  nodes: { type: Array, required: true },
  edges: { type: Array, required: true },
  gridColor: { type: String, required: true },
  showControls: { type: Boolean, default: true },
})

const emit = defineEmits(['connect', 'node-click', 'node-drag-stop', 'node-double-click'])
</script>
