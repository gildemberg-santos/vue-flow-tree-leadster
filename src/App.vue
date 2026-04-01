<template>
  <!-- maxLevels: número de níveis da árvore (padrão: 3, máximo suportado: 10) -->
  <FlowTree
    :on-load="handleLoad"
    :on-save="handleSave"
    :on-generate-id="generateId"
    :templates="flowTemplates"
    :max-levels="10"
  />
</template>

<script setup>
import FlowTree from "./components/FlowTree/index.js"
import { save, load, generateId } from "./services/flowStorageService.js"
import { toRelational, fromRelational } from "./services/flowConverter.js"
import { enrichNodes, enrichEdges } from "./services/templateEnricher.js"
import { flowTemplates } from "./config/flowTemplates.js"

async function handleLoad() {
  const data = await load()
  if (!data) return null

  const result = fromRelational(data)
  result.nodes = enrichNodes(result.nodes, flowTemplates)
  result.edges = enrichEdges(result.edges, result.nodes, flowTemplates)
  return result
}

async function handleSave(data) {
  await save(toRelational(data))
}
</script>
